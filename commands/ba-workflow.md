BA Workflow - Full 9-Step Business Analysis Workflow (Master Command): $ARGUMENTS

## Overview
This is the master command that orchestrates the complete BA workflow through all 4 phases (9 steps). It runs each phase sequentially, maintaining state between them.

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If it doesn't exist, run the `/ba-init` setup flow first (ask the setup questions inline).
2. If config exists, verify output directories exist. Create if missing.

## Execution Flow

Execute each phase in sequence. Between phases, display a transition banner and continue automatically (no need to re-invoke sub-commands — run them inline).

---

### Phase 1: Requirements Analysis (Steps 1-3)

Execute the full `/ba-analyze` workflow:
- **Step 1:** Gather requirements using Analyst agent (read plugin's `agents/analyst.md`)
  - Use `$ARGUMENTS` as the initial requirement if provided
  - Ask clarifying business questions (8 categories, flexible answering)
  - ONLY non-technical business questions
- **Step 2:** Optional elicitation methods (read plugin's `elicitation-methods.md`, always ask, never skip silently)
- **Step 3:** Workflow detection (scan `docs/business-docs/`, score relevance, let user select)

Save state to `{output_folder}/ba-workflow-state.json` after Phase 1.

```
Phase 1 COMPLETE — Transitioning to Phase 2...
```

---

### Phase 2: PRD Creation (Steps 4-5)

Execute the full `/ba-prd` workflow:
- **Step 4:** Determine story complexity (auto-suggest, let user confirm 0-4)
  - Handle existing PRD files (create/edit/backup/remove)
- **Step 5:** Create PRD using template from plugin's `templates/prd-template.md`
  - Auto-populate from Phase 1 data
  - ONLY business requirements — NO technical details
  - Save to `{output_folder}/{story_title}_PRD.md`
  - Ask user: PO Review (1), Skip to Stories (2), or Direct from Requirement (3)

Update state after Phase 2.

```
Phase 2 COMPLETE — Transitioning to Phase 3...
```

---

### Phase 3: PO Review (Step 6) — Conditional

**Only if user chose option 1 in Step 5 confirmation.**

Execute the full `/ba-review` workflow:
- Switch to PO agent (read plugin's `agents/product-owner.md`)
- Review PRD for completeness, clarity, business alignment, gaps
- Save feedback to `{output_folder}/{story_title}_PO-review-feedback.md`
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
  - Use story template from plugin's `templates/story-template.md`
  - Auto-determine count from complexity level
  - Group PRD requirements into stories
  - Save to `{story_dir}/`
  - Let user review/approve/regenerate
- **Step 8:** Jira sync (ALWAYS ask before syncing)
  - If enabled and user approves: create Jira issues via Atlassian MCP, update story files with keys
  - Save sync status to `{output_folder}/jira-sync-status.json`

Update state after Phase 4.

---

### Workflow Complete

Display final summary:
```
BA Workflow - ALL PHASES COMPLETE!

  Phase 1: Requirements Analysis    - Done
  Phase 2: PRD Creation             - Done
  Phase 3: PO Review                - Done|Skipped
  Phase 4: Story Creation           - Done (X stories)
  Jira Sync                         - Done|Skipped

Output Files:
  PRD:        {prd_file}
  Stories:    {story_dir}/ (X files)
  PO Review:  {po_feedback_file}
  Jira Sync:  {jira_sync_file}
  State:      {output_folder}/ba-workflow-state.json

Stories are ready for the development team!
```

## Key Rules

1. **Adopt agents** — Read and follow agent files from the plugin's `agents/` directory strictly when acting as Analyst or PO
2. **Non-technical only** — Analyst never asks technical questions. PRD contains no technical details.
3. **Always ask before Jira sync** — Never auto-push to Jira
4. **State persistence** — Save state after each phase to `ba-workflow-state.json`
5. **Flexible answering** — Accept skip/N/A/partial for clarifying questions
6. **Workflow detection** — Only reference workflows from `docs/business-docs/`
7. **Templates** — Use templates from the plugin's `templates/` directory for PRD and stories
