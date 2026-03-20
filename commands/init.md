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

2. **Present configuration using `AskUserQuestion`** — show status summary first, then use interactive selection:

   First display the status summary:
   ```
   ━━━ BA Workflow Setup ━━━

   Detected:
     [✓] Workspace directory exists               ← or [!] will be created
     [✓] Business docs folder exists               ← or [!] docs/business-docs/ not found
     [✓] Jira MCP connected                        ← or [!] Jira MCP not detected

   Existing workflows:
     admin-storm-creation/  (complete, 8 stories)
     — or: (none yet)
   ```

   Then use `AskUserQuestion` to confirm settings:
   ```
   AskUserQuestion({
     questions: [
       {
         question: "Where should workflow outputs be saved?",
         header: "Workspace",
         multiSelect: false,
         options: [
           { label: "docs/ba-workflows/ (Recommended)", description: "Auto-detected default workspace path" },
           { label: "docs/workflows/", description: "Alternative location" },
           { label: "ba-output/", description: "Project root subfolder" }
         ]
       },
       {
         question: "Enable Jira integration?",
         header: "Jira",
         multiSelect: false,
         options: [
           { label: "Enabled (Recommended)", description: "MCP detected — sync stories to Jira automatically" },
           { label: "Disabled", description: "Stories saved locally only" }
         ]
       }
     ]
   })
   ```
   Note: Adapt options based on detection results. If MCP not found, show "Disabled (Recommended)" first with description "MCP not detected — enable later with /ba-workflow:init".

3. **Handle user response** — single branch:

   - **User presses Enter / says "ok" / "looks good"**: Accept all detected defaults. Proceed to step 5.

   - **User enters numbers (e.g., "1,3" or "2")**: For each number selected, ask ONLY those specific follow-up questions in a single grouped prompt. Example if user picks "1,3":
     ```
     1. Workspace Root — enter new path [current: docs/ba-workflows/]:
     3. Jira Project Key — enter key (e.g., OUTAGE) or blank for ask-each-time:
     ```
     Then proceed to step 5.

   - **If user enables Jira but MCP not detected**, show Jira MCP setup info, then use `AskUserQuestion`:
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
       ```
       Then:
       ```
       AskUserQuestion({
         questions: [{
           question: "How would you like to handle Jira setup?",
           header: "Jira Setup",
           multiSelect: false,
           options: [
             { label: "Skip Jira for now (Recommended)", description: "Continue without Jira — enable later with /ba-workflow:init" },
             { label: "I'll set up now", description: "Pause init, restart Claude Code, re-run /ba-workflow:init" },
             { label: "Already configured", description: "MCP is set up — continue with Jira enabled" }
           ]
         }]
       })
       ```

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
