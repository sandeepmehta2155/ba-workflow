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
| `skills/socratic-discovery.md` | Step 1c (brainstorm, if no prior output) |
| `agents/analyst.md` | Step 1c (brainstorm persona) |
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
4. **Workflow Detection** — check `docs/business-docs/` for existing business documentation:
   - If folder doesn't exist or is empty, skip workflow detection entirely and note "no business docs found"
   - If files exist, list them by filename (do NOT read contents, do NOT score relevance, do NOT analyze code for workflows)
   - Present the file list and ask user to select which ones are associated with this requirement using `AskUserQuestion` with `multiSelect: true`
   - Only read the contents of files the user selects — these become context for requirements discovery in Step 1c
   - **CRITICAL:** Workflows = files in `docs/business-docs/`. Never analyze code to detect workflows. Never invent workflows.
5. **Generate scan output** — Save to `{workspace}/{workflow_id}/project-scan.md`
6. **Display summary** to user:

```
Project Scan Complete
  Tech Stack:    {language} + {framework}
  Project Shape: {count} top-level directories
  Business Docs: {count} found in docs/business-docs/
  Workflows:     {count} relevant to requirement
```

This is awareness only — no source code is read. In Phase 2, Serena plugin's project memory is queried for business context (no live code scanning).

---

## Step 1c: Requirements Discovery — Brainstorm

This step runs Socratic brainstorming to discover implicit requirements, surface unmade decisions, and produce structured requirements output. It runs inline — no external command needed.

### Check for Existing Brainstorm Output

1. **If brainstorm output already exists** (user ran `/ba-workflow:brainstorm` or `/sc:brainstorm` previously):
   - Read the brainstorm output — it should contain: clarified user goals, functional requirements, non-functional requirements, acceptance criteria, and open questions
   - Confirm with the user using `AskUserQuestion`: "I found existing brainstorm output. How would you like to proceed?" with options:
     - "Use existing brainstorm output (Recommended)" — proceed with existing output
     - "Re-run brainstorming from scratch" — discard and run fresh
     - "Add to existing output" — run additional discovery rounds on top
   - Merge with selected workflow docs from Step 1b as additional context

2. **If no brainstorm output found** — run brainstorming inline:
   - Read `skills/socratic-discovery.md` and `agents/analyst.md`
   - Adopt the **Mary (Business Analyst)** persona
   - Execute the full Socratic discovery flow:
     1. **Parse Explicit Requirements** — Extract every explicit ask
     2. **Surface Implicit Requirements** — What does each explicit item assume?
     3. **Identify Unmade Decisions** — List unstated decisions
     4. **Ask Targeted Questions** — Use `AskUserQuestion`, ONE category at a time, adapt based on answers. Minimum 3 categories, maximum 8 (from analyst.md). User can say "enough" to end early.
     5. **Document Discoveries** — Compile structured brainstorm output
   - Present the compiled output and confirm with user using `AskUserQuestion`:
     - "Looks good — proceed (Recommended)"
     - "I want to add or change something"
     - "Run more discovery questions"

<HARD-GATE>
The workflow CANNOT proceed without brainstorm output containing at minimum: clarified user goals, functional requirements, and acceptance criteria. Brainstorming runs inline if no prior output exists.
</HARD-GATE>

### Store brainstorm output for use in Steps 2-6. The brainstorm output is the primary input for story creation.

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
  "brainstorm_output": { "goals": "...", "functional_reqs": [...], "non_functional_reqs": [...], "acceptance_criteria": [...], "open_questions": [...] },
  "elicitation_executed": true|false,
  "elicitation_insights": "...",
  "selected_workflows": [ ... ],
  "timestamp": "..."
}
```

Display:
```
Phase 1: Requirements Analysis - COMPLETE
  Workflow: {workflow_id}
  Folder:  {workspace}/{workflow_id}/
  Step 1: Requirements + Workflow Detection - Done (brainstorm complete, X workflows)
  Step 2: Elicitation Methods               - Done|Skipped

Next: Run /ba-workflow:stories for Story Creation & PO Review (Phase 2)
Or: Run /ba-workflow:go to continue automatically
```
