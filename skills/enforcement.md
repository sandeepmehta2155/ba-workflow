# Workflow Enforcement & Anti-Circumvention

## Core Principle
Every step exists because skipping it causes downstream failure. Requirements missed in Phase 1 become stories that fail PO review. Stories that skip PO review create Jira tickets that get rejected by the team.

## MANDATORY: CALL the `AskUserQuestion` Tool for ALL User Interactions

<HARD-GATE>
**EVERY user-facing choice, question, or decision point MUST invoke the `AskUserQuestion` tool — the actual tool call, NOT printing text to the screen.**

This is a TOOL CALL like Read, Write, Bash, or Edit. You must invoke it the same way you invoke any other tool. It renders an interactive selection UI where the user navigates with arrow keys and presses Enter — they do NOT type text.

### What you MUST NOT do:
- Do NOT print numbered lists and ask the user to type a number
- Do NOT print lettered options (a/b/c/d) and ask the user to type a letter
- Do NOT write questions as plain text output and wait for typed responses
- Do NOT show "Enter choice:", "Type your answer:", or any text input prompt
- Do NOT display the AskUserQuestion parameters as text — CALL THE TOOL

### What you MUST do:
- INVOKE the `AskUserQuestion` tool (the same way you invoke Read or Bash)
- Pass `questions` array with `question`, `header`, `multiSelect`, and `options` fields
- Put the recommended option FIRST with "(Recommended)" appended to its label
- Each question needs 2-4 options with `label` and `description` fields
- The tool auto-adds an "Other" option — do NOT add one manually

### Anti-pattern detection:
If your response contains ANY of these patterns, you are VIOLATING this rule:
- "1.", "2.", "3." followed by options in your text output
- "Enter choice", "Type", "Select", "Choose" in your text output
- "a)", "b)", "c)" option listings in your text output
- Any question mark at the end of your text output that expects typed input

The ONLY way to ask the user a question is by CALLING the `AskUserQuestion` tool.
</HARD-GATE>

## Anti-Circumvention: Red Flags Table

If you catch yourself thinking any of these, STOP — you are rationalizing skipping a step:

| Agent Thought | Reality |
|---------------|---------|
| "The requirement is clear enough, skip brainstorm" | Implicit requirements cause 60% of story rework. The user must run `/sc:brainstorm` first — do not shortcut it or substitute with inline questions. |
| "This story is obviously fine, skip PO review" | Every story gets two-stage review. The Analyst wrote it — a different perspective must review it. No exceptions. PO Review is MANDATORY. |
| "Let me ask clarifying questions instead of requiring brainstorm output" | The workflow requires `/sc:brainstorm` output. Do not substitute with inline questioning. If no brainstorm output exists, stop and tell the user to run it. |
| "The user seems impatient, skip elicitation methods" | Always OFFER elicitation. The user decides to skip, not you. Present the menu. |
| "This is a small change, one story is enough" | Run complexity analysis. Let the data decide the count. Your intuition about scope is unreliable. |
| "I already know what they need from context" | You don't. You know what the CODE does, not what the BUSINESS needs. Ask the questions. |
| "PO review is just a formality here" | Two-stage review catches specification drift and quality issues even in "obvious" stories. Run both stages. |
| "I'll fix the story format later" | Point-by-point AC enforcement happens during generation, not after. Vague ACs now = vague ACs forever. |
| "Let me push to Jira first, we can fix later" | ALWAYS ask before Jira sync. Once in Jira, stories are visible to the entire team. Get it right first. |
| "I'll just use a plain text menu here" | ALWAYS use `AskUserQuestion`. Users get arrow-key selection, not typing. No exceptions. |

## Enforcement Severity Levels

| Level | Meaning | Examples |
|-------|---------|---------|
| **HARD-GATE** | Execution MUST stop. Cannot proceed until condition is met. | Requirement not received, Phase 1 incomplete, PO review not done |
| **MUST** | Required action. Skipping invalidates the output. | Point-by-point AC format, two-stage review, state.json save |
| **ALWAYS ASK** | User decides, not the agent. Present the option. | Jira sync, elicitation methods, workflow selection |
| **WARN** | Flag the risk but allow override with user acknowledgment. | Missing edge cases, incomplete brainstorm output |

## State Validation Gates

Before each phase transition, validate the state:

### Phase 1 → Phase 2 Gate
```
CHECK: state.json exists
CHECK: status === "phase_1_complete"
CHECK: requirement is non-empty
CHECK: brainstorm_output has goals, functional_reqs, and acceptance_criteria OR user explicitly said "proceed"
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
