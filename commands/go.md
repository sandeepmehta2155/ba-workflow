BA Workflow - Full 7-Step Business Analysis Workflow (Master Command): $ARGUMENTS

## Overview
This is the master command that orchestrates the complete BA workflow through all 3 phases (7 steps). It runs each phase sequentially, maintaining state between them. Each workflow run is scoped to its own folder.

## Just-in-Time Loading (CRITICAL)

**DO NOT read config, skills, agents, or scan for workflows upfront.** Start by asking for the requirement immediately. Load resources only when the step that needs them begins:

| Resource | Load When | Not Before |
|----------|-----------|------------|
| `docs/ba-workflow-config.json` | Step 1b (after receiving requirement, before project scan) |
| `skills/project-scan.md` | Step 1b (project scan) |
| `agents/analyst.md` | Step 1c (clarifying questions) |
| `skills/socratic-discovery.md` | Step 1c (clarifying questions) |
| `skills/codebase-context.md` | Phase 2 (before stories) |
| `skills/testable-criteria.md` | Phase 2 (story creation) |
| `agents/product-owner.md` | Phase 2, Step 6 (PO review) |
| `skills/two-stage-review.md` | Phase 2, Step 6 (PO review) |

If `docs/ba-workflow-config.json` doesn't exist when loaded, run `/ba-workflow:init` setup inline at that point.

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

**Scoping happens AFTER receiving the requirement (Step 1a), not before.**
- **If resuming**: Scan workspace for in-progress workflows only if user mentions resuming.
- **If new**: Derive workflow_id after understanding the requirement (kebab-case). Confirm with user.

## Execution Flow

Execute each phase in sequence. Between phases, display a transition banner and continue automatically.

---

### Phase 1: Requirements Analysis (Steps 1-3)

Execute the full `/ba-workflow:analyze` workflow:
- **Step 1a:** Get the initial requirement FIRST using Analyst agent (read `the plugin's `agents/`analyst.md`)
  - Use `$ARGUMENTS` as the initial requirement if provided
  - If no arguments, ask: "Please provide the client requirement or rough specification for the feature/enhancement you want to analyze."
  - **STOP here and wait for the requirement before doing anything else**
- **Step 1b:** Project Scan (Lightweight) — run AFTER receiving the requirement
  - Run a **surface-level** project scan (read `skills/project-scan.md`)
  - Skip if resuming and `{workspace}/{workflow_id}/project-scan.md` already exists
  - Run 3 parallel Glob searches — Directory layout, business docs filenames, config files
  - Detect tech stack from config file names
  - Generate scan output — Save to `{workspace}/{workflow_id}/project-scan.md`
  - Display summary:
    ```
    Project Scan Complete
      Tech Stack:    {language} + {framework}
      Project Shape: {count} top-level directories
      Business Docs: {count} found in docs/business-docs/
    ```
  - This is awareness only — no source code is read. Deep code analysis happens in Phase 2 if the requirement needs it.
- **Step 1c:** Ask clarifying business questions (8 categories, flexible answering)
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
9. **Resume support** — Only scan for in-progress workflows if user mentions resuming
10. **PO reviews each story** — Every story must be individually reviewed and approved by PO before Jira sync
