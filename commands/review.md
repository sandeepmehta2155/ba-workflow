BA Workflow - PO Story Review (Step 6): $ARGUMENTS

## Prerequisites
1. Read config from `docs/ba-workflow-config.json`. If missing, tell user to run `/ba-workflow:init`.
2. **Find the active workflow:** Scan `{workspace}/` for folders. If multiple exist, ask user which to continue. Read `{workspace}/{workflow_id}/state.json`.
3. Verify stories exist in `{workspace}/{workflow_id}/stories/`. If no stories found, inform user: "No stories found. Run `/ba-workflow:stories` first."
4. Read the PO agent from `the plugin's `agents/`product-owner.md`. Adopt this persona for the review.

All outputs go to `{workspace}/{workflow_id}/`.

## Skills Injected (read these before starting)
- **`skills/two-stage-review.md`** — Structures the PO review. Stage 1: Spec Compliance (story matches requirements?). Stage 2: Quality (testable ACs, unambiguous rules, edge cases). Use severity levels: CRITICAL/IMPORTANT/MINOR.

## Progress Tracking
```
BA Workflow | {workflow_id} | PO Story Review
Reviewing story X of Y
```

---

## Step 6: PO Review (per story)

### Conduct Review
1. **Switch to PO persona** (John — Product Owner).

2. **For each story file** in `{workspace}/{workflow_id}/stories/`, review by evaluating:
   - **Completeness**: All relevant requirements addressed? Acceptance criteria cover the scope?
   - **Clarity**: Requirements unambiguous? ACs verifiable with Given/When/Then?
   - **Business Alignment**: Aligns with business goals? User value clear?
   - **Gaps**: Missing edge cases, user roles, or acceptance criteria?
   - **Dependencies**: Workflow dependencies identified? Impact analysis present?
   - **Testability**: Can every AC be objectively tested?

3. **Generate review feedback for each story:**
   ```markdown
   ## PO Review — Story: {story_title}

   ### Approval Status: [APPROVED / NEEDS REVISION]

   ### Strengths
   - [What's well done]

   ### Required Changes (if NEEDS REVISION)
   1. [Specific change needed] - Severity: CRITICAL/IMPORTANT/MINOR

   ### Suggestions (optional improvements)
   1. [Suggestion]

   ### Questions for Clarification
   1. [Question]
   ```

4. **Present feedback for each story to user.**

### Correction Loop (per story)

5. **If NEEDS REVISION:**
   a. Present the required changes to the user
   b. Ask: "Would you like me to update this story based on the feedback? (y/n)"
   c. **If yes:**
      - Switch back to Analyst persona
      - Update the story addressing each required change
      - Save updated story to the same file
      - Switch back to PO persona
      - Re-review the updated story
      - Repeat until APPROVED or user says to stop
   d. **If no:** Ask user what they'd like to do:
      - Approve anyway (override PO)
      - Make manual edits and re-run `/ba-workflow:review`
      - Skip this story

6. **If APPROVED:** Move to next story.

### Review Complete

7. **After all stories reviewed**, display summary:
   ```
   PO Review Summary:
     Approved: X stories
     Approved after revision: X stories
     Overridden: X stories
     Skipped: X stories
   ```

Update `{workspace}/{workflow_id}/state.json`:
```json
{
  "po_review_complete": true,
  "po_review_summary": {
    "approved": X,
    "revised": X,
    "overridden": X,
    "skipped": X
  },
  "timestamp": "..."
}
```

Display:
```
PO Story Review - COMPLETE
  Workflow: {workflow_id}
  Stories reviewed: X
  Approved: X | Revised: X | Overridden: X | Skipped: X

Next: Run /ba-workflow:stories to sync to Jira (Step 7)
  Or: Run /ba-workflow:go to continue automatically
```
