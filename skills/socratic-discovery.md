# Socratic Requirement Discovery

## Core Principle
Every explicit request hides implicit requirements. Surface them BEFORE creating stories, not after.

## When to Apply
- Phase 1, Step 1 — layer on top of Analyst's 8 question categories
- After user provides the initial requirement, BEFORE asking clarifying questions

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
For each decision point, present **concrete options with recommended defaults** (never open-ended):

```
Question 1 of 4: Data Freshness

How fresh should the dashboard data be?
  a) Real-time (updates every few seconds) — complex, higher cost
  b) Near real-time (updates every 5 minutes) — moderate complexity ← RECOMMENDED
  c) Periodic (updates hourly/daily) — simple, might feel stale
  d) On-demand (user clicks refresh) — simplest

Recommendation: (b) balances freshness with simplicity.
Your choice (a/b/c/d) or skip:
```

**Rules for questions:**
- Maximum 4 questions per discovery round
- Always provide options (never "what do you think?")
- Always mark a recommended default
- Accept "skip" — use the recommended default
- Questions must be NON-TECHNICAL (business decisions only)
- **ONE question or one tightly-related group at a time — then STOP and wait for the answer**
- **Adapt follow-up questions based on the answer received** — do not use a static script

### Step 5: Document Discoveries
Append to the requirement understanding:

```markdown
## Discovered Requirements (Socratic Discovery)

### Implicit Requirements Found
1. Data aggregation with time range filtering (implied by "reporting")
2. Role-based access control (implied by "for admins")
3. Export functionality (standard for dashboards)

### Decisions Made
| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Data freshness | Near real-time (5 min) | Balances UX and complexity |
| 2 | Dashboard scope | Single view, filterable | MVP approach |

### Decisions Deferred
| # | Decision | Default Used | Revisit When |
|---|----------|-------------|-------------|
| 3 | Admin customization | No customization (MVP) | After launch feedback |
| 4 | Non-admin view | No non-admin view (MVP) | Phase 2 planning |
```

## Skill Contract

### Entry Conditions
- Requirement received and parsed (Step 1a complete)
- Project scan complete (`project-scan.md` exists)
- Analyst agent persona loaded

### Exit Conditions
- Implicit requirements documented
- Decisions made or deferred with defaults
- Discovered requirements appended to requirement understanding
- At least 3 question categories answered (or user override)

### Previous Skill: `project-scan` (Step 1b)
### Next Skill: `elicitation-methods` (Step 2, optional) OR `codebase-context` (Phase 2)

---

## Anti-Patterns to Avoid
- Asking "what else do you need?" (too open-ended — surface it yourself)
- Listing 10+ decision points (overwhelming — pick top 4)
- Technical decisions disguised as business questions ("should we use Redis or Postgres?")
- Accepting "I'll think about it" without setting a default
