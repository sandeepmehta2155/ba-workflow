BA Workflow - Phase 2: Story Creation & PO Review (Steps 4-6): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-workflow:init`.
2. **Find the active workflow:** Scan `{workspace}/` for folders. If multiple exist, ask user which to continue. Read `{workspace}/{workflow_id}/state.json`. Phase 1 must be complete.
3. Read the story template from `the plugin's `templates/``story-template.md`.
4. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona for story creation.

Stories go to `{workspace}/{workflow_id}/stories/`.

## Skills Injected (read these before starting)
- **`skills/codebase-context.md`** — Run BEFORE generating stories. Scan existing code patterns. Generate `system-context.md` in the workflow folder. Stories reference these patterns in Dev Notes.
- **`skills/testable-criteria.md`** — ENFORCE Given/When/Then format on ALL acceptance criteria. If an AC can't be expressed as GWT, it's too vague — force refinement. Flag vague phrases.
- **`skills/two-stage-review.md`** — Structures PO review of each story. Stage 1: Spec Compliance. Stage 2: Quality. Use severity levels: CRITICAL/IMPORTANT/MINOR.

## Progress Tracking
```
BA Workflow | {workflow_id} | Phase 2: Story Creation & PO Review
Step X of 3 complete | XX% of Phase 2
```

---

## Step 4: Story Complexity

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

---

## Step 5: Create User Stories

### Check for Existing Stories
1. Check `{workspace}/{workflow_id}/stories/` for existing story files.

2. **If existing stories found**, ask:
   ```
   Existing story files found in {workflow_id}/stories/:
   - [list files]

   How would you like to proceed?
   1. Update existing story(s) with new requirements
   2. Create new story(s) from requirements

   Enter choice (1 or 2):
   ```

### Option 1: Update Existing Stories
3. Ask which stories to update (filenames or "all").
4. For each selected story:
   - Load existing file, preserve its format exactly
   - Map requirements to existing story sections
   - **UPDATE RULES:**
     - ONLY add/adjust points derived from Phase 1 requirements — nothing outside requirements
     - Keep updates brief and concise
     - Don't duplicate existing points
     - Preserve all existing sections even if not updated
     - Update: Acceptance Criteria, Tasks, Dev Notes, Workflow Dependencies, Impact Analysis
   - Save back to same filename

### Option 2: Create New Stories
5. **Auto-determine story count** based on `story_complexity` from state:
   - Level 0: 1 story
   - Level 1: 1-10 stories
   - Level 2: 5-15 stories
   - Level 3: 12-40 stories
   - Level 4: 40+ stories

6. **Auto-group Phase 1 requirements** into stories:
   - Analyze functional requirements gathered during elicitation
   - Group related requirements by feature/functionality
   - Identify story boundaries based on user value

7. **Generate stories** using the story template. For each story populate:
   - Story title and As/Want/So format from requirements
   - Acceptance criteria from functional requirements (Given/When/Then format)
   - Business context from requirement background
   - Workflow Dependencies from detected workflows (Step 3)
   - Impact Analysis from workflow analysis
   - Edge cases and prerequisites from elicitation
   - Status: "drafted"

8. **Save each story** as: `{workspace}/{workflow_id}/stories/{story_num}-{story-title-kebab}.md`

9. **Present story summary:**
   ```
   X story draft(s) generated:

   1. {filename} — "{title}"
      ACs: X | Dependencies: X | Tasks: X

   Options:
   1. Review and refine stories (edit individual)
   2. Approve all drafts, proceed to PO Review
   3. Regenerate with different grouping (by feature/role/workflow)

   Enter choice (1, 2, or 3):
   ```

---

## Step 6: PO Review (per story)

### Switch to PO Persona
1. Read the PO agent from `the plugin's `agents/`product-owner.md`. Adopt this persona.

### Review Each Story
2. **For each story**, the PO reviews by evaluating:
   - **Completeness**: All relevant requirements addressed? Acceptance criteria cover the scope?
   - **Clarity**: Requirements unambiguous? ACs verifiable with Given/When/Then?
   - **Business Alignment**: Aligns with business goals? User value clear?
   - **Gaps**: Missing edge cases, user roles, or acceptance criteria?
   - **Dependencies**: Workflow dependencies identified? Impact analysis present?
   - **Testability**: Can every AC be objectively tested?

3. **Generate review feedback for each story:**
   ```markdown
   ## PO Review — Story: {story_title}

   ### Approval Status: [APPROVED / NEEDS REVISION]

   ### Strengths
   - [What's well done]

   ### Required Changes (if NEEDS REVISION)
   1. [Specific change] - Severity: CRITICAL/IMPORTANT/MINOR

   ### Suggestions (optional improvements)
   1. [Suggestion]
   ```

4. **Present feedback for each story to user.**

### Correction Loop (per story)

5. **If a story NEEDS REVISION:**
   a. Present the required changes to the user
   b. Ask: "Would you like me to update this story based on the feedback? (y/n)"
   c. **If yes:**
      - Switch back to Analyst persona
      - Update the story addressing each required change
      - Save updated story to the same file
      - Switch back to PO persona
      - Re-review the updated story
      - Repeat until APPROVED or user says to stop
   d. **If no:** Ask user what they'd like to do:
      - Approve anyway (override PO)
      - Make manual edits and re-run `/ba-workflow:review`
      - Skip this story

6. **If APPROVED:** Move to next story.

7. **After all stories reviewed**, display summary:
   ```
   PO Review Summary:
     Approved: X stories
     Approved after revision: X stories
     Overridden: X stories
     Skipped: X stories

   All stories reviewed. Ready for Jira sync.
   ```

---

## Step 7: Jira Sync

1. **Check if Jira is enabled** in config (`jira_mcp_enabled`).

2. **If disabled:**
   ```
   Jira sync is disabled. Stories saved locally.
   To enable: run /ba-workflow:init and enable Jira integration.
   ```
   Skip to completion.

3. **If enabled, ALWAYS ask:**
   ```
   Would you like to push these stories to Jira? (y/n)
   ```

4. **If yes:**
   a. **Auto-detect Jira project key** from config or previous syncs. If found, confirm with user. If not, ask.
   b. **For each approved story file:**
      - Create Jira issue using `mcp__Atlassian-MCP__createJiraIssue` with:
        - Summary: Story title
        - Description: Full story content (formatted for Jira)
        - Project: `{jira_project_key}`
        - Issue Type: `{jira_story_type}`
      - Store returned Jira issue key
      - Update local story file with Jira key
   c. **Save sync mapping** to `{workspace}/{workflow_id}/jira-sync-status.json`
   d. **Handle errors:** Log failures, report to user, offer to retry.

5. **If no:** Skip Jira sync, stories remain local.

---

## Phase 2 & 3 Complete — Workflow Done!

Update `{workspace}/{workflow_id}/state.json`:
```json
{
  "phase": 3,
  "status": "complete",
  "story_complexity": X,
  "stories_created": X,
  "stories_approved": X,
  "story_files": [ ... ],
  "po_review_summary": {
    "approved": X,
    "revised": X,
    "overridden": X,
    "skipped": X
  },
  "jira_synced": true|false,
  "completed_at": "..."
}
```

Display:
```
BA Workflow - COMPLETE!

  Workflow: {workflow_id}
  Folder:  {workspace}/{workflow_id}/

  Phase 1: Requirements Analysis    - Done
  Phase 2: Story Creation & Review  - Done (X stories, PO approved)
  Phase 3: Jira Sync                - Done|Skipped

  Files:
    {workflow_id}/
      state.json
      jira-sync-status.json
      stories/
        01-story-name.md
        02-story-name.md
        ...

Stories are ready for the development team!
```
