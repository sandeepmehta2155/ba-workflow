BA Workflow - Phase 3: PO Review & Correction Loop (Step 6): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-init`.
2. Read workflow state from `{output_folder}/ba-workflow-state.json`. Phase 2 must be complete. If not, tell user to run `/ba-prd` first.
3. Verify `next_step_choice` from state is `1` (PO Review selected). If it was `2` or `3`, inform user: "PO Review was skipped in Phase 2. Run `/ba-stories` instead."
4. Read the PRD file from the path stored in state (`prd_file`).
5. Read the PO agent from the plugin's `agents/product-owner.md`. Adopt this persona for the review.

## Progress Tracking
```
BA Workflow | Phase 3: PO Review
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

4. **Save feedback** to: `{output_folder}/{story_title}_PO-review-feedback.md`

5. **Present feedback to user.**

### Correction Loop (if NEEDS REVISION)

6. **If NEEDS REVISION:**
   a. Present the required changes to the user
   b. Ask: "Would you like me to update the PRD based on this feedback? (y/n)"
   c. **If yes:**
      - Switch back to Analyst persona (read plugin's `agents/analyst.md`)
      - Update the PRD addressing each required change
      - Save updated PRD to the same file path
      - Switch back to PO persona
      - Re-review the updated PRD
      - Repeat until APPROVED or user says to stop
   d. **If no:** Ask user what they'd like to do:
      - Proceed to stories anyway (override PO)
      - Make manual edits and re-run `/ba-review`
      - Stop workflow

7. **If APPROVED:** Proceed.

---

## Phase 3 Complete

Update `{output_folder}/ba-workflow-state.json`:
```json
{
  "phase": 3,
  "status": "complete",
  "po_approval_status": "approved|needs-revision-overridden",
  "po_feedback_file": "{output_folder}/{story_title}_PO-review-feedback.md",
  "correction_iterations": X,
  "timestamp": "..."
}
```

Display:
```
Phase 3: PO Review - COMPLETE
  Step 6: PO Review           - [Approved | Approved after X revisions | Overridden]
  Feedback saved to: {po_feedback_file}

Next: Run /ba-stories for Story Creation (Phase 4)
  Or: Run /ba-workflow to continue automatically
```
