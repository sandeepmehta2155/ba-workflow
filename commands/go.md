BA Workflow - Full 7-Step Business Analysis Workflow (Master Command): $ARGUMENTS

## Overview
This is the master command that orchestrates the complete BA workflow through all 3 phases (7 steps). It runs each phase sequentially, maintaining state between them. Each workflow run is scoped to its own folder.

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If it doesn't exist, run the `/ba-workflow:init` setup flow first (ask the setup questions inline).
2. If config exists, verify workspace directory exists. Create if missing.

## Skills (read from `skills/` directory before starting)

| Skill | Applied In | Purpose |
|-------|-----------|---------|
| `skills/project-scan.md` | Step 0, before Phase 1 | First-stage parallel project scan for context |
| `skills/socratic-discovery.md` | Phase 1, Step 1 | Surface implicit requirements, identify unmade decisions |
| `skills/two-stage-review.md` | Phase 2, Step 6 | Structured PO review of each story: spec compliance + quality |
| `skills/codebase-context.md` | Phase 2, before stories | Discover business rules and edge cases from code for better stories |
| `skills/testable-criteria.md` | Phase 2, story creation | Enforce Given/When/Then on all ACs |

## Workflow Scoping

Each run creates its own folder under `{workspace}/{workflow_id}/`:
```
{workspace}/{workflow_id}/
  state.json                        # Workflow progress
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

### Step 0: Project Scan (Lightweight)

Before any questions or analysis, run a **surface-level** project scan (read `skills/project-scan.md`):

1. **Skip if resuming** — If `{workspace}/{workflow_id}/project-scan.md` already exists, read it and proceed
2. **Run 3 parallel Glob searches** — Directory layout, business docs filenames, config files
3. **Detect tech stack** from config file names (read package.json/equivalent only if framework detection needed)
4. **Generate scan output** — Save to `{workspace}/{workflow_id}/project-scan.md`
5. **Display summary** to user:

```
Project Scan Complete
  Tech Stack:    {language} + {framework}
  Project Shape: {count} top-level directories
  Business Docs: {count} found in docs/business-docs/
```

This is awareness only — no source code is read. Deep code analysis happens in Phase 2 if the requirement needs it.

---

### Phase 1: Requirements Analysis (Steps 1-3)

Execute the full `/ba-workflow:analyze` workflow:
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

### Phase 2: Story Creation & PO Review (Steps 4-6)

Execute the full `/ba-workflow:stories` workflow:
- **Step 4:** Determine story complexity (auto-suggest, let user confirm 0-4)
- **Step 5:** Create user stories directly from Phase 1 requirements data
  - Use story template from `the plugin's `templates/``story-template.md`
  - Auto-determine count from complexity level
  - Group requirements into stories by feature/functionality
  - Save to `{workspace}/{workflow_id}/stories/`
- **Step 6:** PO reviews EACH story individually
  - Switch to PO agent (read `the plugin's `agents/`product-owner.md`)
  - Review each story for completeness, clarity, business alignment, testable ACs
  - If NEEDS REVISION: correction loop (Analyst updates story -> PO re-reviews -> repeat until approved)
  - Save PO feedback alongside each story

Update state after Phase 2.

```
Phase 2 COMPLETE — Transitioning to Phase 3...
```

---

### Phase 3: Jira Sync (Step 7)

Execute the Jira sync portion of `/ba-workflow:stories`:
- **Step 7:** Jira sync (ALWAYS ask before syncing)
  - If enabled and user approves: create Jira issues via MCP, update story files with keys
  - Save sync status to `{workspace}/{workflow_id}/jira-sync-status.json`

Update state after Phase 3.

---

### Workflow Complete

Display final summary:
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

## Key Rules

1. **Scoped folders** — Each workflow run gets its own folder under `{workspace}/`. Never mix outputs between workflows.
2. **Adopt agents** — Read and follow agent files in `the plugin's `agents/`` strictly when acting as Analyst or PO
3. **Non-technical only** — Analyst never asks technical questions. Stories contain no technical implementation details.
4. **Always ask before Jira sync** — Never auto-push to Jira
5. **State persistence** — Save state after each phase to `{workspace}/{workflow_id}/state.json`
6. **Flexible answering** — Accept skip/N/A/partial for clarifying questions
7. **Workflow detection** — Only reference workflows from `docs/business-docs/`
8. **Templates** — Use templates from `the plugin's `templates/``` for stories
9. **Resume support** — Scan for in-progress workflows before starting new ones
10. **PO reviews each story** — Every story must be individually reviewed and approved by PO before Jira sync
