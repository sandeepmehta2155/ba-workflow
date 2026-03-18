# Two-Stage PRD Review

## Core Principle
Separate **"does it match what was asked?"** from **"is it well-written?"** — two different failure modes.

## When to Apply
- Phase 3 (PO Review) — structures how John reviews the PRD
- Also usable for story review before Jira sync

## Stage 1: Specification Compliance
> "Does the PRD do EXACTLY what was discovered — no more, no less?"

### Checklist

| # | Check | How to Verify | Severity if Failed |
|---|-------|---------------|-------------------|
| 1 | Every Phase 1 requirement is in the PRD | Cross-reference requirement list → PRD sections | CRITICAL |
| 2 | No requirements were added that weren't discovered | Check each PRD item has a source in Phase 1 | IMPORTANT |
| 3 | Scope matches — not over-scoped | Compare PRD scope vs discovery scope boundaries | CRITICAL |
| 4 | Scope matches — not under-scoped | Check no discovered requirements were dropped | CRITICAL |
| 5 | Deferred items are in Out-of-Scope, not silently removed | Verify deferred decisions appear in section 8 | IMPORTANT |
| 6 | Workflow dependencies match detected workflows | Cross-ref PRD section 6 vs Step 3 selections | IMPORTANT |

### Output Format
```
Stage 1: Specification Compliance
=================================
[PASS] All 12 requirements mapped to PRD sections
[FAIL] CRITICAL: Requirement #4 (audit logging) not found in PRD
[FAIL] IMPORTANT: PRD includes "push notifications" — not in discovered requirements
[PASS] Scope boundaries match
[PASS] Deferred items documented

Result: 4/6 passed — CRITICAL issues found, must fix before Stage 2
```

**Rule:** If ANY critical issue in Stage 1, fix before running Stage 2.

## Stage 2: Quality Review
> "Is the PRD clear, testable, and unambiguous?"

### Checklist

| # | Check | How to Verify | Severity if Failed |
|---|-------|---------------|-------------------|
| 1 | Acceptance criteria are testable (Given/When/Then possible) | Try converting each AC to GWT | CRITICAL |
| 2 | Business rules are explicit, not implied | Each rule has its own numbered item | IMPORTANT |
| 3 | Edge cases are documented | At least 3 edge cases per major feature | IMPORTANT |
| 4 | User roles and permissions are specific | Named roles with listed capabilities | IMPORTANT |
| 5 | Success criteria are measurable | Numbers, percentages, or boolean conditions | MINOR |
| 6 | No conflicting requirements | Cross-check FRs for contradictions | CRITICAL |
| 7 | Dependencies are actionable | Each dependency has a clear owner/source | MINOR |
| 8 | Priority is assigned (Must/Should/Could/Won't) | Every FR has a priority | IMPORTANT |

### Output Format
```
Stage 2: Quality Review
========================
[PASS] 10/12 acceptance criteria are testable
[FAIL] CRITICAL: FR005 and FR009 contradict (both claim different default sort order)
[FAIL] IMPORTANT: No edge cases documented for offline scenarios
[PASS] User roles specific with capabilities listed
[FAIL] MINOR: Success criteria use "improved" instead of measurable targets

Result: 5/8 passed — 1 CRITICAL, 1 IMPORTANT, 1 MINOR
```

## Severity Definitions

| Severity | Meaning | Action |
|----------|---------|--------|
| **CRITICAL** | Missing/wrong requirement, contradictions, untestable criteria | **Must fix before approval** |
| **IMPORTANT** | Ambiguous rules, missing edge cases, unclear priorities | **Should fix, can approve with plan to address** |
| **MINOR** | Formatting, measurability, optional improvements | **Note for future, don't block approval** |

## Combined Review Output

```markdown
## PO Review — Two-Stage Assessment

### Stage 1: Specification Compliance
Result: [X/6 passed]
Critical Issues: [list]
Important Issues: [list]

### Stage 2: Quality Review
Result: [X/8 passed]
Critical Issues: [list]
Important Issues: [list]
Minor Issues: [list]

### Overall Verdict
[APPROVED | APPROVED WITH CONDITIONS | NEEDS REVISION]

### Required Changes (ordered by severity)
1. [CRITICAL] [description] — must fix
2. [IMPORTANT] [description] — should fix

### Approval Conditions (if APPROVED WITH CONDITIONS)
- [condition that must be met before story creation]
```

## Integration with PO Agent (John)
When the PO agent reviews the PRD:
1. Read this skill first
2. Run Stage 1 completely before Stage 2
3. Use the severity levels in feedback
4. Structure feedback using the Combined Review Output format
5. Only mark APPROVED if zero CRITICAL issues across both stages
