Initialize BA Workflow configuration for this project.

## Purpose
Set up the BA workflow by asking configuration questions and saving preferences. Run this once (or again to reconfigure).

## Steps

1. **Read current config** from the plugin's `config.md` to understand defaults.

2. **Ask the user these setup questions** one at a time, showing the current default in brackets:

   **Q1: Output Folder**
   Where should PRDs and review feedback be saved? [default: `docs/`]

   **Q2: Story Directory**
   Where should generated story files be saved? [default: `docs/stories/`]

   **Q3: Jira Integration**
   Do you want Jira sync enabled? The workflow will always ASK before syncing. (yes/no) [default: yes]

   **Q4: Jira Project Key**
   What is your Jira project key? (e.g., OUTAGE) Leave blank to be asked each time. [default: blank]

3. **Validate paths exist** — if output_folder or story_dir don't exist, create them.

4. **Verify business rules** — check if `docs/business-docs/` directory exists. If missing, warn user and suggest creating it with their project's workflow documentation.

5. **Verify Jira MCP** — if Jira is enabled, check that the Atlassian MCP server is available. Warn if not connected.

6. **Save configuration** — write the user's answers to `docs/ba-workflow-config.json` (in the project, not in the plugin):
   ```json
   {
     "output_folder": "docs/",
     "story_dir": "docs/stories/",
     "jira_mcp_enabled": true,
     "jira_project_key": "",
     "jira_story_type": "Story",
     "communication_language": "English",
     "document_output_language": "English",
     "initialized_at": "2026-03-18T00:00:00Z"
   }
   ```

7. **Display summary** of saved configuration and available commands:
   ```
   BA Workflow initialized!

   Configuration saved to: docs/ba-workflow-config.json

   Available commands:
     /ba-workflow   - Run full 9-step workflow (master)
     /ba-analyze    - Steps 1-3: Requirements + Elicitation + Workflow Detection
     /ba-prd        - Steps 4-5: Complexity + PRD Creation
     /ba-review     - Step 6: PO Review + Correction Loop
     /ba-stories    - Steps 7-8: Story Creation + Jira Sync
     /ba-init       - Reconfigure settings (this command)
   ```

## Key Rules
- Accept Enter/blank to keep defaults
- All paths are relative to project root
- Create directories if they don't exist
- Never hardcode absolute paths
- Config is saved in the PROJECT (docs/), not in the plugin directory
