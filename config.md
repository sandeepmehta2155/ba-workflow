# BA Workflow Configuration

## Default Settings
These are the default values. Run `/ba-init` to customize.

| Setting | Default | Description |
|---------|---------|-------------|
| output_folder | `docs/` | Where PRDs and review feedback are saved |
| story_dir | `docs/stories/` | Where story files are saved |
| jira_mcp_enabled | `true` | Whether to offer Jira sync |
| jira_project_key | _(ask at runtime)_ | Jira project key (e.g., OUTAGE) |
| jira_story_type | `Story` | Jira issue type for stories |
| communication_language | `English` | Language for all workflow communication |
| document_output_language | `English` | Language for generated documents |

## Status File
Workflow progress is tracked in: `docs/ba-workflow-status.md`

## Business Rules Source
Project business rules index: `.claude/ba-workflow/business-rules.md`
Business docs folder: `docs/business-docs/`

## Complexity Levels

| Level | Scope | Story Count | PRD Depth |
|-------|-------|-------------|-----------|
| 0 | Single atomic change | 1 | Minimal |
| 1 | Small feature | 1-10 | Simple |
| 2 | Medium project | 5-15 | Structured |
| 3 | Complex system | 12-40 | Comprehensive |
| 4 | Enterprise scale | 40+ | Enterprise |
