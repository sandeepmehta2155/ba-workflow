# Verification-Before-Completion Checklist

## Core Principle
**Never claim a phase is complete without evidence.** Identify what proves the claim → check it → show the evidence → only then mark complete.

## When to Apply
- End of Phase 2 (PRD created) — verify PRD covers all requirements
- End of Phase 4 (stories created) — verify stories cover all PRD requirements
- Before Jira sync — verify stories are ready for dev

## Three Verification Levels

### Level 1: Clarity Check
> "Can a stakeholder read this and understand it?"

| Check | Evidence Required |
|-------|-------------------|
| No undefined acronyms or jargon | List all terms, confirm each is defined or commonly understood |
| No ambiguous pronouns ("it", "they", "the system") | Each pronoun resolves to a specific noun |
| Business rules explicitly stated, not implied | Each rule has its own line item |
| No passive voice hiding responsibility | "The report is generated" → WHO generates it? |

### Level 2: Completeness Check
> "Does every discovered requirement have a home?"

| Check | Evidence Required |
|-------|-------------------|
| Every requirement from Phase 1 maps to a PRD section | Show mapping table: Requirement → PRD Section |
| Every acceptance criterion is testable (Given/When/Then) | Show GWT format for each AC |
| All decision points from discovery are documented | List decisions made vs deferred |
| Edge cases from elicitation are addressed | List edge cases → where they appear in PRD/stories |
| Out-of-scope items explicitly listed | Show out-of-scope section |

### Level 3: Technical Alignment Check
> "Will development teams be able to execute from this?"

| Check | Evidence Required |
|-------|-------------------|
| Stories align with existing code patterns | Reference system-context.md if available |
| Acceptance criteria match system architecture | No impossible requirements |
| Dependencies between stories are documented | Show dependency graph |
| No conflicting requirements across stories | Cross-reference check results |

## Execution Flow

```
1. Identify which verification level applies:
   - PRD completion: Level 1 + Level 2
   - Story completion: Level 1 + Level 2 + Level 3
   - Jira sync: Level 2 (quick re-check)

2. Run each check:
   - State the check
   - Show the evidence (mapping, list, reference)
   - Mark: PASS / FAIL / PARTIAL

3. Present verification report:

   Verification Report: Phase X Completion
   ========================================
   Level 1 - Clarity:      X/4 checks passed
   Level 2 - Completeness: X/5 checks passed
   Level 3 - Alignment:    X/4 checks passed (if applicable)

   FAILED Checks:
   - [Check name]: [What's missing] → [Suggested fix]

   Verdict: [VERIFIED | BLOCKED - X issues to resolve]

4. If BLOCKED:
   - Fix issues before proceeding
   - Re-run failed checks only
   - Loop until VERIFIED

5. Save verification to state.json:
   { "verification": { "level": [1,2,3], "passed": true, "failures": [], "timestamp": "..." } }
```

## Requirement-to-PRD Mapping Template

```markdown
| # | Requirement (from Phase 1) | PRD Section | Status |
|---|---------------------------|-------------|--------|
| 1 | Users need role-based access | FR003 - Permissions | Covered |
| 2 | Export to CSV and PDF | FR007 - Export | Covered |
| 3 | Mobile responsive | NFR002 - Responsiveness | Covered |
| 4 | Audit logging | — | MISSING |
```
