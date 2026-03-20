Initialize BA Workflow configuration for this project.

## Purpose
Set up the BA workflow by asking configuration questions and saving preferences. Run this once (or again to reconfigure).

## Steps

1. **Read current config** from `the plugin's `config.md`` to understand defaults.

2. **Detect Jira MCP availability** — before asking any Jira questions, check if the Atlassian MCP server is already available by listing MCP tools.

3. **Ask the user these setup questions** one at a time, showing the current default in brackets:

   **Q1: Workspace Root**
   Where should all BA workflow outputs be organized? Each workflow run gets its own subfolder here. [default: `docs/ba-workflows/`]

   **If Jira MCP is already detected (step 2):** skip Q2 and Q3. Auto-set `jira_mcp_enabled: true` and inform the user:
   ```
   ✅ Jira MCP detected — Jira integration enabled automatically.
   ```
   Then ask only:

   **Q2a: Jira Project Key**
   What is your Jira project key? (e.g., OUTAGE) Leave blank to be asked each time. [default: blank]

   **If Jira MCP is NOT detected (step 2):** ask the full Jira setup questions:

   **Q2: Jira Integration**
   Do you want Jira sync enabled? The workflow will always ASK before syncing. (yes/no) [default: yes]

   **Q3: Jira Project Key**
   What is your Jira project key? (e.g., OUTAGE) Leave blank to be asked each time. [default: blank]

4. **Validate paths exist** — if workspace root doesn't exist, create it.

5. **Verify business docs** — check that `docs/business-docs/` directory exists. Warn if missing (workflow detection in Step 3 uses this folder).

6. **Verify Jira MCP (only if Jira enabled but MCP not detected in step 2)** — if the user answered yes to Q2 but MCP was not detected, display:
   ```
   ⚠️  Atlassian MCP server not detected.

   Jira sync requires the Atlassian MCP server. You have two options:

   Option A: Add to ~/.claude/settings.json (global — all projects):
   {
     "mcpServers": {
       "Atlassian-MCP": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "mcp-remote@latest", "https://mcp.atlassian.com/v1/sse"]
       }
     }
   }

   Option B: Add to .claude/settings.local.json (this project only):
   Same config as above.

   After adding, restart Claude Code for MCP to connect.

   How would you like to proceed?
   1. I'll set up Jira MCP now — pause init, I'll restart and re-run /ba-workflow:init
   2. Skip Jira for now — disable Jira sync, I can enable it later
   3. Jira MCP is already configured elsewhere — continue
   ```
   - If user picks 1: halt init, remind to restart Claude Code after adding MCP config
   - If user picks 2: set `jira_mcp_enabled: false` in config and continue
   - If user picks 3: continue with Jira enabled

7. **Save configuration** — write the user's answers to `docs/ba-workflow-config.json`:
   ```json
   {
     "workspace": "docs/ba-workflows/",
     "jira_mcp_enabled": true,
     "jira_project_key": "",
     "jira_story_type": "Story",
     "communication_language": "English",
     "document_output_language": "English",
     "initialized_at": "2026-03-18T00:00:00Z"
   }
   ```

8. **List existing workflows** — scan workspace for existing workflow folders and display:
   ```
   Existing workflows:
     admin-storm-creation/  (complete, 8 stories, synced to Jira)
     entity-history-log/    (phase 1, requirements gathered)
     [empty - no workflows yet]
   ```

9. **Display summary** of saved configuration and available commands:
   ```
   BA Workflow initialized!

   Configuration saved to: docs/ba-workflow-config.json
   Workspace: docs/ba-workflows/

   Each workflow creates its own folder:
     docs/ba-workflows/{feature-name}/
       state.json                    # Workflow progress
       jira-sync-status.json         # Jira sync mapping
       stories/                      # Generated user stories (PO reviewed)
         01-story-title.md
         02-another-story.md

   Available commands:
     /ba-workflow:go <requirement>  - Run full 7-step workflow (master)
     /ba-workflow:analyze <req>     - Steps 1-3: Requirements + Elicitation + Workflow Detection
     /ba-workflow:stories           - Steps 4-7: Complexity + Story Creation + PO Review + Jira Sync
     /ba-workflow:review            - Step 6: PO Story Review (standalone)
     /ba-workflow:init              - Reconfigure settings (this command)
   ```

## Key Rules
- Accept Enter/blank to keep defaults
- All paths are relative to project root
- Create directories if they don't exist
- Never hardcode absolute paths
- Config is global; each workflow run creates its own scoped folder
