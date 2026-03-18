BA Workflow - Phase 4: Story Creation & Jira Sync (Steps 7-8): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-workflow:init`.
2. **Find the active workflow:** Scan `{workspace}/` for folders. If multiple exist, ask user which to continue. Read `{workspace}/{workflow_id}/state.json`. Phase 2 must be complete.
3. Read the PRD file from the path stored in state (`prd_file`).
4. Read the story template from `the plugin's `templates/``story-template.md`.
5. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona.

Stories go to `{workspace}/{workflow_id}/stories/`.

## Skills Injected (read these before starting)
- **`skills/codebase-context.md`** — Run BEFORE generating stories. Scan existing code patterns. Generate `system-context.md` in the workflow folder. Stories reference these patterns in Dev Notes.
- **`skills/testable-criteria.md`** — ENFORCE Given/When/Then format on ALL acceptance criteria. If an AC can't be expressed as GWT, it's too vague — force refinement. Flag vague phrases.
- **`skills/parallel-stories.md`** — For complexity Level 2+, offer parallel wave-based generation. Group stories by epic, dispatch per wave, two-stage review per story.
- **`skills/verification-checklist.md`** — Apply at end of Phase 4 (before Jira sync). Run Level 1 + Level 2 + Level 3 checks. Verify PRD-to-story coverage is 100%.
- **`skills/confidence-scoring.md`** — Apply at Phase 4 completion. Self-rate confidence. LOW → halt.
- **`skills/receipts.md`** — Generate Phase 4 receipt at completion (includes Jira sync results).

## Progress Tracking
```
BA Workflow | {workflow_id} | Phase 4: Story Creation & Jira Sync
Step X of 2 complete | XX% of Phase 4
```

---

## Step 7: Create User Stories from PRD

### Check for Existing Stories
1. Check `{workspace}/{workflow_id}/stories/` for existing story files.

2. **If existing stories found**, ask:
   ```
   Existing story files found in {workflow_id}/stories/:
   - [list files]

   How would you like to proceed?
   1. Update existing story(s) with PRD content
   2. Create new story(s) from PRD

   Enter choice (1 or 2):
   ```

### Option 1: Update Existing Stories
3. Ask which stories to update (filenames or "all").
4. For each selected story:
   - Load existing file, preserve its format exactly
   - Map PRD requirements to existing story sections
   - **UPDATE RULES:**
     - ONLY add/adjust points derived from PRD — nothing outside PRD
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

6. **Auto-group PRD requirements** into stories:
   - Analyze functional requirements (FR001, FR002, etc.)
   - Group related requirements by feature/functionality
   - Identify story boundaries based on user value

7. **Generate stories** using the story template. For each story populate:
   - Story title and As/Want/So format from PRD
   - Acceptance criteria from PRD functional requirements
   - Business context from PRD background
   - Workflow Dependencies from PRD Dependencies section
   - Impact Analysis from PRD Impact Analysis section
   - Edge cases and prerequisites from PRD
   - Link to PRD requirement IDs (FR001, etc.)
   - Status: "drafted"

8. **Save each story** as: `{workspace}/{workflow_id}/stories/{story_num}-{story-title-kebab}.md`

9. **Present story summary:**
   ```
   X story draft(s) generated from PRD:

   1. {filename} — "{title}"
      ACs: X | Dependencies: X | Tasks: X

   Options:
   1. Review and refine stories (edit individual)
   2. Approve all stories as-is
   3. Regenerate with different grouping (by feature/role/workflow)

   Enter choice (1, 2, or 3):
   ```

### Handle Choice 3 (Update from original requirement - from Step 5a)
If `next_step_choice` was `3` in state:
- Detect original requirement format (Jira vs text)
- If Jira: map PRD content to Jira ticket sections, preserve Jira structure
- If text: create comprehensive story from PRD inputs
- Save to `{workspace}/{workflow_id}/stories/`

---

## Step 8: Jira Sync

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
   b. **For each story file:**
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

## Phase 4 Complete — Workflow Done!

Update `{workspace}/{workflow_id}/state.json`:
```json
{
  "phase": 4,
  "status": "complete",
  "stories_created": X,
  "story_files": [ ... ],
  "jira_synced": true|false,
  "completed_at": "..."
}
```

Display:
```
BA Workflow - COMPLETE!

  Workflow: {workflow_id}
  Folder:  {workspace}/{workflow_id}/

  Phase 1: Requirements Analysis  - Done
  Phase 2: PRD Creation           - Done
  Phase 3: PO Review              - Done|Skipped
  Phase 4: Story Creation         - Done (X stories)
  Jira Sync                       - Done|Skipped

  Files:
    {workflow_id}/
      state.json
      {title}_PRD.md
      {title}_PO-review-feedback.md
      jira-sync-status.json
      stories/
        01-story-name.md
        02-story-name.md
        ...

Stories are ready for the development team!
```
