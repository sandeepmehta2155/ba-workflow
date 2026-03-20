# Workflow Enforcement & Anti-Circumvention

## Core Principle
Every step exists because skipping it causes downstream failure. Requirements missed in Phase 1 become stories that fail PO review. Stories that skip PO review create Jira tickets that get rejected by the team.

## MANDATORY: Use `AskUserQuestion` for ALL User Interactions

<HARD-GATE>
**EVERY user-facing choice, question, or decision point MUST use the `AskUserQuestion` tool.** This gives users interactive arrow-key selection instead of typing text responses.

NEVER present plain text menus like:
```
1. Option A
2. Option B
Enter choice (1 or 2):
```

ALWAYS use:
```
AskUserQuestion({
  questions: [{
    question: "Your question here?",
    header: "Short Label",
    multiSelect: false,
    options: [
      { label: "Option A (Recommended)", description: "What this does" },
      { label: "Option B", description: "What this does" }
    ]
  }]
})
```

Rules:
- Recommended option goes FIRST with "(Recommended)" in the label
- Max 4 questions per call, 2-4 options per question
- "Other" is auto-added — user can always type custom input
- Use `multiSelect: true` when choices aren't mutually exclusive
- NEVER ask open-ended text questions — always provide concrete options
</HARD-GATE>

## Anti-Circumvention: Red Flags Table

If you catch yourself thinking any of these, STOP — you are rationalizing skipping a step:

| Agent Thought | Reality |
|---------------|---------|
| "The requirement is clear enough, skip clarifying questions" | Implicit requirements cause 60% of story rework. Socratic discovery exists for a reason. Ask anyway. |
| "I can generate stories without scanning code" | Stories without code context miss existing business rules, validation logic, and edge cases. Run codebase-context. |
| "This story is obviously fine, skip PO review" | Every story gets two-stage review. The Analyst wrote it — a different perspective must review it. No exceptions. |
| "Let me batch all questions at once to save time" | One category at a time. User overwhelm = poor answers = poor stories. Speed now = rework later. |
| "The user seems impatient, skip elicitation methods" | Always OFFER elicitation. The user decides to skip, not you. Present the menu. |
| "This is a small change, one story is enough" | Run complexity analysis. Let the data decide the count. Your intuition about scope is unreliable. |
| "I already know what they need from context" | You don't. You know what the CODE does, not what the BUSINESS needs. Ask the questions. |
| "PO review is just a formality here" | Two-stage review catches specification drift and quality issues even in "obvious" stories. Run both stages. |
| "I'll fix the story format later" | Given/When/Then enforcement happens during generation, not after. Vague ACs now = vague ACs forever. |
| "Let me push to Jira first, we can fix later" | ALWAYS ask before Jira sync. Once in Jira, stories are visible to the entire team. Get it right first. |
| "I'll just use a plain text menu here" | ALWAYS use `AskUserQuestion`. Users get arrow-key selection, not typing. No exceptions. |

## Enforcement Severity Levels

| Level | Meaning | Examples |
|-------|---------|---------|
| **HARD-GATE** | Execution MUST stop. Cannot proceed until condition is met. | Requirement not received, Phase 1 incomplete, PO review not done |
| **MUST** | Required action. Skipping invalidates the output. | Given/When/Then format, two-stage review, state.json save |
| **ALWAYS ASK** | User decides, not the agent. Present the option. | Jira sync, elicitation methods, workflow selection |
| **WARN** | Flag the risk but allow override with user acknowledgment. | Missing edge cases, fewer than 3 categories answered |

## State Validation Gates

Before each phase transition, validate the state:

### Phase 1 → Phase 2 Gate
```
CHECK: state.json exists
CHECK: status === "phase_1_complete"
CHECK: requirement is non-empty
CHECK: categories_completed >= 3 OR user explicitly said "proceed"
WARN:  elicitation_executed === false (acceptable if user chose to skip)
```

### Phase 2 → Phase 3 (Jira) Gate
```
CHECK: All stories have PO review status (APPROVED, overridden, or skipped)
CHECK: Zero stories in "drafted" status remain
CHECK: At least 1 story is APPROVED
WARN:  Any stories were overridden (user chose to bypass PO)
```

## Skill Contract

### Entry Conditions
- Command execution starting (any command)

### Exit Conditions
- This skill is never "complete" — it applies continuously throughout execution

### Previous Skill: none (loaded first, always)
### Next Skill: all other skills (enforcement applies to every step)

## How to Reference This Skill
Load this skill at the START of any command execution (`go.md`, `analyze.md`, `stories.md`). It applies to all steps.
