# Parallel Story Generation

## Core Principle
For complexity Level 2+, group stories into waves by epic/feature area and generate them in parallel using subagents. Each wave completes before the next starts.

## When to Apply
- Phase 4 (ba-stories Step 7)
- Only when `story_complexity >= 2` (5+ stories expected)
- Offer as option: "Generate stories sequentially or in parallel waves?"

## Wave-Based Execution

### Step 1: Group PRD Requirements into Epics
```
Analyze PRD functional requirements and group by feature area:

Epic 1: User Authentication (FR001, FR002, FR003)
Epic 2: Dashboard & Reporting (FR004, FR005, FR006)
Epic 3: Admin Management (FR007, FR008)

Rules:
- Each epic = one wave of parallel work
- Max 5 stories per wave (context budget)
- Dependencies between epics determine wave order
```

### Step 2: Determine Wave Order
```
Wave 1: Epics with no dependencies (can start immediately)
  → Epic 1: User Authentication (no deps)
  → Epic 3: Admin Management (no deps)

Wave 2: Epics that depend on Wave 1
  → Epic 2: Dashboard (depends on Auth from Epic 1)
```

### Step 3: Execute Waves

**For each wave, dispatch parallel agents:**

Each agent receives:
1. The PRD (full document)
2. The story template
3. The system-context.md (if generated)
4. Their assigned epic/FR numbers
5. Shared context: decisions made, naming conventions

Each agent produces:
1. Story markdown files
2. Mini-receipt (stories created, ACs count, dependencies)

**Wave execution:**
```
Wave 1 (parallel):
  Agent A → Epic 1 stories (FR001-FR003) → 3 stories
  Agent B → Epic 3 stories (FR007-FR008) → 2 stories

  [Wait for Wave 1 to complete]
  [Merge results]
  [Cross-check for conflicts]

Wave 2 (parallel):
  Agent C → Epic 2 stories (FR004-FR006) → 4 stories
  (references Auth stories from Wave 1)

  [Wait for Wave 2 to complete]
  [Merge results]
  [Final cross-check]
```

### Step 4: Two-Stage Review Per Story

After each wave completes, review each story:

**Stage 1 — Spec Compliance:**
- Does this story map to its assigned FR numbers?
- Are all ACs from the PRD included?
- No scope creep (extra features not in PRD)?

**Stage 2 — Quality:**
- All ACs in Given/When/Then format?
- Dependencies on other stories documented?
- Tasks are actionable (not vague)?

### Step 5: Merge & Present

```
Parallel Generation Complete!

Wave 1 (2 agents, 5 stories):
  Epic 1 - User Auth: 3 stories ✓
  Epic 3 - Admin Mgmt: 2 stories ✓

Wave 2 (1 agent, 4 stories):
  Epic 2 - Dashboard: 4 stories ✓

Total: 9 stories across 3 epics

Cross-check: No conflicts found
Coverage: 100% of FRs mapped to stories

Options:
1. Review all stories
2. Approve all
3. Regenerate specific epic
```

## When NOT to Use Parallel
- Level 0-1 complexity (1-10 stories) — sequential is fine
- All requirements are tightly coupled (can't split into independent epics)
- User explicitly prefers sequential generation

## Fallback
If parallel generation fails or produces conflicts:
1. Report the conflict
2. Offer to regenerate conflicting stories sequentially
3. Never silently merge conflicting outputs
