BA Workflow - Phase 1: Requirements Analysis (Steps 1-3): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If it doesn't exist, tell user to run `/ba-workflow:init` first.
2. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona for ALL interactions in this phase.
3. If `docs/business-docs/` exists, note it for Step 3 workflow detection.

## Skills Injected (read these before starting)
- **`skills/socratic-discovery.md`** — Apply in Step 1 after receiving requirement. Parse explicit asks → surface implicit requirements → identify unmade decisions → ask targeted questions with options + defaults.
- **`skills/requirement-quality-scoring.md`** — Apply after Step 1 completes. Score the requirement (Clarity/Specificity/Actionability/Grammar/Scope). Gate: score < 60% → force refinement before Step 2.
- **`skills/confidence-scoring.md`** — Apply at Phase 1 completion. Self-rate confidence. LOW → halt and ask user.

## Workflow Scoping (CRITICAL)

Before starting, establish the **workflow folder** for this run:

1. **If resuming**: Check if user specifies an existing workflow folder. Scan `{workspace}/` for folders with incomplete `state.json`. If found, ask:
   ```
   Found in-progress workflow(s):
     1. admin-storm-creation/ (phase 1, started 2026-03-18)
     2. [Start new workflow]

   Resume existing or start new?
   ```

2. **If new**: After Step 1 (once the requirement is understood), derive a `workflow_id` (kebab-case, e.g. `admin-storm-creation`, `entity-history-log`, `user-auth-google`). Ask user to confirm or edit:
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
Step X of 3 complete | XX% of Phase 1
```

---

## Step 1: Requirements Gathering

1. **If $ARGUMENTS is provided**, use it as the initial requirement. Otherwise ask:
   > Please provide the client requirement or rough specification for the feature/enhancement you want to analyze.

2. **Detect requirement format:**
   - Scan for Jira issue key pattern `[A-Z]+-\d+` (e.g., OUTAGE-123)
   - If Jira format detected: note it, auto-skip questions already answered in the ticket
   - If plain text: proceed with full question flow

3. **INTERACTIVE QUESTIONING — ONE CATEGORY AT A TIME.**

   **CRITICAL RULE: Ask ONE category of questions, then STOP AND WAIT for the user's answer before proceeding to the next category. NEVER present all questions at once.**

   First, ask the user their preferred mode:
   ```
   How would you like to answer clarifying questions?
   1. One category at a time (recommended — interactive)
   2. Skip all — proceed with requirement as-is
   3. Essential only (Scope, Business Context, Boundaries)
   ```

   **Then, for each category, follow this exact loop:**
   ```
   a) Show category name and progress: "Category 1 of 8: Scope, Behavior & Goal"
   b) Ask 2-4 questions for ONLY this category
   c) STOP. Wait for user response.
   d) Accept the answer (or "skip" / "N/A" / "defer")
   e) Only AFTER receiving the answer, move to next category
   f) Show progress: "✓ 1/8 complete — Next: User Interface"
   ```

   **Category order:**
   1. Scope, Behavior & Goal
   2. User Interface
   3. Default State
   4. Integration (Business Logic Only)
   5. User Roles & Permissions
   6. Edge Cases
   7. Scope & Boundaries
   8. Business Context

   **The user can say "proceed" or "done" at any point to skip remaining categories.**

4. **Flexible answering rules:**
   - Accept "skip", "N/A", "I don't know", "defer" as valid responses for any question
   - Allow partial answers
   - Minimum 3 categories to proceed (but allow override if user explicitly says "proceed")
   - User can type "proceed" at any time to skip remaining categories

5. **CRITICAL: ONLY non-technical business questions.** If tempted to ask about databases, APIs, caching, or code — DON'T. Defer to: "This will be addressed by the Architect during development."

6. **Store results** mentally for use in Steps 2-3. Note which categories were answered vs skipped.

---

## Step 2: Advanced Elicitation Methods

1. **Read the full elicitation engine** from `the plugin's `elicitation-methods.md``. Follow its Execution Engine section EXACTLY.

2. **Always ask** (never skip silently). Present 5 smart-selected methods based on the requirement context. Use the Smart Selection rules from the elicitation engine (analyze content type, complexity, stakeholder needs, risk level). Format EXACTLY as:

   ```
   Advanced Elicitation Options
   Choose a number (1-5), [r] to Reshuffle, [a] List All 50, or [x] to Skip/Proceed:

   1. [Method Name] — [short description relevant to THIS requirement]
   2. [Method Name] — [short description relevant to THIS requirement]
   3. [Method Name] — [short description relevant to THIS requirement]
   4. [Method Name] — [short description relevant to THIS requirement]
   5. [Method Name] — [short description relevant to THIS requirement]
   r. Reshuffle — show 5 different methods
   a. List all 50 methods with descriptions
   x. Skip — proceed without elicitation
   ```

3. **Handle responses per the elicitation engine:**
   - **1-5**: Execute selected method on the requirement. Show enhanced insights. Ask: "Apply these changes? (y/n)". If yes: apply. If no: discard. **Re-present the 1-5,r,a,x menu.**
   - **r**: Select 5 DIFFERENT methods (diverse categories, slots 1-2 most useful for this requirement). Present new list with same format.
   - **a**: Show all 50 methods in a compact table grouped by category. Allow selection by number or name. After selection, execute and re-present menu.
   - **x**: Complete elicitation and proceed to Step 3.
   - **Multiple numbers** (e.g. `1,3`): Execute methods in sequence, then re-offer choices.

4. **CRITICAL: Always re-present the 1-5,r,a,x menu after each method execution.** The loop continues until user selects `x`. Each method builds on previous enhancements.

5. **If user selects `x` immediately:** Note "elicitation skipped" and proceed.

---

## Step 3: Workflow Detection

1. **Scan `docs/business-docs/` folder** for all workflow documentation files. If folder doesn't exist, skip and note "no business docs found."

2. **For each file found**, analyze relevance to the requirement:
   - Read the file content
   - Match requirement keywords against workflow content
   - Score relevance: Directly relevant (80-100%), Indirectly relevant (50-79%), Not relevant (<50%)
   - Extract dependencies and integration points from the file

3. **Present results as a structured list:**
   ```
   Detected Workflows (from docs/business-docs/):

   1. [filename.md] — Relevance: XX%
      Why: [specific reason this workflow relates to the requirement]
      Dependencies: [extracted from file]
      Key steps that apply: [specific sections]

   Recommended Additional Workflows:
   - [filename.md] — Recommendation: [why to consider]
   ```

4. **Ask user to confirm which workflows to include:**
   > Which workflows would you like to include? Enter numbers (e.g., "1,2,3"), "all", or "recommended":

5. **CRITICAL:** Only reference workflows that exist in `docs/business-docs/`. Never invent workflows.

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
  Step 1: Requirements Gathering    - Done (X/8 categories answered)
  Step 2: Elicitation Methods       - Done|Skipped
  Step 3: Workflow Detection         - Done (X workflows selected)

Next: Run /ba-workflow:prd to create the PRD (Phase 2)
Or: Run /ba-workflow:go to continue automatically
```
