BA Workflow - Phase 2: PRD Creation (Steps 4-5): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-init`.
2. **Find the active workflow:** Scan `{workspace}/` for folders. If multiple exist, ask user which to continue. If only one in-progress, use it. Read `{workspace}/{workflow_id}/state.json`. Phase 1 must be complete.
3. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona.

All outputs go to `{workspace}/{workflow_id}/`.

## Progress Tracking
```
BA Workflow | {workflow_id} | Phase 2: PRD Creation
Step X of 2 complete | XX% of Phase 2
```

---

## Step 4: Story Complexity & PRD Preparation

### Auto-Analyze Complexity
1. Analyze the requirement from Phase 1 state:
   - Count functional requirements mentioned
   - Count detected workflows and their dependencies
   - Analyze scope indicators (single feature vs system-wide)
   - Count user roles mentioned

2. Calculate a suggested complexity level (0-4) with confidence score.

3. **Present to user:**
   ```
   Based on analysis of your requirement:

   Suggested Complexity: Level X (Confidence: XX%)
   Reasoning: [why this level was suggested]
   Expected Story Count: X-Y stories

   Complexity Levels:
     Level 0: Single atomic change (1 story)
     Level 1: Small feature (1-10 stories)
     Level 2: Medium project (5-15 stories)
     Level 3: Complex system (12-40 stories)
     Level 4: Enterprise scale (40+ stories)

   Accept suggestion or enter different level (0-4):
   ```

4. Store the chosen complexity level.

### PRD File Handling
5. Check for existing PRD files in `{workspace}/{workflow_id}/` matching `*PRD.md`.

6. **If existing PRDs found**, ask:
   ```
   Existing PRD file(s) found:
   - [list files]

   How would you like to proceed?
   1. Create fresh PRD (overwrite if same filename)
   2. Edit existing PRD (update with new requirements)
   3. Move existing to backup, create new
   4. Remove existing, create new

   Enter choice (1-4):
   ```

7. **If no existing PRDs**, proceed directly to creation.

---

## Step 5: PRD Creation

### Generate PRD
1. Read the PRD template from `the plugin's `templates/`prd-template.md`.

2. **If a story title wasn't established**, ask:
   > What should this PRD be titled? (This will be used for the filename too)

3. **Auto-populate the PRD** using all Phase 1 data:
   - **Goals & Background**: From requirement + clarifying answers (business context category)
   - **Functional Requirements**: Extract from requirement text, map to FR001, FR002, etc.
   - **Non-Functional Requirements**: From business context and edge case answers
   - **User Journeys**: From UI and scope category answers
   - **UX Design Principles**: From UI category answers
   - **Dependencies**: From selected workflows in Step 3 — load each workflow file from `docs/business-docs/` and extract concrete dependencies
   - **Impact Analysis**: From workflow analysis — document impact on existing systems using workflow file content
   - **Out of Scope**: From scope & boundaries category answers

4. **CRITICAL GUARDRAILS:**
   - PRD must contain ONLY business requirements
   - NO technical implementation details (no database tables, APIs, caching strategies)
   - NO code structure or architecture decisions
   - Technical decisions are deferred to the Architect in the development phase

5. **If edit mode** (choice 2 from file handling): Load existing PRD, merge new requirements without duplicating existing content. Preserve structure.

6. **Save PRD** to: `{workspace}/{workflow_id}/{story_title}_PRD.md`

### PRD Confirmation
7. **Display PRD summary** (section headers + requirement counts, not full content).

8. **Ask user how to proceed:**
   ```
   PRD saved to: {workspace}/{workflow_id}/{story_title}_PRD.md

   How would you like to proceed?
   1. Proceed with PO Review (recommended)
   2. Skip PO Review, go directly to Story Creation
   3. Create story directly from original requirement format

   Enter choice (1, 2, or 3):
   ```

---

## Phase 2 Complete

Update `{workspace}/{workflow_id}/state.json`:
```json
{
  "phase": 2,
  "status": "phase_2_complete",
  "story_complexity": X,
  "prd_file": "{workspace}/{workflow_id}/{story_title}_PRD.md",
  "prd_mode": "fresh|edit",
  "next_step_choice": 1|2|3,
  "story_title": "...",
  "timestamp": "..."
}
```

Display:
```
Phase 2: PRD Creation - COMPLETE
  Workflow: {workflow_id}
  Step 4: Complexity & Preparation  - Done (Level X)
  Step 5: PRD Created               - Done

Next: Run /ba-review for PO Review (Phase 3)
  Or: Run /ba-stories for Story Creation (Phase 4)
  Or: Run /ba-workflow to continue automatically
```
