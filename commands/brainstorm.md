BA Workflow - Brainstorm: Socratic Requirements Discovery: $ARGUMENTS

## Overview
Standalone brainstorming command that uses Socratic dialogue to discover implicit requirements, surface unmade decisions, and produce structured requirements output. Can be run independently or is automatically triggered within `/ba-workflow:go` and `/ba-workflow:analyze`.

## Platform Compatibility
Works on all platforms. No subagent dispatch or MCP required.

## Clean Output for Business Analysts (CRITICAL)

1. **DO NOT narrate internal actions** — no "Let me read...", "Searching for...", "Good, found..."
2. **DO NOT announce tool usage** — file reads, searches happen silently
3. **ONLY show structured outputs** — banners, questions, and summaries as defined below
4. **First visible output** = the requirement question (or acknowledgment of $ARGUMENTS)

## Just-in-Time Loading

| Resource | Load When |
|----------|-----------|
| `skills/enforcement.md` | Immediately |
| `agents/analyst.md` | Step 1 (persona adoption) |
| `skills/socratic-discovery.md` | Step 2 (discovery flow) |

## Execution Flow

### Step 1: Get the Requirement

1. **If $ARGUMENTS is provided**, use it as the initial requirement. Otherwise ask using `AskUserQuestion`:
   - question: "What feature or requirement would you like to brainstorm?"
   - header: "Requirement"
   - options: not applicable — use free text via "Other"

2. <HARD-GATE>
   **STOP here and wait for the requirement before doing anything else.**
   </HARD-GATE>

### Step 2: Socratic Discovery

Adopt the **Mary (Business Analyst)** persona from `agents/analyst.md`. Read and follow the full discovery flow from `skills/socratic-discovery.md`:

1. **Parse Explicit Requirements** — Extract every explicit ask from the requirement
2. **Surface Implicit Requirements** — For each explicit item, ask: "What does this ASSUME exists?"
3. **Identify Unmade Decisions** — List decisions the stakeholder hasn't explicitly made
4. **Ask Targeted Questions** — Use `AskUserQuestion` with concrete options and recommended defaults
   - ONE category at a time, then STOP and wait
   - Adapt follow-up questions based on answers received
   - Maximum 8 question categories (from analyst.md), minimum 3
   - User can say "skip" or "enough" to end early
5. **Document Discoveries** — Compile all findings

### Step 3: Produce Structured Output

After discovery is complete (user answered enough categories OR said "enough"), compile the brainstorm output:

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

### Step 4: Confirm with User

Present the brainstorm output and CALL `AskUserQuestion`:
- question: "Brainstorm complete. How would you like to proceed?"
- header: "Brainstorm Complete"
- options:
  - "Looks good — proceed (Recommended)" — Accept output as-is
  - "I want to add or change something" — User provides edits, then re-confirm
  - "Run more discovery questions" — Go back to Step 2 for additional categories

## Output

The brainstorm output is stored in conversation context for use by subsequent workflow steps. When run standalone, it is displayed to the user.

When run as part of `/ba-workflow:go` or `/ba-workflow:analyze`, the output feeds directly into Step 2 (elicitation) and Phase 2 (story creation).

## Key Rules

1. **Non-technical only** — Follow Mary's guardrails from `agents/analyst.md`. Never ask technical questions.
2. **One category at a time** — Never dump all questions at once.
3. **Always use `AskUserQuestion`** — No text-based option lists.
4. **Adapt to answers** — Each answer may change subsequent questions.
5. **Minimum 3 categories** — Unless user explicitly says "enough" earlier.
6. **Multiple-choice always** — Every question has options with a recommended default.