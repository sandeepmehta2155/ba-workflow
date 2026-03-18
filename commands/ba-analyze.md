BA Workflow - Phase 1: Requirements Analysis (Steps 1-3): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If it doesn't exist, tell user to run `/ba-init` first.
2. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona for ALL interactions in this phase.
3. If `docs/business-docs/` exists, note it for Step 3 workflow detection.

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

3. **Ask clarifying questions using the Analyst persona's 8 categories.**
   Present the user with answering options:
   - **Option 1:** Answer questions category by category
   - **Option 2:** Skip all questions and proceed with requirement as-is
   - **Option 3:** Answer only essential questions (Scope & Goal, Business Context, Scope & Boundaries)
   - **Option 4:** Answer all questions (comprehensive mode)

4. **Flexible answering rules:**
   - Accept "skip", "N/A", "I don't know", "defer" as valid responses
   - Allow partial answers
   - Minimum 3 categories to proceed (but allow override if user explicitly says "proceed")
   - Show progress: "X of 8 categories completed"

5. **CRITICAL: ONLY non-technical business questions.** If tempted to ask about databases, APIs, caching, or code — DON'T. Defer to: "This will be addressed by the Architect during development."

6. **Store results** mentally for use in Steps 2-3. Note which categories were answered vs skipped.

---

## Step 2: Optional Elicitation Methods

1. **Read the elicitation methods** from `the plugin's `elicitation-methods.md``.

2. **Always ask** (never skip silently):
   > Would you like to use elicitation methods to explore different approaches, identify risks, and enhance requirements?
   >
   > 1. Skip, proceed — Requirements are clear enough
   > 2. User journey walkthrough
   > 3. Edge case brainstorm
   > 4. Quick picks (top 5 recommended methods)
   > 5. Browse all 50 methods

3. **If user picks option 4 or 5:** Present methods from the elicitation methods file. Follow the execution flow defined there:
   - Present 5 context-relevant methods (or all if option 5)
   - User picks by number, `r` to reshuffle, `x` to proceed
   - Execute selected method(s) on the requirement
   - After each method ask: "Apply these insights? (y/n)"
   - Build enhanced understanding iteratively
   - Continue until user says `x` to finalize

4. **If user picks option 2 (User journey walkthrough):** Walk through the step-by-step user experience of the requirement. Map the end-to-end journey.

5. **If user picks option 3 (Edge case brainstorm):** Explore unusual scenarios, boundary conditions, and what happens when things go wrong — from a business perspective only.

6. **If user picks option 1:** Note "elicitation skipped" and proceed.

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

Next: Run /ba-prd to create the PRD (Phase 2)
Or: Run /ba-workflow to continue automatically
```
