BA Workflow - Phase 1: Requirements Analysis (Steps 1-2): $ARGUMENTS

## Platform Compatibility
Optimized for Claude Code. On other platforms, see `docs/platform-support.md` for tool mapping. Core workflow works on all platforms — only subagent dispatch and MCP/Jira require Claude Code.

## Clean Output for Business Analysts (CRITICAL)

**This workflow is used by business analysts, not developers.** Keep visible output clean and professional.

1. **DO NOT narrate internal actions** — no "Let me read...", "Searching for...", "Good, found..."
2. **DO NOT announce tool usage** — file reads, searches, and agent work happen silently
3. **ONLY show structured outputs** — banners, summaries, questions, and menus as defined in each step
4. **First visible output** = the requirement question (or acknowledgment of $ARGUMENTS)
5. **Between steps** = only the progress banners. No filler.

## Just-in-Time Loading (CRITICAL)

**DO NOT read config, skills, agents, or scan for workflows upfront.** Start by asking for the requirement immediately (Step 1a). Load resources only when the step that needs them begins:

| Resource | Load When |
|----------|-----------|
| `skills/enforcement.md` | Immediately (before any step) — applies to all steps |
| `docs/ba-workflow-config.json` | Step 1b (after receiving requirement) |
| `skills/project-scan.md` | Step 1b (project scan) |
| `agents/analyst.md` | Step 1c (before clarifying questions) |
| `skills/socratic-discovery.md` | Step 1c (before clarifying questions) |
| `docs/business-docs/` | Step 1b (workflow detection, alongside project scan) |

If `docs/ba-workflow-config.json` doesn't exist when loaded, tell user to run `/ba-workflow:init` first.

## Workflow Scoping

**Scoping happens AFTER receiving the requirement (Step 1a), not before.**

1. **If resuming**: Only scan for in-progress workflows if user mentions resuming.

2. **If new**: After receiving the requirement, derive a `workflow_id` (kebab-case, e.g. `admin-storm-creation`, `entity-history-log`, `user-auth-google`). Ask user to confirm or edit:
   ```
   Workflow folder: {workspace}/{workflow_id}/
   Accept or enter different name:
   ```

3. **Create the folder**: `{workspace}/{workflow_id}/` and `{workspace}/{workflow_id}/stories/`

All outputs for this workflow go into this folder.

## Progress Tracking
Display progress after each step completion:
```
BA Workflow | {workflow_id} | Phase 1: Requirements Analysis
Step X of 2 complete | XX% of Phase 1
```

---

## Step 1a: Get the Initial Requirement

1. **If $ARGUMENTS is provided**, use it as the initial requirement. Otherwise ask:
   > Please provide the client requirement or rough specification for the feature/enhancement you want to analyze.

2. <HARD-GATE>
   **STOP here and wait for the requirement before doing anything else.**
   Do NOT read config, scan the project, load skills, or perform any action.
   Do NOT attempt to infer the requirement from context or file contents.
   This applies regardless of how obvious the next step seems.
   </HARD-GATE>

3. **Detect requirement format:**
   - Scan for Jira issue key pattern `[A-Z]+-\d+` (e.g., OUTAGE-123)
   - If Jira format detected: note it, auto-skip questions already answered in the ticket
   - If plain text: proceed with full question flow

---

## Step 1b: Project Scan + Workflow Detection

After receiving the requirement, run a **surface-level** project scan (read `skills/project-scan.md`) AND detect relevant workflows:

1. **Skip if resuming** — If `{workspace}/{workflow_id}/project-scan.md` already exists, read it and proceed
2. **Run 3 parallel Glob searches** — Directory layout, business docs filenames, config files
3. **Detect tech stack** from config file names (read package.json/equivalent only if framework detection needed)
4. **Workflow Detection** — scan `docs/business-docs/` for workflow docs relevant to the requirement:
   - If folder doesn't exist, skip and note "no business docs found"
   - For each file found, read and score relevance against the requirement
   - Score: Directly relevant (80-100%), Indirectly relevant (50-79%), Not relevant (<50%)
   - Extract dependencies and integration points
   - Present results:
     ```
     Detected Workflows (from docs/business-docs/):

     1. [filename.md] — Relevance: XX%
        Why: [specific reason this workflow relates to the requirement]
        Dependencies: [extracted from file]
        Key steps that apply: [specific sections]

     Recommended Additional Workflows:
     - [filename.md] — Recommendation: [why to consider]
     ```
   - Ask user to confirm using `AskUserQuestion` with `multiSelect: true`, listing each detected workflow as an option (mark recommended ones with "(Recommended)" in label).
   - **CRITICAL:** Only reference workflows that exist in `docs/business-docs/`. Never invent workflows.
5. **Generate scan output** — Save to `{workspace}/{workflow_id}/project-scan.md`
6. **Display summary** to user:

```
Project Scan Complete
  Tech Stack:    {language} + {framework}
  Project Shape: {count} top-level directories
  Business Docs: {count} found in docs/business-docs/
  Workflows:     {count} relevant to requirement
```

This is awareness only — no source code is read. Deep code analysis happens in Phase 2 if the requirement needs it.

---

## Step 1c: Clarifying Questions

Use detected workflows from Step 1b to inform your questions — reference existing business rules, edge cases, and integration points found in workflow docs.

### INTERACTIVE MODE — STRICT CONVERSATIONAL LOOP

**Always use interactive mode — walk through questions one category at a time.**

Proceed directly to the question loop below. Do NOT ask the user to choose a mode.

---

### QUESTION LOOP

<HARD-GATE>
Each response contains EXACTLY ONE category. Not two. Not "here's the rest." ONE.
Do NOT combine categories. Do NOT preview upcoming categories. Do NOT summarize previous answers alongside new questions.
</HARD-GATE>

**For each category: output one line of text for progress, then CALL the `AskUserQuestion` tool.**

The progress line is: `✓ {N}/{total} complete`

Then INVOKE (not print) the `AskUserQuestion` tool with 2-4 questions for that category. Each question must have:
- question: A specific decision question (not open-ended)
- header: Short label (max 12 chars)
- multiSelect: false (unless choices aren't mutually exclusive)
- options: 2-4 concrete options derived from the requirement and project scan. Put the recommended option FIRST with "(Recommended)" in its label. Do NOT add an "Other" option — the tool adds it automatically.

<HARD-GATE>
You MUST invoke the AskUserQuestion tool — the actual tool, not a text representation of it.
If your response contains numbered lists (1. 2. 3.), lettered lists (a) b) c)), or "Enter choice" / "Type your answer" text, you are VIOLATING this rule. The user must see an interactive selection UI with arrow keys, not text they have to type into.
</HARD-GATE>

**After user responds to the tool, show the progress line and CALL AskUserQuestion for the NEXT category. STOP after each call.**

**Category order (present ONE AT A TIME across separate responses):**
1. Scope, Behavior & Goal
2. User Interface
3. Default State
4. Integration (Business Logic Only)
5. User Roles & Permissions
6. Edge Cases
7. Scope & Boundaries
8. Business Context


### WHY THIS MATTERS
Dumping all questions at once overwhelms the user and defeats the purpose of interactive discovery. The user MUST be able to have a conversation, not fill out a form. Each answer may change what you ask next — adapt your questions based on previous answers.

### ADAPTIVE QUESTIONING
- After each answer, **adjust upcoming questions** based on what you learned
- If an answer reveals scope is narrow, skip irrelevant categories
- If an answer reveals complexity, add follow-up questions within the current category (max 2 follow-ups)
- Reference the user's own words from previous answers in your next questions

### Flexible answering rules
- Accept "skip", "N/A", "I don't know", "defer" as valid responses for any question
- Allow partial answers
- Minimum 3 categories to proceed (but allow override if user explicitly says "proceed" or "done")
- User can type "proceed" or "done" at any time to skip remaining categories

### CRITICAL: ONLY non-technical business questions
If tempted to ask about databases, APIs, caching, or code — DON'T. Defer to: "This will be addressed by the Architect during development."

### Store results mentally for use in Steps 2-3. Note which categories were answered vs skipped.

**Note:** Steps 1a, 1b, and 1c together form Step 1 (Requirements Gathering + Workflow Detection).

---

## Step 2: Advanced Elicitation Methods

1. **Read the full elicitation engine** from `the plugin's `elicitation-methods.md``. Follow its Execution Engine section EXACTLY.

2. **Always ask** (never skip silently). CALL the `AskUserQuestion` tool with:
   - question: "Which elicitation method would you like to apply to deepen the requirements?"
   - header: "Elicitation"
   - multiSelect: true
   - options: 4 smart-selected methods relevant to this requirement. First option has "(Recommended)" in its label. Each option label is the method name, description explains relevance to THIS requirement.

   The "Other" option is auto-added. If user selects "Other" and types "skip", proceed without elicitation. If they type "reshuffle", present 4 different methods.

3. **Handle responses:**
   - **Method(s) selected**: Execute selected method(s). Show enhanced insights as text. Then CALL the `AskUserQuestion` tool with question "Apply these elicitation insights to the requirements?", header "Apply", multiSelect false, and three options: "Apply & continue (Recommended)" / "Apply & proceed" / "Discard".
   - **"Apply & continue"**: Apply changes, CALL `AskUserQuestion` again with NEW methods.
   - **"Apply & proceed"**: Apply changes, move to next step.
   - **"Discard"**: Discard insights, CALL `AskUserQuestion` again with different methods.

4. **CRITICAL: Always re-invoke the AskUserQuestion tool after each method execution** (unless user chose "proceed"). The loop continues until user proceeds.

5. **If user selects "Other" with "skip" immediately:** Note "elicitation skipped" and proceed.

---

## Phase 1 Complete

Save all gathered data to `{workspace}/{workflow_id}/state.json`:
```json
{
  "workflow_id": "{workflow_id}",
  "story_title": "...",
  "phase": 1,
  "status": "phase_1_complete",
  "started_at": "...",
  "requirement": "...",
  "requirement_format": "text|jira",
  "clarifying_answers": { ... },
  "categories_completed": 5,
  "categories_skipped": 3,
  "elicitation_executed": true|false,
  "elicitation_insights": "...",
  "selected_workflows": [ ... ],
  "workflow_analysis": [ ... ],
  "timestamp": "..."
}
```

Display:
```
Phase 1: Requirements Analysis - COMPLETE
  Workflow: {workflow_id}
  Folder:  {workspace}/{workflow_id}/
  Step 1: Requirements + Workflow Detection - Done (X/8 categories, X workflows)
  Step 2: Elicitation Methods               - Done|Skipped

Next: Run /ba-workflow:stories for Story Creation & PO Review (Phase 2)
Or: Run /ba-workflow:go to continue automatically
```
