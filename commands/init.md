Initialize BA Workflow configuration for this project.

## Purpose
Set up the BA workflow by auto-detecting settings and presenting a single confirmation screen. Run this once (or again to reconfigure).

## Design Principle
**Auto-detect first, confirm once.** Instead of asking questions one at a time, detect everything possible upfront and present a single consolidated configuration screen. The user reviews and either accepts all defaults or changes specific items by number — one interaction instead of many.

## Steps

1. **Silent detection phase** — do ALL of this before showing anything to the user:
   a. Read current config from `docs/ba-workflow-config.json` (if exists) and the plugin's `config.md` for defaults.
   b. Detect Jira MCP availability by listing MCP tools.
   c. Check if `docs/ba-workflows/` exists.
   d. Check if `docs/business-docs/` exists.
   e. Scan workspace for existing workflow folders.

2. **Present single configuration screen** — show everything detected with a numbered menu. Use AskUserQuestion to collect the response in ONE prompt:

   ```
   ━━━ BA Workflow Setup ━━━

   Detected settings (enter numbers to change, or press Enter to accept all):

     1. Workspace Root:     docs/ba-workflows/
     2. Jira Integration:   Enabled (MCP detected)     ← or "Disabled (MCP not found)"
     3. Jira Project Key:   (ask each time)

   Status:
     [✓] Workspace directory exists
     [✓] Business docs folder exists               ← or [!] docs/business-docs/ not found — create it and add business documents
     [✓] Jira MCP connected                        ← or [!] Jira MCP not detected

   Existing workflows:
     admin-storm-creation/  (complete, 8 stories)
     entity-history-log/    (phase 1)
     — or: (none yet)

   ━━━━━━━━━━━━━━━━━━━━━━━

   Enter numbers to change (e.g., "1,3"), or press Enter to accept all:
   ```

   **Important formatting rules:**
   - Show Jira status based on MCP detection from step 1b
   - Show existing config values if re-running init
   - Use [✓] for detected/ready items, [!] for warnings

3. **Handle user response** — single branch:

   - **User presses Enter / says "ok" / "looks good"**: Accept all detected defaults. Proceed to step 5.

   - **User enters numbers (e.g., "1,3" or "2")**: For each number selected, ask ONLY those specific follow-up questions in a single grouped prompt. Example if user picks "1,3":
     ```
     1. Workspace Root — enter new path [current: docs/ba-workflows/]:
     3. Jira Project Key — enter key (e.g., OUTAGE) or blank for ask-each-time:
     ```
     Then proceed to step 5.

   - **User picks "2" to change Jira integration**:
     - If toggling ON but MCP not detected, show Jira MCP setup info:
       ```
       Jira sync requires the Atlassian MCP server. Add to settings:

       ~/.claude/settings.json (global) or .claude/settings.local.json (project):
       {
         "mcpServers": {
           "Atlassian-MCP": {
             "type": "stdio",
             "command": "npx",
             "args": ["-y", "mcp-remote@latest", "https://mcp.atlassian.com/v1/sse"]
           }
         }
       }

       Options:
         a) I'll set up now — pause init, restart Claude Code, re-run /ba-workflow:init
         b) Skip Jira for now — continue without it
         c) Already configured — continue with Jira enabled
       ```
     - If toggling OFF: set `jira_mcp_enabled: false` and continue.

4. **Create directories** — silently create workspace root and business-docs if they don't exist. No confirmation needed for directory creation.

5. **Save configuration** — write to `docs/ba-workflow-config.json`:
   ```json
   {
     "workspace": "docs/ba-workflows/",
     "jira_mcp_enabled": true,
     "jira_project_key": "",
     "jira_story_type": "Story",
     "communication_language": "English",
     "document_output_language": "English",
     "initialized_at": "2026-03-21T00:00:00Z"
   }
   ```

6. **Display final summary** — brief confirmation, no redundant info:
   ```
   BA Workflow initialized!
   Config saved: docs/ba-workflow-config.json

   Workspace: docs/ba-workflows/{feature-name}/
     state.json          — workflow progress
     stories/            — generated user stories

   Commands:
     /ba-workflow:go <requirement>  — full 7-step workflow
     /ba-workflow:analyze <req>     — requirements + elicitation
     /ba-workflow:stories           — story creation + PO review
     /ba-workflow:review            — standalone PO review
     /ba-workflow:init              — reconfigure (this command)
   ```

## Key Rules
- **One interaction, not many** — auto-detect everything, present once, confirm once
- Accept Enter/blank to keep all defaults
- All paths are relative to project root
- Create directories silently — don't ask permission for mkdir
- Never hardcode absolute paths
- Config is global; each workflow run creates its own scoped folder
- Do NOT use separate AskUserQuestion calls for each setting — batch them
