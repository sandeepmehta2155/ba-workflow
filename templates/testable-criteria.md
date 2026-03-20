## Enforcement in Story Template

Every story's Acceptance Criteria section MUST use this format:

```markdown
## Acceptance Criteria

### AC1: [Short description]
**Given** [precondition]
**When** [action]
**Then** [expected outcome]

### AC2: [Short description]
**Given** [precondition]
**When** [action]
**Then** [expected outcome]

### AC3: Edge case — [description]
**Given** [edge condition]
**When** [action]
**Then** [expected behavior]
```

## Quality Checks

| Check | Pass | Fail |
|-------|------|------|
| Every AC has Given/When/Then | All ACs follow format | Any AC is prose-only paragraph |
| "Then" is observable | QA can verify by looking/clicking/querying | "system handles it correctly" |
| "When" is a single action | One trigger per AC | "When user does X and Y and Z" (split into multiple ACs) |
| "Given" is achievable | Precondition can be set up in test | "Given the system is working properly" (too vague) |
| Edge cases included | At least 1 negative/edge AC per story | Only happy path ACs |
