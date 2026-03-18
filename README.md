# BA Workflow Plugin for Claude Code

A BMAD-style 9-step Business Analysis workflow plugin that takes you from a rough requirement all the way to Jira-ready user stories.

## What It Does

| Phase | Steps | Description |
|-------|-------|-------------|
| **Phase 1** | Steps 1-3 | Requirements gathering, elicitation methods (50 techniques), workflow detection |
| **Phase 2** | Steps 4-5 | Story complexity scoring (0-4), PRD creation with templates |
| **Phase 3** | Step 6 | Product Owner review with correction loop |
| **Phase 4** | Steps 7-8 | User story generation, Jira sync via Atlassian MCP |

## Installation

### Option 1: Custom Marketplace (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add sandeepmehta2155/ba-workflow
/plugin install ba-workflow@ba-workflow-marketplace
```

Or add manually to `~/.claude/settings.json`:

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

### Option 2: Manual Clone

```bash
git clone https://github.com/sandeepmehta2155/ba-workflow.git
# Then add to your Claude Code settings
```

## Commands

| Command | Purpose |
|---------|---------|
| `/ba-init` | Configure output folders, Jira settings |
| `/ba-workflow` | Run full 9-step workflow (master command) |
| `/ba-analyze` | Phase 1: Requirements + Elicitation + Workflow Detection |
| `/ba-prd` | Phase 2: Complexity + PRD Creation |
| `/ba-review` | Phase 3: PO Review + Correction Loop |
| `/ba-stories` | Phase 4: Story Creation + Jira Sync |

## Quick Start

```bash
# 1. Initialize (one-time setup)
/ba-init

# 2. Run the full workflow
/ba-workflow Add user authentication with Google OAuth

# Or run phases individually:
/ba-analyze Add user authentication with Google OAuth
/ba-prd
/ba-review
/ba-stories
```

## Features

### Agent Personas
- **Mary** (Business Analyst) — Asks only non-technical business questions across 8 categories
- **John** (Product Owner) — Reviews PRDs with structured feedback and approval/revision flow

### 50 Elicitation Methods
Ported from BMAD's advanced elicitation system across 10 categories:
- Core, Creative, Risk, Collaboration, Advanced, Competitive, Technical, Research, Learning, Philosophical

Interactive selection: pick by number, reshuffle, browse all, or use quick picks.

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

## Project Structure

```
ba-workflow/
  .claude-plugin/
    plugin.json           # Plugin metadata
    marketplace.json      # Marketplace registry
  commands/               # 6 slash commands
    ba-init.md
    ba-workflow.md
    ba-analyze.md
    ba-prd.md
    ba-review.md
    ba-stories.md
  agents/                 # Agent personas
    analyst.md            # Mary — Business Analyst
    product-owner.md      # John — Product Owner
  templates/              # Output templates
    prd-template.md       # PRD document template
    story-template.md     # User story template
  elicitation-methods.md  # 50 methods + execution engine
  config.md               # Default settings reference
```

## Output Files

When you run the workflow, it generates these files in your project:

```
docs/
  ba-workflow-config.json            # Your settings
  ba-workflow-state.json             # Workflow progress
  {title}_PRD.md                     # Product Requirements Document
  {title}_PO-review-feedback.md      # PO review feedback
  jira-sync-status.json              # Jira sync mapping
  stories/
    1-story-title.md                 # Generated user stories
    2-another-story.md
```

## Requirements

- **Claude Code** CLI
- **Atlassian MCP** server (optional, for Jira sync)
- A `docs/business-docs/` folder with your project's workflow documentation (optional, for workflow detection)

## License

MIT