Initialize BA Workflow configuration for this project.

## Purpose
Set up the BA workflow by asking configuration questions and saving preferences. Run this once (or again to reconfigure).

## Steps

1. **Read current config** from `the plugin's `config.md`` to understand defaults.

2. **Ask the user these setup questions** one at a time, showing the current default in brackets:

   **Q1: Workspace Root**
   Where should all BA workflow outputs be organized? Each workflow run gets its own subfolder here. [default: `docs/ba-workflows/`]

   **Q2: Jira Integration**
   Do you want Jira sync enabled? The workflow will always ASK before syncing. (yes/no) [default: yes]

   **Q3: Jira Project Key**
   What is your Jira project key? (e.g., OUTAGE) Leave blank to be asked each time. [default: blank]

3. **Validate paths exist** — if workspace root doesn't exist, create it.

4. **Verify business rules** — check that `the plugin's `business-rules.md`` exists and `docs/business-docs/` directory exists. Warn if missing.

5. **Verify Jira MCP** — if Jira is enabled, check if the Atlassian MCP server is available by listing MCP tools. If NOT available, display:
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

6. **Save configuration** — write the user's answers to `docs/ba-workflow-config.json`:
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

7. **List existing workflows** — scan workspace for existing workflow folders and display:
   ```
   Existing workflows:
     admin-storm-creation/  (complete, 8 stories, synced to Jira)
     entity-history-log/    (phase 2, PRD created)
     [empty - no workflows yet]
   ```

8. **Display summary** of saved configuration and available commands:
   ```
   BA Workflow initialized!

   Configuration saved to: docs/ba-workflow-config.json
   Workspace: docs/ba-workflows/

   Each workflow creates its own folder:
     docs/ba-workflows/{feature-name}/
       state.json                    # Workflow progress
       {title}_PRD.md                # Product Requirements Document
       {title}_PO-review-feedback.md # PO review feedback
       jira-sync-status.json         # Jira sync mapping
       stories/                      # Generated user stories
         01-story-title.md
         02-another-story.md

   Available commands:
     /ba-workflow:go <requirement>  - Run full 9-step workflow (master)
     /ba-workflow:analyze <req>     - Steps 1-3: Requirements + Elicitation + Workflow Detection
     /ba-workflow:prd               - Steps 4-5: Complexity + PRD Creation
     /ba-workflow:review            - Step 6: PO Review + Correction Loop
     /ba-workflow:stories           - Steps 7-8: Story Creation + Jira Sync
     /ba-workflow:init              - Reconfigure settings (this command)
   ```

## Key Rules
- Accept Enter/blank to keep defaults
- All paths are relative to project root
- Create directories if they don't exist
- Never hardcode absolute paths
- Config is global; each workflow run creates its own scoped folder
