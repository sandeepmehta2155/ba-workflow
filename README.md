# BA Workflow Plugin for Claude Code

A BMAD-style 9-step Business Analysis workflow plugin that takes you from a rough requirement all the way to Jira-ready user stories — with quality scoring, verification gates, confidence tracking, and structured PO review.

## What It Does

| Phase | Steps | Description |
|-------|-------|-------------|
| **Phase 1** | Steps 1-3 | Requirements gathering, Socratic discovery, elicitation methods (50 techniques), workflow detection |
| **Phase 2** | Steps 4-5 | Story complexity scoring (0-4), PRD creation with quality gate (60% minimum) |
| **Phase 3** | Step 6 | Two-stage PO review (spec compliance + quality) with feedback protocol |
| **Phase 4** | Steps 7-8 | User story generation (Given/When/Then enforced), parallel waves, Jira sync |

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

| Command | Purpose |
|---------|---------|
| `/ba-init` | Configure workspace, Jira settings |
| `/ba-workflow <requirement>` | Run full 9-step workflow (master command) |
| `/ba-analyze <requirement>` | Phase 1: Requirements + Elicitation + Workflow Detection |
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

---

## Skills (Quality Gates & Automation)

10 skills are injected at specific integration points throughout the workflow:

| Skill | Phase | What It Does |
|-------|-------|-------------|
| **Socratic Discovery** | Phase 1 | Surfaces implicit requirements, identifies unmade decisions, asks targeted questions with defaults |
| **Requirement Quality Scoring** | Phase 1, 2 | 5-dimension scoring: Clarity/Specificity/Actionability/Grammar/Scope. Gate: < 60% forces refinement |
| **Verification Checklist** | Phase 2, 4 | 3-level check: Clarity + Completeness + Technical Alignment. Maps every requirement to PRD/story |
| **Two-Stage Review** | Phase 3 | Stage 1: Spec compliance. Stage 2: Quality. Severity: CRITICAL/IMPORTANT/MINOR |
| **Feedback Protocol** | Phase 3 | Verify-Assess-Respond-Implement. Push back if feedback breaks other requirements |
| **Confidence Scoring** | All phases | HIGH/MEDIUM/LOW per phase. LOW = halt and ask human |
| **Codebase Context** | Phase 4 | Scans existing code patterns so stories align with real architecture |
| **Testable Criteria** | Phase 4 | Enforces Given/When/Then on all acceptance criteria. Flags vague phrases |
| **Parallel Stories** | Phase 4 | Wave-based parallel generation for Level 2+ complexity |
| **Receipts** | All phases | JSON proof-of-work per phase with audit trail |

---

## Features

### Agent Personas
- **Mary** (Business Analyst) — Asks only non-technical business questions across 8 categories
- **John** (Product Owner) — Reviews PRDs with two-stage structured feedback and approval/revision flow

### 50 Elicitation Methods
Ported from BMAD's advanced elicitation system across 10 categories:
- Core, Creative, Risk, Collaboration, Advanced, Competitive, Technical, Research, Learning, Philosophical

Interactive selection: pick by number, reshuffle, browse all, or use quick picks.

### Centralized Workspace
Each workflow run gets its own isolated folder — no file collisions between features:
```
docs/ba-workflows/
  user-auth-google/          # Workflow 1
    state.json
    PRD.md
    PO-review-feedback.md
    jira-sync-status.json
    quality-scores.json
    system-context.md
    receipts/
      phase-1-receipt.json
      phase-2-receipt.json
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
  commands/                   # 6 slash commands
    ba-init.md
    ba-workflow.md
    ba-analyze.md
    ba-prd.md
    ba-review.md
    ba-stories.md
  agents/                     # Agent personas
    analyst.md                # Mary — Business Analyst
    product-owner.md          # John — Product Owner
  skills/                     # 10 quality & automation skills
    requirement-quality-scoring.md
    verification-checklist.md
    socratic-discovery.md
    two-stage-review.md
    confidence-scoring.md
    codebase-context.md
    receipts.md
    parallel-stories.md
    feedback-protocol.md
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
- **Atlassian MCP** server (optional, for Jira sync)
- A `docs/business-docs/` folder with your project's workflow documentation (optional, for workflow detection)

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes
4. Push and open a PR

---

## License

MIT
