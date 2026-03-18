# Codebase Context Generation

## Core Principle
Before writing stories, understand how the existing system works so stories align with real architecture — not imagined architecture.

## When to Apply
- Phase 4, before story generation (ba-stories Step 7)
- Generates `{workspace}/{workflow_id}/system-context.md`

## What to Scan

### 1. Project Structure
```
Scan the project root and document:
- Module/directory structure (e.g., src/modules/*)
- Entry points (main.ts, app.module.ts)
- Config files (database, environment)
- Test structure and patterns
```

### 2. Naming Conventions (from actual code)
```
Extract real examples:
- File naming: kebab-case? PascalCase? (show 3 examples)
- Class naming: (show 3 examples)
- Database tables: snake_case? (show 3 examples)
- API routes: /api/v1/resource? (show 3 examples)
```

### 3. Key Patterns (with real code references)
```
For each pattern, cite the actual file:
- How entities are defined (example: src/modules/utility/entities/utility.entity.ts)
- How services are structured (example: src/modules/scraping/services/...)
- How controllers handle requests (example: src/modules/web-api/controllers/...)
- How DTOs validate input (example: src/modules/.../dto/...)
- How migrations are created (example: src/database/migrations/...)
```

### 4. Infrastructure Constraints
```
From CLAUDE.md, config files, and docs:
- Database type and ORM (PostgreSQL + TypeORM)
- Queue system (BullMQ + Redis)
- External services (Playwright, proxy, Twilio)
- Environment variable patterns
```

### 5. Existing Business Rules
```
From docs/business-docs/:
- List which modules have documented business rules
- Note any rules that affect the current requirement
```

## Output Format

Save to `{workspace}/{workflow_id}/system-context.md`:

```markdown
# System Context for {workflow_id}

Generated: {timestamp}

## Project Structure
[extracted structure]

## Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | generic-template-scraper.service.ts |
| Classes | PascalCase | GenericTemplateScraperService |
| DB Tables | snake_case | outage_reports |
| DB Columns | snake_case | utility_id |

## Key Patterns
### Entity Pattern
[real example with file path]

### Service Pattern
[real example with file path]

### Controller Pattern
[real example with file path]

## Infrastructure
- Database: PostgreSQL + TypeORM
- Queue: BullMQ + Redis
- [other relevant infrastructure]

## Relevant Business Rules
[rules from docs/business-docs/ that affect this requirement]

## Story Writing Guidelines
Based on the above context, stories for this workflow should:
- Follow [specific pattern] for new entities
- Use [specific service pattern] for business logic
- Reference [specific migration pattern] for schema changes
```

## Integration with Story Creation
When ba-stories generates stories:
1. Read system-context.md
2. Add "Dev Notes" section to each story referencing relevant patterns
3. Ensure story tasks align with existing conventions
4. Flag if any story requires a pattern that doesn't exist yet
