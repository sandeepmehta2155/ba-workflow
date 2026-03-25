BA Workflow - Full 7-Step Business Analysis Workflow (Master Command): $ARGUMENTS

## Overview
This is the master command that orchestrates the complete BA workflow through all 3 phases (7 steps). It runs each phase sequentially, maintaining state between them. Each workflow run is scoped to its own folder.

## Platform Compatibility
This workflow is optimized for Claude Code but works on other platforms. If running outside Claude Code, see `docs/platform-support.md` for tool mapping and fallback behavior. Key differences: subagent dispatch falls back to sequential mode, MCP/Jira may be unavailable, and slash commands may need manual invocation.

## Clean Output for Business Analysts (CRITICAL)

**This workflow is used by business analysts, not developers.** Your visible output must be clean, professional, and free of technical noise.

### Rules:
1. **DO NOT narrate internal actions.** Never say things like "Let me read the config file", "Searching for patterns", "Now let me check...", "Good, config exists", etc.
2. **DO NOT announce tool usage.** File reads, glob searches, agent dispatches, and bash commands should happen silently. The user should never see references to tools, searches, or file operations.
3. **ONLY show the structured outputs defined in this workflow** — banners, summaries, questions, and menus. Nothing else.
4. **Your first visible output** should be either the requirement question (if no $ARGUMENTS) or an acknowledgment of the provided requirement — not setup chatter.
5. **Between steps**, show only the progress banners defined below. No filler text.

**Bad example (never do this):**
> Let me set up the BA workflow. First, I'll check for the config and relevant files.
> Good, config exists. Now let me read the skill files...

**Good example:**
> Please provide the client requirement or rough specification for the feature/enhancement you want to analyze.

## Skill Chain
Read `skills/CHAIN.md` for the full skill execution order and chaining rules. Skills execute sequentially within each phase, with HARD-GATEs between phases.

## Just-in-Time Loading (CRITICAL)

**DO NOT read config, skills, agents, or scan for workflows upfront.** Start by asking for the requirement immediately. Load resources only when the step that needs them begins:

| Resource | Load When | Not Before |
|----------|-----------|------------|
| `skills/enforcement.md` | Immediately (before any step) | — applies to all steps |
| `docs/ba-workflow-config.json` | Step 1b (after receiving requirement, before project scan) |
| `skills/project-scan.md` | Step 1b (project scan) |
| `skills/socratic-discovery.md` | Step 1c (brainstorm, if no prior output) |
| `agents/analyst.md` | Step 1c (brainstorm persona) |
| `skills/testable-criteria.md` | Phase 2 (story creation) |
| `agents/product-owner.md` | Phase 2, Step 6 (PO review) |
| `skills/two-stage-review.md` | Phase 2, Step 6 (PO review) |
| `skills/subagent-coordination.md` | Phase 2, Step 5 (if complexity 2+) |

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

### Phase 1: Requirements Analysis (Steps 1-2)

Execute the full `/ba-workflow:analyze` workflow:
- **Step 1a:** Get the initial requirement FIRST using Analyst agent (read `the plugin's `agents/`analyst.md`)
  - Use `$ARGUMENTS` as the initial requirement if provided
  - If no arguments, ask: "Please provide the client requirement or rough specification for the feature/enhancement you want to analyze."
  - <HARD-GATE>
    **STOP here and wait for the requirement before doing anything else.**
    Do NOT read config, scan the project, load skills, or take any action until the requirement is received.
    </HARD-GATE>
- **Step 1b:** Project Scan + Workflow Detection — run AFTER receiving the requirement
  - Run a **surface-level** project scan (read `skills/project-scan.md`)
  - Skip if resuming and `{workspace}/{workflow_id}/project-scan.md` already exists
  - Run 3 parallel Glob searches — Directory layout, business docs filenames, config files
  - Detect tech stack from config file names
  - **Workflow Detection** — check `docs/business-docs/` for files. If found, list filenames and let user select which are associated with this requirement (do NOT read/score files upfront — only read user-selected ones). If folder is empty or missing, skip. This informs requirements discovery in Step 1c.
  - Generate scan output — Save to `{workspace}/{workflow_id}/project-scan.md`
  - Display summary:
    ```
    Project Scan Complete
      Tech Stack:    {language} + {framework}
      Project Shape: {count} top-level directories
      Business Docs: {count} found in docs/business-docs/
      Workflows:     {count} relevant to requirement
    ```
  - This is awareness only — no source code is read. In Phase 2, Serena plugin's project memory is queried for business context (no live code scanning).
- **Step 1c:** Requirements Discovery — Brainstorm
  - Check if the user has already run `/ba-workflow:brainstorm` or `/sc:brainstorm` and has brainstorm output available
  - **If brainstorm output exists**: Confirm with user via `AskUserQuestion`: use existing, re-run, or add to it
  - **If no brainstorm output**: Run Socratic brainstorming inline (read `skills/socratic-discovery.md` + `agents/analyst.md`):
    1. Parse explicit requirements
    2. Surface implicit requirements
    3. Identify unmade decisions
    4. Ask targeted questions via `AskUserQuestion` — ONE category at a time, minimum 3, adapt based on answers
    5. Compile structured brainstorm output (goals, functional reqs, acceptance criteria)
    6. Confirm output with user
  - Pass selected workflow docs from Step 1b as additional context alongside brainstorm output
  - <HARD-GATE>
    The workflow CANNOT proceed without brainstorm output containing at minimum: clarified user goals, functional requirements, and acceptance criteria. Brainstorming runs inline if no prior output exists.
    </HARD-GATE>
- **Step 2:** Optional elicitation methods (read `the plugin's `elicitation-methods.md``, always ask, never skip silently)

Save state to `{workspace}/{workflow_id}/state.json` after Phase 1.

<HARD-GATE>
Before transitioning to Phase 2, VERIFY:
1. `state.json` exists with `status: "phase_1_complete"`
2. `requirement` field is non-empty
3. Brainstorm output contains clarified goals, functional requirements, and acceptance criteria OR user explicitly said "proceed"
If ANY check fails — STOP. Do NOT proceed to story creation with incomplete requirements.
</HARD-GATE>

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
  - **Complexity 0-1:** Generate sequentially in this session
  - **Complexity 2-4:** Read `skills/subagent-coordination.md`, dispatch parallel Agent subagents per requirement cluster, reconcile results
  - Save to `{workspace}/{workflow_id}/stories/`
- **Step 6:** PO reviews EACH story individually
  - <HARD-GATE>
    **PO Review is MANDATORY.** Do NOT skip this step. Do NOT end Phase 2 without every story being reviewed. If the flow gets interrupted or the user refines/regenerates stories, always proceed to PO Review after.
    </HARD-GATE>
  - **1-3 stories:** In-session PO persona (read `the plugin's `agents/`product-owner.md`)
  - **4+ stories:** Dispatch fresh PO subagent per story for independent review (see `skills/subagent-coordination.md`)
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
