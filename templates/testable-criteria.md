## Enforcement in Story Template

Every story's Acceptance Criteria section MUST use this format:

```markdown
## Acceptance Criteria

1. **[Short description]**
   - [Condition or context]
   - [User/system action]
   - [Expected outcome — observable and verifiable]

2. **[Short description]**
   - [Condition or context]
   - [User/system action]
   - [Expected outcome]

3. **Edge case — [description]**
   - [Condition]
   - [Expected behavior]
```

## Quality Checks

| Check | Pass | Fail |
|-------|------|------|
| Every AC is a numbered point with bullet details | All ACs follow format | Any AC is prose-only paragraph or uses Given/When/Then |
| Outcome bullet is observable | QA can verify by looking/clicking/querying | "system handles it correctly" |
| Each AC is a single scenario | One trigger per AC | Multiple unrelated behaviors in one AC |
| Conditions are specific | Concrete values, thresholds, roles | "Given the system is working properly" (too vague) |
| Edge cases included | At least 1 negative/edge AC per story | Only happy path ACs |
