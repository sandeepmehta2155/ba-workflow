# BA Workflow Skill Chain

## Overview
Skills execute in a defined order. Each skill has entry/exit conditions (see individual skill files). A skill cannot start until its predecessor's exit conditions are met.

## Full Workflow (`/ba-workflow:go`)

```
enforcement (always active)
    │
    ├── Phase 1: Requirements Analysis
    │   │
    │   ├─ project-scan          Step 1b — surface discovery, tech stack, business docs
    │   │   Exit: project-scan.md saved
    │   │
    │   ├─ socratic-discovery    Step 1c — implicit requirements, unmade decisions
    │   │   Exit: ≥3 categories answered, discoveries documented
    │   │
    │   └─ [elicitation-methods] Step 2  — optional, 50 methods, user selects
    │       Exit: insights applied OR user skipped
    │
    │   ── HARD-GATE: Phase 1→2 validation ──
    │
    ├── Phase 2: Story Creation & Review
    │   │
    │   ├─ codebase-context      Before Step 5 — business rules from code
    │   │   Exit: system-context.md saved
    │   │
    │   ├─ testable-criteria     During Step 5 — Given/When/Then enforcement
    │   │   Exit: zero vague ACs, all stories formatted
    │   │
    │   ├─ [subagent-coordination] Step 5-6 — if complexity 2+ or 4+ stories
    │   │   Exit: stories generated/reconciled, reviews collected
    │   │
    │   └─ two-stage-review      Step 6 — spec compliance + quality
    │       Exit: all stories APPROVED/overridden/skipped
    │
    │   ── HARD-GATE: Phase 2→3 validation ──
    │
    └── Phase 3: Jira Sync
        Exit: issues created OR sync skipped
```

## Analyze Only (`/ba-workflow:analyze`)

```
enforcement → project-scan → socratic-discovery → [elicitation-methods]
```

## Stories Only (`/ba-workflow:stories`)

```
enforcement → codebase-context → testable-criteria → [subagent-coordination] → two-stage-review
```

## Review Only (`/ba-workflow:review`)

```
enforcement → two-stage-review
```

## Notation
- `skill-name` = required skill
- `[skill-name]` = conditional (loaded only when needed)
- `──HARD-GATE──` = mandatory validation checkpoint between phases

## Chaining Rules

1. **Sequential within a phase** — skills within a phase execute in order. Never skip ahead.
2. **Entry conditions are mandatory** — if a skill's entry conditions aren't met, STOP and resolve.
3. **Exit conditions gate the next skill** — the next skill cannot start until the current skill's exit conditions are all true.
4. **Enforcement is always active** — the enforcement skill runs continuously, not as a step.
5. **Conditional skills are offered, not skipped silently** — present the option to the user, let them decide.
6. **Re-entry after fixes** — when a correction loop occurs (PO rejects story), re-run `two-stage-review` from scratch, not just the failed stage.
