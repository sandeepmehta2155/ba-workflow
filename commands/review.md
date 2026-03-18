BA Workflow - Phase 3: PO Review & Correction Loop (Step 6): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-workflow:init`.
2. **Find the active workflow:** Scan `{workspace}/` for folders. If multiple exist, ask user which to continue. Read `{workspace}/{workflow_id}/state.json`. Phase 2 must be complete.
3. Verify `next_step_choice` from state is `1` (PO Review selected). If it was `2` or `3`, inform user: "PO Review was skipped in Phase 2. Run `/ba-workflow:stories` instead."
4. Read the PRD file from the path stored in state (`prd_file`).
5. Read the PO agent from `the plugin's `agents/`product-owner.md`. Adopt this persona for the review.

All outputs go to `{workspace}/{workflow_id}/`.

## Skills Injected (read these before starting)
- **`skills/two-stage-review.md`** — Structures the PO review. Stage 1: Spec Compliance (PRD matches all requirements?). Stage 2: Quality (testable ACs, unambiguous rules, edge cases). Use severity levels: CRITICAL/IMPORTANT/MINOR.
- **`skills/feedback-protocol.md`** — Apply during correction loop. VERIFY feedback → ASSESS impact → RESPOND with evidence → IMPLEMENT one change at a time. Push back if feedback breaks other requirements or expands scope.
- **`skills/confidence-scoring.md`** — Apply at Phase 3 completion. Self-rate confidence. LOW → halt.
- **`skills/receipts.md`** — Generate Phase 3 receipt at completion.

## Progress Tracking
```
BA Workflow | {workflow_id} | Phase 3: PO Review
Correction Loop: Iteration X
```

---

## Step 6: PO Review

### Conduct Review
1. **Switch to PO persona** (John — Product Owner).

2. **Review the PRD** by evaluating:
   - **Completeness**: All functional/non-functional requirements present?
   - **Clarity**: Requirements unambiguous? Acceptance criteria verifiable?
   - **Business Alignment**: Aligns with goals? User value clear?
   - **Gaps**: Missing requirements, edge cases, user roles?
   - **Dependencies & Impact**: Workflow dependencies identified? Impact analysis thorough?
   - **Priority**: Requirements prioritized? Sequencing logical?

3. **Generate review feedback** following the PO persona's output format:
   ```markdown
   ## PO Review Feedback

   ### Approval Status: [APPROVED / NEEDS REVISION]

   ### Strengths
   - [What's well done]

   ### Required Changes (if NEEDS REVISION)
   1. [Specific change] - Priority: HIGH/MEDIUM/LOW

   ### Suggestions (optional improvements)
   1. [Suggestion]

   ### Questions for Clarification
   1. [Question]
   ```

4. **Save feedback** to: `{workspace}/{workflow_id}/{story_title}_PO-review-feedback.md`

5. **Present feedback to user.**

### Correction Loop (if NEEDS REVISION)

6. **If NEEDS REVISION:**
   a. Present the required changes to the user
   b. Ask: "Would you like me to update the PRD based on this feedback? (y/n)"
   c. **If yes:**
      - Switch back to Analyst persona
      - Update the PRD addressing each required change
      - Save updated PRD to the same file path
      - Switch back to PO persona
      - Re-review the updated PRD
      - Repeat until APPROVED or user says to stop
   d. **If no:** Ask user what they'd like to do:
      - Proceed to stories anyway (override PO)
      - Make manual edits and re-run `/ba-workflow:review`
      - Stop workflow

7. **If APPROVED:** Proceed.

---

## Phase 3 Complete

Update `{workspace}/{workflow_id}/state.json`:
```json
{
  "phase": 3,
  "status": "phase_3_complete",
  "po_approval_status": "approved|needs-revision-overridden",
  "po_feedback_file": "...",
  "correction_iterations": X,
  "timestamp": "..."
}
```

Display:
```
Phase 3: PO Review - COMPLETE
  Workflow: {workflow_id}
  Step 6: PO Review  - [Approved | Approved after X revisions | Overridden]

Next: Run /ba-workflow:stories for Story Creation (Phase 4)
  Or: Run /ba-workflow:go to continue automatically
```
