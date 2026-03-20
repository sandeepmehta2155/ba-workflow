BA Workflow - Phase 2: Story Creation & PO Review (Steps 4-6): $ARGUMENTS

## Clean Output for Business Analysts (CRITICAL)

**This workflow is used by business analysts, not developers.** Keep visible output clean and professional.

1. **DO NOT narrate internal actions** — no "Let me read...", "Searching for...", "Loading..."
2. **DO NOT announce tool usage** — file reads, searches, and agent work happen silently
3. **ONLY show structured outputs** — banners, summaries, questions, and menus as defined in each step
4. **Between steps** = only the progress banners. No filler.

## Skills Loaded Immediately
- **`skills/enforcement.md`** — Read FIRST. Anti-circumvention rules and state validation gates apply to all steps.

## Prerequisites

<HARD-GATE>
Before ANY action in this command, validate ALL of the following:
1. Read config from `docs/ba-workflow-config.json`. If missing → STOP, tell user to run `/ba-workflow:init`.
2. Find the active workflow: Scan `{workspace}/` for folders. If multiple exist, ask user which to continue.
3. Read `{workspace}/{workflow_id}/state.json` and VERIFY:
   - `status` === `"phase_1_complete"` — If not → STOP, tell user to run `/ba-workflow:analyze` first.
   - `requirement` field is non-empty — If empty → STOP, Phase 1 was incomplete.
   - `clarifying_answers` has data — If missing → WARN user that no clarifying questions were answered.
4. If ANY check fails → STOP and tell user what's missing. Do NOT generate stories from incomplete requirements.
</HARD-GATE>

5. Read the story template from `the plugin's `templates/``story-template.md`.
6. Read the Analyst agent from `the plugin's `agents/`analyst.md`. Adopt this persona for story creation.

Stories go to `{workspace}/{workflow_id}/stories/`.

## Skills Injected (read these before starting)
- **`skills/codebase-context.md`** — Run BEFORE generating stories. Scan existing code patterns. Generate `system-context.md` in the workflow folder. Stories reference these patterns in Dev Notes.
- **`skills/testable-criteria.md`** — ENFORCE Given/When/Then format on ALL acceptance criteria. If an AC can't be expressed as GWT, it's too vague — force refinement. Flag vague phrases.
- **`skills/two-stage-review.md`** — Structures PO review of each story. Stage 1: Spec Compliance. Stage 2: Quality. Use severity levels: CRITICAL/IMPORTANT/MINOR.
- **`skills/subagent-coordination.md`** — Read BEFORE Step 5 if complexity is 2+. Governs parallel story generation, independent PO review dispatch, reconciliation, and platform fallback.

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

7. **Choose generation strategy based on complexity:**

#### Complexity 0-1 (Sequential — this session)
Generate stories directly in this session using the Analyst persona:
- For each story, populate using the story template
- Apply `skills/testable-criteria.md` to each story
- Save immediately after generating

#### Complexity 2-4 (Parallel — subagent dispatch)
For 5+ stories, use parallel Agent subagents for faster, higher-quality generation:

a. **Cluster requirements** — Group Phase 1 requirements into 2-5 feature clusters based on functionality. Present clusters to user for confirmation:
   ```
   Proposed story clusters for parallel generation:

   Cluster 1: [name] — [X requirements]
     - [requirement summary]
     - [requirement summary]

   Cluster 2: [name] — [X requirements]
     - [requirement summary]

   Accept clustering or adjust? (y/adjust):
   ```

b. **Dispatch one Agent subagent per cluster** — Each subagent receives:
   - The full Phase 1 `state.json` content (do NOT make subagent read the file — provide inline)
   - The specific requirement cluster to generate stories for
   - The story template content (inline)
   - The `skills/testable-criteria.md` content (inline)
   - The `system-context.md` content if it exists (inline)
   - Clear instruction: generate stories for THIS cluster only, save to `{workspace}/{workflow_id}/stories/`

   Use `subagent_type: "ba-workflow:analyst"` for each dispatch.

c. **Collect and reconcile** — After all subagents complete:
   - Read all generated story files
   - Check for duplicate coverage (same requirement in multiple stories)
   - Check for gaps (requirements not covered by any story)
   - Check for cross-story contradictions in acceptance criteria
   - Renumber stories sequentially: `01-`, `02-`, etc.
   - If issues found, fix in this session (do not re-dispatch)

d. **Subagent response handling:**

   | Status | Action |
   |--------|--------|
   | Stories generated successfully | Collect output, proceed to reconciliation |
   | Subagent asks for clarification | Provide missing Phase 1 context, re-dispatch |
   | Subagent reports blocked | Check if missing requirement — escalate to user |
   | Two clusters produced overlapping stories | Merge duplicates in reconciliation step |

#### All complexities — common steps after generation:

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

### Why Subagent Review
The Analyst generated the stories — the same session carries the Analyst's reasoning and biases. A **fresh subagent** with only the PO persona reviews without that context pollution. This produces genuinely independent reviews.

### Review Strategy

**Choose review approach based on story count:**

#### 1-3 stories: In-session PO review
- Read the PO agent from `the plugin's `agents/`product-owner.md`. Adopt this persona.
- Review each story sequentially in this session.

#### 4+ stories: Subagent PO review (recommended)
- Dispatch a **fresh Agent subagent per story** for independent review.
- Use `subagent_type: "ba-workflow:product-owner"` for each dispatch.
- Each subagent receives (all inline — do NOT make subagent read files):
  - The story file content
  - The Phase 1 `state.json` content (for spec compliance cross-reference)
  - The `skills/two-stage-review.md` content
  - The `agents/product-owner.md` content
  - Instruction: "Review this story using the two-stage review skill. Return structured feedback in the Combined Review Output format. Do NOT have access to the Analyst's generation reasoning."
- Dispatch up to 3 reviews in parallel (do not overwhelm).
- Collect all review results before presenting to user.

**Subagent response handling:**

| Status | Action |
|--------|--------|
| APPROVED | Collect feedback, mark story approved |
| NEEDS REVISION | Collect feedback with specific issues, present to user |
| Subagent asks for context | Provide missing Phase 1 data, re-dispatch FRESH subagent (do not resume) |
| Review seems superficial (all PASS, no substantive comments) | Re-dispatch with stronger instruction: "Challenge this story. Look for implicit assumptions." |

### Present Review Results
For each story, present the PO feedback to the user:
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

### Correction Loop (per story)

5. **If a story NEEDS REVISION:**
   a. Present the required changes to the user
   b. Ask: "Would you like me to update this story based on the feedback? (y/n)"
   c. **If yes:**
      - Switch to Analyst persona (this session)
      - Update the story addressing each required change
      - Save updated story to the same file
      - Dispatch a **FRESH** PO subagent to re-review (do NOT resume the previous reviewer — fresh perspective catches new issues introduced during fixes)
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

3. <HARD-GATE>
   **If enabled, ALWAYS ask before syncing. NEVER auto-push to Jira.**
   Every approved story must have passed PO review (APPROVED status) before Jira sync is offered.
   If any stories have status other than APPROVED or "overridden" → do NOT include them in the sync prompt.
   </HARD-GATE>

   Ask:
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
