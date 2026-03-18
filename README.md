# BA Workflow Plugin for Claude Code

A streamlined 9-step Business Analysis workflow plugin that takes you from a rough requirement to Jira-ready user stories — with Socratic discovery, structured PO review, and Given/When/Then enforcement.

## What It Does

| Phase | Steps | Description |
|-------|-------|-------------|
| **Phase 1** | Steps 1-3 | Requirements gathering, Socratic discovery, elicitation methods (50 techniques), workflow detection |
| **Phase 2** | Steps 4-5 | Story complexity scoring (0-4), PRD creation |
| **Phase 3** | Step 6 | Two-stage PO review (spec compliance + quality) |
| **Phase 4** | Steps 7-8 | User story generation (Given/When/Then enforced), Jira sync |

---

## Installation

### Option 1: Plugin Marketplace (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add sandeepmehta2155/ba-workflow
/plugin install ba-workflow@ba-workflow-marketplace
```

### Option 2: Manual Settings

Add to `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "ba-workflow-marketplace": {
      "source": {
        "source": "github",
        "repo": "sandeepmehta2155/ba-workflow"
      }
    }
  },
  "enabledPlugins": {
    "ba-workflow@ba-workflow-marketplace": true
  }
}
```

### Option 3: Manual Clone

```bash
git clone https://github.com/sandeepmehta2155/ba-workflow.git ~/.claude/plugins/ba-workflow
```

---

## Update

### Update via Plugin Manager

```bash
# Update to latest version
/plugin update ba-workflow
```

### Manual Update (if cloned)

```bash
cd ~/.claude/plugins/cache/ba-workflow-marketplace/ba-workflow/1.0.0
git pull origin main
```

Or if you cloned manually:

```bash
cd ~/.claude/plugins/ba-workflow
git pull origin main
```

### Check Current Version

```bash
# View installed plugin info
/plugin list
```

---

## Uninstall & Cleanup

### Step 1: Disable the Plugin

```bash
# Disable without removing
/plugin disable ba-workflow@ba-workflow-marketplace
```

### Step 2: Uninstall the Plugin

```bash
# Remove the plugin completely
/plugin uninstall ba-workflow@ba-workflow-marketplace
```

### Step 3: Remove the Marketplace (optional)

```bash
# Remove the custom marketplace registration
/plugin marketplace remove ba-workflow-marketplace
```

Or manually edit `~/.claude/settings.json` and remove:
```json
{
  "extraKnownMarketplaces": {
    "ba-workflow-marketplace": { ... }   // <-- delete this block
  },
  "enabledPlugins": {
    "ba-workflow@ba-workflow-marketplace": true   // <-- delete this line
  }
}
```

### Step 4: Clean Up Plugin Cache (optional)

```bash
# Remove cached plugin files
rm -rf ~/.claude/plugins/cache/ba-workflow-marketplace/
```

### Step 5: Clean Up Project Outputs (optional)

The plugin creates output files in your project. Remove them if no longer needed:

```bash
# Remove workflow outputs (PRDs, stories, state files)
rm -rf docs/ba-workflows/

# Remove project-level config
rm -f docs/ba-workflow-config.json
```

> **Note:** Only remove project outputs if you're sure you don't need the generated PRDs and stories. They are independent documents — the plugin is not needed to read them.

---

## Commands

All commands are namespaced under `ba-workflow:`. Use them as shown below:

| Command | Purpose |
|---------|---------|
| `/ba-workflow:init` | Configure workspace, Jira settings (one-time setup) |
| `/ba-workflow:go <requirement>` | Run full 9-step workflow (master command) |
| `/ba-workflow:analyze <requirement>` | Phase 1: Requirements + Elicitation + Workflow Detection |
| `/ba-workflow:prd` | Phase 2: Complexity + PRD Creation |
| `/ba-workflow:review` | Phase 3: PO Review + Correction Loop |
| `/ba-workflow:stories` | Phase 4: Story Creation + Jira Sync |

## Quick Start

```bash
# 1. Initialize (one-time setup)
/ba-workflow:init

# 2. Run the full workflow
/ba-workflow:go Add user authentication with Google OAuth

# Or run phases individually:
/ba-workflow:analyze Add user authentication with Google OAuth
/ba-workflow:prd
/ba-workflow:review
/ba-workflow:stories
```

---

## Skills (Quality & Automation)

4 focused skills are injected at specific integration points:

| Skill | Phase | What It Does |
|-------|-------|-------------|
| **Socratic Discovery** | Phase 1 | Surfaces implicit requirements, identifies unmade decisions, asks targeted questions with defaults |
| **Two-Stage Review** | Phase 3 | Stage 1: Spec compliance. Stage 2: Quality. Severity: CRITICAL/IMPORTANT/MINOR |
| **Codebase Context** | Phase 4 | Scans existing code patterns so stories align with real architecture |
| **Testable Criteria** | Phase 4 | Enforces Given/When/Then on all acceptance criteria. Flags vague phrases |

---

## Features

### Agent Personas
- **Mary** (Business Analyst) — Asks only non-technical business questions across 8 categories
- **John** (Product Owner) — Reviews PRDs with two-stage structured feedback and approval/revision flow

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
    PRD.md
    PO-review-feedback.md
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
- Scans your `docs/business-docs/` folder for existing documentation
- Scores relevance (0-100%) against the requirement
- Extracts dependencies and integration points
- Feeds detected workflows into PRD dependencies and impact analysis

### Complexity Levels

| Level | Scope | Stories | PRD Depth |
|-------|-------|---------|-----------|
| 0 | Atomic change | 1 | Minimal |
| 1 | Small feature | 1-10 | Simple |
| 2 | Medium project | 5-15 | Structured |
| 3 | Complex system | 12-40 | Comprehensive |
| 4 | Enterprise | 40+ | Enterprise |

---

## Plugin Structure

```
ba-workflow/
  .claude-plugin/
    plugin.json               # Plugin metadata
    marketplace.json          # Marketplace registry
  commands/                   # 6 slash commands (namespaced as ba-workflow:*)
    init.md                   # /ba-workflow:init
    go.md                     # /ba-workflow:go
    analyze.md                # /ba-workflow:analyze
    prd.md                    # /ba-workflow:prd
    review.md                 # /ba-workflow:review
    stories.md                # /ba-workflow:stories
  agents/                     # Agent personas
    analyst.md                # Mary — Business Analyst
    product-owner.md          # John — Product Owner
  skills/                     # 4 focused quality & automation skills
    socratic-discovery.md
    two-stage-review.md
    codebase-context.md
    testable-criteria.md
  templates/                  # Output templates
    prd-template.md           # PRD document template
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

> **No Jira?** No problem. Run `/ba-workflow:init` and choose "Skip Jira". The plugin generates all PRDs and stories locally — Jira sync is just the optional last step.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes
4. Push and open a PR

---

## License

MIT
