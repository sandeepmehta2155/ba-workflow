# First-Stage Project Scan

## Core Principle
Before asking a single question, know **what exists** — not how it works. This is a lightweight surface scan: detect the project shape, find business docs, identify the tech stack from config files only. No code reading. No pattern extraction. Deep analysis happens later in Phase 2 only if the requirement needs it.

## When to Apply
- **Step 1b** of `/ba-workflow:go` and `/ba-workflow:analyze`, after receiving the initial requirement but before clarifying questions
- Runs once per workflow; output is reused across all phases
- Skip if `{workspace}/{workflow_id}/project-scan.md` already exists (resume scenario)

## What This Is NOT
- NOT a deep code scan — do not read source files, do not extract patterns
- NOT an architecture analysis — do not map how modules connect
- NOT a code review — do not evaluate naming conventions or code quality
- Deep code understanding happens in Phase 2 (`skills/codebase-context.md`) only when the requirement demands it

## Scan Flow

### Step 1: Parallel Surface Discovery (3 concurrent searches)

Run all 3 searches simultaneously using Glob only (no file reading, no Grep):

1. **Directory Layout**
   ```
   Glob: src/*/, lib/*/, app/*/, modules/*/
   ```
   → List top-level directories and module folder names only

2. **Business Documentation**
   ```
   Glob: docs/**/*.md, docs/business-docs/**/*
   ```
   → List filenames — do NOT read contents yet

3. **Config Files (tech stack detection)**
   ```
   Glob: package.json, requirements.txt, go.mod, Cargo.toml,
         pom.xml, build.gradle, Gemfile, composer.json,
         docker-compose*, *.yaml, *.yml (root level only)
   ```
   → Identify language/framework from file existence and names

### Step 2: Minimal Tech Stack Detection

Detect tech stack from **config file names only** — no file reading needed:

| If Found | Tech Stack |
|----------|-----------|
| `package.json` | Node.js / JavaScript/TypeScript |
| `requirements.txt` or `pyproject.toml` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `pom.xml` or `build.gradle` | Java |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `docker-compose*` | Containerized deployment |

Only read `package.json` or equivalent if framework detection is needed (check `dependencies` keys for express/nestjs/django/fastapi etc). Read nothing else.

### Step 3: Generate Scan Output

Create `{workspace}/{workflow_id}/project-scan.md`:

```markdown
# Project Scan: {project_name}

Generated: {timestamp}
Workflow: {workflow_id}
Scan type: Surface (lightweight)

## Tech Stack
- Language: {lang}
- Framework: {framework} (if detectable from package file)
- Containerized: yes/no

## Project Shape
Top-level directories:
- {dir_name}/
- {dir_name}/
- ...

## Business Documentation ({count} files found)
- {filename}
- {filename}
- ...

(Contents not read — available for Phase 1 workflow detection)

## Notes
{any notable observations from directory names alone, e.g., "monorepo structure detected", "no src/ directory — flat layout"}
```

### Step 4: Validation

- [ ] Tech stack identified (language minimum)
- [ ] Directory layout captured
- [ ] Business docs listed (or noted as "none found")
- [ ] Scan output is under 2KB
- [ ] No source files were read

If no code-related config files found, note "Documentation-only project" and proceed.

## How Other Phases Use This

| Phase | What It Gets From Scan |
|-------|----------------------|
| **Phase 1, Step 1 (Requirements)** | Tech stack awareness — helps Analyst ask relevant business questions |
| **Phase 1, Step 3 (Workflow Detection)** | Business docs file list — ready to scan for relevance |
| **Phase 2 (Codebase Context)** | Knows where to look to discover business rules and edge cases from code |
| **Phase 2 (Stories)** | Business docs context — stories align with existing documented workflows |

## Token Efficiency

- Scan cost: ~500 tokens (glob results + minimal config read)
- Reuse value: eliminates redundant directory exploration across phases
- Deep scanning deferred to Phase 2 where it's scoped to the requirement
