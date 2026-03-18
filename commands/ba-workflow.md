BA Workflow - Full 9-Step Business Analysis Workflow (Master Command): $ARGUMENTS

## Overview
This is the master command that orchestrates the complete BA workflow through all 4 phases (9 steps). It runs each phase sequentially, maintaining state between them. Each workflow run is scoped to its own folder.

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If it doesn't exist, run the `/ba-init` setup flow first (ask the setup questions inline).
2. If config exists, verify workspace directory exists. Create if missing.

## Workflow Scoping

Each run creates its own folder under `{workspace}/{workflow_id}/`:
```
{workspace}/{workflow_id}/
  state.json                        # Workflow progress
  {title}_PRD.md                    # Product Requirements Document
  {title}_PO-review-feedback.md     # PO review feedback
  jira-sync-status.json             # Jira sync mapping
  stories/                          # Generated user stories
    01-story-name.md
    02-story-name.md
```

**If resuming**: Scan workspace for in-progress workflows. Offer to resume or start new.
**If new**: Derive workflow_id after understanding the requirement (kebab-case). Confirm with user.

## Execution Flow

Execute each phase in sequence. Between phases, display a transition banner and continue automatically.

---

### Phase 1: Requirements Analysis (Steps 1-3)

Execute the full `/ba-analyze` workflow:
- **Step 1:** Gather requirements using Analyst agent (read `the plugin's `agents/`analyst.md`)
  - Use `$ARGUMENTS` as the initial requirement if provided
  - Ask clarifying business questions (8 categories, flexible answering)
  - ONLY non-technical business questions
- **Step 2:** Optional elicitation methods (read `the plugin's `elicitation-methods.md``, always ask, never skip silently)
- **Step 3:** Workflow detection (scan `docs/business-docs/`, score relevance, let user select)

Save state to `{workspace}/{workflow_id}/state.json` after Phase 1.

```
Phase 1 COMPLETE — Transitioning to Phase 2...
```

---

### Phase 2: PRD Creation (Steps 4-5)

Execute the full `/ba-prd` workflow:
- **Step 4:** Determine story complexity (auto-suggest, let user confirm 0-4)
  - Handle existing PRD files (create/edit/backup/remove)
- **Step 5:** Create PRD using template from `the plugin's `templates/`prd-template.md`
  - Auto-populate from Phase 1 data
  - ONLY business requirements — NO technical details
  - Save to `{workspace}/{workflow_id}/{story_title}_PRD.md`
  - Ask user: PO Review (1), Skip to Stories (2), or Direct from Requirement (3)

Update state after Phase 2.

```
Phase 2 COMPLETE — Transitioning to Phase 3...
```

---

### Phase 3: PO Review (Step 6) — Conditional

**Only if user chose option 1 in Step 5 confirmation.**

Execute the full `/ba-review` workflow:
- Switch to PO agent (read `the plugin's `agents/`product-owner.md`)
- Review PRD for completeness, clarity, business alignment, gaps
- Save feedback to `{workspace}/{workflow_id}/{story_title}_PO-review-feedback.md`
- If NEEDS REVISION: correction loop (Analyst updates PRD -> PO re-reviews -> repeat until approved)

Update state after Phase 3.

```
Phase 3 COMPLETE — Transitioning to Phase 4...
```

**If user chose option 2 or 3, skip Phase 3:**
```
Phase 3 SKIPPED (per user choice) — Transitioning to Phase 4...
```

---

### Phase 4: Story Creation & Jira Sync (Steps 7-8)

Execute the full `/ba-stories` workflow:
- **Step 7:** Generate stories from PRD
  - Use story template from `the plugin's `templates/`story-template.md`
  - Auto-determine count from complexity level
  - Group PRD requirements into stories
  - Save to `{workspace}/{workflow_id}/stories/`
  - Let user review/approve/regenerate
- **Step 8:** Jira sync (ALWAYS ask before syncing)
  - If enabled and user approves: create Jira issues via MCP, update story files with keys
  - Save sync status to `{workspace}/{workflow_id}/jira-sync-status.json`

Update state after Phase 4.

---

### Workflow Complete

Display final summary:
```
BA Workflow - COMPLETE!

  Workflow: {workflow_id}
  Folder:  {workspace}/{workflow_id}/

  Phase 1: Requirements Analysis    - Done
  Phase 2: PRD Creation             - Done
  Phase 3: PO Review                - Done|Skipped
  Phase 4: Story Creation           - Done (X stories)
  Jira Sync                         - Done|Skipped

  Files:
    {workflow_id}/
      state.json
      {title}_PRD.md
      {title}_PO-review-feedback.md
      jira-sync-status.json
      stories/
        01-story-name.md
        ...

Stories are ready for the development team!
```

## Key Rules

1. **Scoped folders** — Each workflow run gets its own folder under `{workspace}/`. Never mix outputs between workflows.
2. **Adopt agents** — Read and follow agent files in `the plugin's `agents/`` strictly when acting as Analyst or PO
3. **Non-technical only** — Analyst never asks technical questions. PRD contains no technical details.
4. **Always ask before Jira sync** — Never auto-push to Jira
5. **State persistence** — Save state after each phase to `{workspace}/{workflow_id}/state.json`
6. **Flexible answering** — Accept skip/N/A/partial for clarifying questions
7. **Workflow detection** — Only reference workflows from `docs/business-docs/`
8. **Templates** — Use templates from `the plugin's `templates/`` for PRD and stories
9. **Resume support** — Scan for in-progress workflows before starting new ones
