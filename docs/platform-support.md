# Multi-Platform Support

BA Workflow is designed as a Claude Code plugin but can be adapted to work on other AI coding platforms. This document maps platform-specific capabilities and provides installation guides.

## Platform Capability Matrix

| Capability | Claude Code | Cursor | Codex | Gemini CLI | OpenCode |
|-----------|------------|--------|-------|------------|----------|
| **Slash commands** | `/ba-workflow:go` | Custom command | Prompt file | Extension | Config hook |
| **Read files** | `Read` tool | `read_file` | `read` | `Read` | `read` |
| **Write files** | `Write` tool | `write_file` | `write` | `Write` | `write` |
| **Edit files** | `Edit` tool | `edit_file` | `edit` | `Edit` | `edit` |
| **Search files** | `Glob` / `Grep` | `search` | `grep` | `Glob` / `Grep` | `search` |
| **Run commands** | `Bash` tool | `terminal` | `shell` | `Bash` | `shell` |
| **Subagent dispatch** | `Agent` tool | Not available | Not available | Not available | Not available |
| **MCP integration** | Native | Via config | Not available | Via config | Via config |
| **Plugin marketplace** | Yes | Via `/add-plugin` | Not available | Via extensions | Via config |

## Feature Availability by Platform

### Full Feature Support (Claude Code)
All features work as documented: slash commands, subagent dispatch, MCP/Jira integration, parallel story generation.

### Partial Feature Support (Cursor, Gemini CLI, OpenCode)
- All workflow steps work (requirements, stories, PO review)
- Subagent dispatch falls back to sequential mode
- MCP/Jira may require platform-specific configuration
- Commands invoked differently (see installation guides below)

### Minimal Support (Codex)
- Core workflow works via prompt files
- No MCP/Jira integration
- No subagent dispatch
- Manual file management may be needed

## Graceful Degradation

When a platform lacks a capability, the workflow degrades gracefully:

| Missing Capability | Fallback Behavior |
|-------------------|-------------------|
| Agent tool (subagents) | Sequential story generation, in-session PO persona switching |
| MCP (Jira sync) | Stories saved locally only. User syncs manually. |
| Slash commands | User pastes command file content or uses platform equivalent |
| Glob/Grep | Use platform's search tool or `find`/`grep` via shell |

All enforcement rules (HARD-GATEs, severity gates, anti-circumvention) work on every platform because they are prose instructions the AI follows, not tool-dependent.

---

## Installation Guides

### Claude Code (Native)

```bash
# From marketplace
claude plugin add ba-workflow

# Or manual clone
git clone https://github.com/sandeepmehta2155/ba-workflow.git
claude plugin add ./ba-workflow
```

Usage: `/ba-workflow:go "your requirement"`

---

### Cursor

1. **Install the plugin:**
   ```
   /add-plugin ba-workflow
   ```
   Or clone the repo and add it manually via Cursor settings.

2. **Invoke commands** by referencing the command file directly:
   - Open `commands/go.md` and tell the AI: "Follow this workflow"
   - Or paste the command content into your prompt

3. **File references:** When commands say `the plugin's agents/analyst.md`, read the file from the plugin's installation directory (typically `~/.cursor/plugins/ba-workflow/`).

4. **Subagents:** Not available. All story generation and PO review runs sequentially in the same session.

5. **Jira sync:** Configure Atlassian MCP in Cursor's MCP settings if available, otherwise skip Jira sync.

---

### Gemini CLI

1. **Install as extension:**
   Clone the repo and register it in your Gemini CLI configuration.

2. **Invoke commands** using the `activate_skill` tool or by referencing command files.

3. **Tool mapping:**
   | BA Workflow Reference | Gemini CLI Equivalent |
   |----------------------|----------------------|
   | `Read` tool | `Read` tool |
   | `Edit` tool | `Edit` tool |
   | `Bash` tool | `Bash` tool |
   | `Glob` tool | `Glob` tool |
   | `Skill` tool | `activate_skill` tool |
   | `Agent` tool | Not available (sequential fallback) |

4. **Subagents:** Not available. Sequential fallback applies.

---

### Codex (OpenAI)

1. **Setup:**
   Clone the repo. Symlink or copy command files to `~/.agents/skills/` for auto-discovery.

2. **Invoke commands** by referencing the command markdown files in your prompts.

3. **Tool mapping:**
   | BA Workflow Reference | Codex Equivalent |
   |----------------------|-----------------|
   | `Read` tool | `read` |
   | `Write` tool | `write` |
   | `Edit` tool | `edit` |
   | `Bash` tool | `shell` |
   | `Glob` / `Grep` | `grep` or shell commands |

4. **Subagents and MCP:** Not available. Sequential fallback for all operations. Jira sync skipped.

---

### OpenCode

1. **Setup:**
   Clone the repo. Register via OpenCode's config hook system.

2. **Tool mapping** follows similar patterns to Codex. Consult OpenCode documentation for exact tool names.

3. **Subagents:** Not available. Sequential fallback applies.

---

## Adding Support for a New Platform

To adapt BA Workflow for a platform not listed here:

1. **Check tool availability:** Does the platform have file read/write/edit, shell execution, and search? These are the minimum requirements.
2. **Map tool names:** Create a mapping from BA Workflow tool references to platform equivalents.
3. **Check for Agent tool:** If unavailable, the `skills/subagent-coordination.md` platform fallback section applies automatically.
4. **Check for MCP:** If unavailable, Jira sync (Step 7) is skipped automatically.
5. **Test the core workflow:** Run `/ba-workflow:analyze` and `/ba-workflow:stories` end-to-end to verify all steps execute correctly.
