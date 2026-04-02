# Socratic Requirement Discovery

## Core Principle
Every explicit request hides implicit requirements. Surface them BEFORE creating stories, not after.

## When to Apply
- **Integrated**: Phase 1, Step 1c — automatically triggered within `/ba-workflow:go` and `/ba-workflow:analyze`
- **Standalone**: Via `/ba-workflow:brainstorm` command
- Layers on top of Analyst's 8 question categories from `agents/analyst.md`

## Discovery Flow

### Step 1: Parse Explicit Requirements
Read the requirement and extract every explicit ask:
```
Explicit: "Add reporting dashboard for admins"
Parsed:
  - A dashboard (UI component)
  - For reporting (data aggregation)
  - For admins (role-restricted)
```

### Step 2: Surface Implicit Requirements
For each explicit item, ask: "What does this ASSUME exists?"

```
"reporting dashboard" implies:
  → Data to report on (what data? from where? how fresh?)
  → Data aggregation logic (counts, averages, trends?)
  → Time ranges (daily, weekly, monthly, custom?)
  → Export capability (view-only or downloadable?)
  → Loading states (what if data takes 10 seconds?)

"for admins" implies:
  → Authentication (how do admins log in?)
  → Authorization (what separates admin from non-admin?)
  → Audit trail (should admin actions be logged?)
  → Multi-tenancy (one admin sees all or scoped data?)
```

### Step 3: Identify Unmade Decisions
List decisions the stakeholder hasn't explicitly made:

```
Decision Points (not yet decided):
  1. Real-time vs cached data? (affects architecture)
  2. Single dashboard or multiple views? (affects UI complexity)
  3. Can admins customize which metrics they see? (affects scope significantly)
  4. Should non-admins see a limited version? (affects access model)
```

### Step 4: Ask Targeted Questions
For each decision point, CALL the `AskUserQuestion` tool with concrete options and recommended defaults. Do NOT print questions as text — invoke the tool.

Example: For a "data freshness" decision, CALL `AskUserQuestion` with question "How fresh should the dashboard data be?", header "Freshness", multiSelect false, and options like "Near real-time (Recommended)" / "Real-time" / "Periodic" / "On-demand" — each with a description explaining the tradeoff.

**Rules for questions:**
- Maximum 4 questions per `AskUserQuestion` tool call (tool limit)
- Always INVOKE the `AskUserQuestion` tool — never print questions as text output
- Recommended option goes FIRST with "(Recommended)" in the label
- "Other" is auto-added by the tool — do NOT add it manually
- Questions must be NON-TECHNICAL (business decisions only)
- **ONE category at a time — then STOP and wait for the answer**
- **Adapt follow-up questions based on the answer received** — do not use a static script
- **User can say "skip" or "enough" to end discovery early** — respect this, minimum 3 categories answered

### Step 5: Document Discoveries
Compile into structured brainstorm output:

```markdown
## Brainstorm Output

### Clarified User Goals
- [Goal 1]
- [Goal 2]

### Functional Requirements
- [FR-1] ...
- [FR-2] ...

### Non-Functional Requirements
- [NFR-1] ...

### Acceptance Criteria (Draft)
1. **[Criterion 1]**
   - [Detail]
2. **[Criterion 2]**
   - [Detail]

### Decisions Made
| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | ... | ... | ... |

### Decisions Deferred
| # | Decision | Default Used | Revisit When |
|---|----------|-------------|-------------|
| 1 | ... | ... | ... |

### Open Questions
- [Question 1]
```

## Skill Contract

### Entry Conditions
- Requirement received and parsed (Step 1a complete)
- Project scan complete (`project-scan.md` exists) — when run as part of workflow
- Analyst agent persona loaded

### Exit Conditions
- Implicit requirements documented
- Decisions made or deferred with defaults
- Structured brainstorm output produced (goals, functional reqs, acceptance criteria at minimum)
- At least 3 question categories answered (or user override)

### Previous Skill: `project-scan` (Step 1b)
### Next Skill: `elicitation-methods` (Step 2, optional) OR `codebase-context` (Phase 2)

---

## Anti-Patterns to Avoid
- Asking "what else do you need?" (too open-ended — surface it yourself)
- Listing 10+ decision points (overwhelming — pick top 4)
- Technical decisions disguised as business questions ("should we use Redis or Postgres?")
- Accepting "I'll think about it" without setting a default
- Dumping all questions at once (overwhelming — one category at a time)