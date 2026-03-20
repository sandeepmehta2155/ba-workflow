# Two-Stage Story Review

## Core Principle
Separate **"does it match what was asked?"** from **"is it well-written?"** — two different failure modes.

## When to Apply
- Phase 2, Step 6 (PO Review) — structures how John reviews each story

## Stage 1: Specification Compliance
> "Does the story capture EXACTLY what was discovered — no more, no less?"

### Checklist

| # | Check | How to Verify | Severity if Failed |
|---|-------|---------------|-------------------|
| 1 | Story requirements trace back to Phase 1 discoveries | Cross-reference story ACs → Phase 1 requirement data | CRITICAL |
| 2 | No requirements were added that weren't discovered | Check each AC has a source in Phase 1 | IMPORTANT |
| 3 | Scope matches — story not over-scoped | Compare story scope vs relevant requirement boundaries | CRITICAL |
| 4 | Scope matches — story not under-scoped | Check no relevant discovered requirements were dropped | CRITICAL |
| 5 | Workflow dependencies match detected workflows | Cross-ref story dependencies vs Step 3 selections | IMPORTANT |

### Output Format
```
Stage 1: Specification Compliance — Story: {title}
=========================================================
[PASS] All requirements traced to Phase 1 discoveries
[FAIL] CRITICAL: Requirement about audit logging not found in story ACs
[FAIL] IMPORTANT: Story includes "push notifications" — not in discovered requirements
[PASS] Scope boundaries match
[PASS] Dependencies match

Result: 3/5 passed — CRITICAL issues found, must fix before Stage 2
```

**Rule:** If ANY critical issue in Stage 1, fix before running Stage 2.

## Stage 2: Quality Review
> "Is the story clear, testable, and unambiguous?"

### Checklist

| # | Check | How to Verify | Severity if Failed |
|---|-------|---------------|-------------------|
| 1 | All acceptance criteria use Given/When/Then format | Check each AC | CRITICAL |
| 2 | Business rules are explicit, not implied | Each rule has its own numbered item | IMPORTANT |
| 3 | Edge cases are documented | At least 1-2 edge cases per story | IMPORTANT |
| 4 | User roles and permissions are specific | Named roles with listed capabilities | IMPORTANT |
| 5 | No conflicting acceptance criteria | Cross-check ACs for contradictions | CRITICAL |
| 6 | As/Want/So is specific and user-focused | Clear user role, action, and value | IMPORTANT |
| 7 | Tasks are actionable and appropriately scoped | Each task is a clear unit of work | MINOR |

### Output Format
```
Stage 2: Quality Review — Story: {title}
==========================================
[PASS] 8/8 acceptance criteria use Given/When/Then
[FAIL] CRITICAL: AC #3 and AC #5 contradict (different default behaviors)
[FAIL] IMPORTANT: No edge cases documented for offline scenarios
[PASS] User roles specific with capabilities listed
[PASS] As/Want/So is clear and user-focused

Result: 5/7 passed — 1 CRITICAL, 1 IMPORTANT
```

## Severity Definitions

| Severity | Meaning | Action |
|----------|---------|--------|
| **CRITICAL** | Missing/wrong requirement, contradictions, untestable criteria | **Must fix before approval** |
| **IMPORTANT** | Ambiguous rules, missing edge cases, unclear scope | **Should fix, can approve with plan to address** |
| **MINOR** | Formatting, task granularity, optional improvements | **Note for future, don't block approval** |

## Combined Review Output

```markdown
## PO Review — Story: {story_title}

### Stage 1: Specification Compliance
Result: [X/5 passed]
Critical Issues: [list]
Important Issues: [list]

### Stage 2: Quality Review
Result: [X/7 passed]
Critical Issues: [list]
Important Issues: [list]
Minor Issues: [list]

### Overall Verdict
[APPROVED | APPROVED WITH CONDITIONS | NEEDS REVISION]

### Required Changes (ordered by severity)
1. [CRITICAL] [description] — must fix
2. [IMPORTANT] [description] — should fix
```

## Flow Control Rules

<HARD-GATE>
These rules govern the review flow. They are not suggestions.

1. **Stage 1 CRITICAL found** → BLOCK Stage 2. Return story to Analyst for fixes. Do NOT run quality review on a story that doesn't match the spec.
2. **Stage 2 CRITICAL found** → BLOCK approval. Return story to Analyst. Repeat review after fixes.
3. **IMPORTANT issue found** → Flag for user decision. Default action: fix. User may override with acknowledgment.
4. **MINOR issue found** → Note in review output. Do NOT block approval.
5. **Approval requires:** Zero CRITICAL issues across BOTH stages AND zero unresolved IMPORTANT issues (unless user explicitly overrides).
6. **Review order is mandatory:** Stage 1 first, Stage 2 second. NEVER run them in parallel or reverse order.
7. **Re-review after fixes:** When Analyst updates a story, run BOTH stages again from scratch — do not assume Stage 1 still passes after changes.
</HARD-GATE>

## Skill Contract

### Entry Conditions
- Stories generated and saved to `{workspace}/{workflow_id}/stories/`
- `testable-criteria` skill applied (all ACs are Given/When/Then)
- Phase 1 `state.json` available (for spec compliance cross-reference)
- PO agent persona loaded (or fresh PO subagent dispatched)

### Exit Conditions
- Every story has a review result: APPROVED, NEEDS REVISION, or overridden
- Zero stories remain in "drafted" status
- All CRITICAL issues resolved (or user explicitly overrode)
- Review feedback saved alongside each story

### Previous Skill: `testable-criteria` (ensures ACs are reviewable)
### Next Skill: none (final quality gate before Jira sync)

---

## Integration with PO Agent (John)
When the PO agent reviews each story:
1. Read this skill first
2. Run Stage 1 completely before Stage 2
3. Use the severity levels in feedback
4. Structure feedback using the Combined Review Output format
5. Only mark APPROVED if zero CRITICAL issues across both stages
