# BA Workflow Plugin

A streamlined 7-step Business Analysis workflow plugin that takes you from a rough requirement to Jira-ready user stories — with brainstorm-driven discovery, PO review per story, and testable acceptance criteria enforcement.

**Platforms:** Claude Code (full support) | Cursor, Gemini CLI, OpenCode (core workflow) | Codex (minimal). See `docs/platform-support.md` for details.

## What It Does

| Phase | Steps | Description |
|-------|-------|-------------|
| **Phase 1** | Steps 1-3 | Requirements gathering (Socratic brainstorming), elicitation methods (50 techniques), workflow detection |
| **Phase 2** | Steps 4-6 | Story complexity scoring (0-4), user story creation, PO review per story (spec compliance + quality) |
| **Phase 3** | Step 7 | Jira sync |

---

## Installation

### Option 1: npx (Recommended)

```bash
npx ba-workflow-plugin
```

### Option 2: Manual Clone

```bash
git clone https://github.com/sandeepmehta2155/ba-workflow.git ~/.claude/plugins/ba-workflow
```

---

## Update

```bash
npx ba-workflow-plugin
```

Or manually:

```bash
cd ~/.claude/plugins/ba-workflow
git pull origin main
```

---

## Uninstall

```bash
npx ba-workflow-plugin --uninstall
```

### Step 2: Clean Up Project Outputs (optional)

The plugin creates output files in your project. Remove them if no longer needed:

```bash
# Remove workflow outputs (stories, state files)
rm -rf docs/ba-workflows/

# Remove project-level config
rm -f docs/ba-workflow-config.json
```

> **Note:** Only remove project outputs if you're sure you don't need the generated stories. They are independent documents — the plugin is not needed to read them.

---

## Commands

All commands are namespaced under `ba-workflow:`. Use them as shown below:

| Command | Purpose |
|---------|---------|
| `/ba-workflow:init` | Configure workspace, Jira settings (one-time setup) |
| `/ba-workflow:go <requirement>` | Run full 7-step workflow (master command) |
| `/ba-workflow:analyze <requirement>` | Phase 1: Requirements + Brainstorm + Elicitation + Workflow Detection |
| `/ba-workflow:brainstorm <requirement>` | Standalone Socratic brainstorming (also runs inline in go/analyze) |
| `/ba-workflow:stories` | Phase 2-3: Complexity + Story Creation + PO Review + Jira Sync |
| `/ba-workflow:review` | PO Story Review (standalone, re-review existing stories) |

## Quick Start

```bash
# 1. Initialize (one-time setup)
/ba-workflow:init

# 2. Run the full workflow (brainstorming runs inline)
/ba-workflow:go Add user authentication with Google OAuth

# Or run phases individually:
/ba-workflow:brainstorm Add user authentication with Google OAuth   # standalone brainstorm
/ba-workflow:analyze Add user authentication with Google OAuth       # Phase 1 (includes brainstorm)
/ba-workflow:stories
```

---

## Skills (Quality & Automation)

4 focused skills are injected at specific integration points:

| Skill | Phase | What It Does |
|-------|-------|-------------|
| **Socratic Discovery** | Phase 1 | Inline Socratic brainstorming — discovers implicit requirements, surfaces decisions, produces structured output (goals, functional reqs, acceptance criteria) |
| **Two-Stage Review** | Phase 2 | Stage 1: Spec compliance per story. Stage 2: Quality. Severity: CRITICAL/IMPORTANT/MINOR |
| **Codebase Context** | Phase 2 | Queries Serena plugin's project memory for business rules and edge cases (no live code scanning) |
| **Testable Criteria** | Phase 2 | Enforces point-by-point format on all acceptance criteria. Flags vague phrases |

---

## Features

### Agent Personas
- **Mary** (Business Analyst) — Runs Socratic brainstorming and uses business docs to drive non-technical requirements discovery
- **John** (Product Owner) — Reviews each story with two-stage structured feedback and approval/revision flow

### 50 Elicitation Methods
Ported from BMAD's advanced elicitation system across 10 categories:
- Core, Creative, Risk, Collaboration, Advanced, Competitive, Technical, Research, Learning, Philosophical

Interactive selection with full engine:
```
Advanced Elicitation Options
Choose a number (1-5), [r] to Reshuffle, [a] List All 50, or [x] to Skip/Proceed:

1. Pre-mortem Analysis — Imagine failure, work backwards to prevent
2. User Persona Focus Group — Role-play as different users
3. What-If Scenarios — Explore edge cases and alternatives
4. SCAMPER Method — 7 creativity lenses for innovation
5. Stakeholder Round Table — Multiple perspectives on requirements
r. Reshuffle — show 5 different methods
a. List all 50 methods with descriptions
x. Skip — proceed without elicitation
```

### Centralized Workspace
Each workflow run gets its own isolated folder — no file collisions between features:
```
docs/ba-workflows/
  user-auth-google/          # Workflow 1
    state.json
    jira-sync-status.json
    system-context.md
    stories/
      01-login-flow.md
      02-oauth-callback.md
  admin-dashboard/           # Workflow 2 (independent)
    ...
```

### Jira Integration
- Always asks before syncing (never auto-pushes)
- Batch creates stories via Atlassian MCP
- Auto-detects project key from previous syncs
- Updates local story files with Jira issue keys

### Workflow Detection
- Checks your `docs/business-docs/` folder for existing business documentation
- Lists filenames and lets the user select which are associated with the requirement
- Only reads user-selected files — no upfront scoring or analysis
- Selected workflows inform story dependencies and impact analysis

### Complexity Levels

| Level | Scope | Stories |
|-------|-------|---------|
| 0 | Atomic change | 1 |
| 1 | Small feature | 1-10 |
| 2 | Medium project | 5-15 |
| 3 | Complex system | 12-40 |
| 4 | Enterprise | 40+ |

---

## Plugin Structure

```
ba-workflow/
  .claude-plugin/
    plugin.json               # Plugin metadata
  commands/                   # 6 slash commands (namespaced as ba-workflow:*)
    init.md                   # /ba-workflow:init
    go.md                     # /ba-workflow:go
    analyze.md                # /ba-workflow:analyze
    brainstorm.md             # /ba-workflow:brainstorm
    stories.md                # /ba-workflow:stories
    review.md                 # /ba-workflow:review
  agents/                     # Agent personas
    analyst.md                # Mary — Business Analyst
    product-owner.md          # John — Product Owner
  skills/                     # 4 focused quality & automation skills
    socratic-discovery.md
    two-stage-review.md
    codebase-context.md
    testable-criteria.md
  templates/                  # Output templates
    story-template.md         # User story template
  elicitation-methods.md      # 50 methods + execution engine
  config.md                   # Default settings reference
```

---

## Requirements

- **Claude Code** CLI
- **Atlassian MCP** server (optional, for Jira sync — see setup below)
- A `docs/business-docs/` folder with your project's workflow documentation (optional, for workflow detection)

### Setting Up Jira MCP (Optional)

Jira sync requires the Atlassian MCP server. The plugin works without it — you just won't be able to push stories to Jira. `/ba-workflow:init` will detect if it's missing and guide you.

**To set up manually:**

Add to `~/.claude/settings.json` (global) or `.claude/settings.local.json` (project-only):

```json
{
  "mcpServers": {
    "Atlassian-MCP": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.atlassian.com/v1/sse"]
    }
  }
}
```

After adding, **restart Claude Code** for the MCP server to connect. On first use, it will prompt you to authenticate with your Atlassian account.

> **No Jira?** No problem. Run `/ba-workflow:init` and choose "Skip Jira". The plugin generates all stories locally — Jira sync is just the optional last step.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes
4. Push and open a PR

---

## License

MIT
