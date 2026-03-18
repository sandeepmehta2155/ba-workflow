# Receipt-Based Proof of Work

## Core Principle
Every phase completion produces a machine-verifiable JSON receipt. Receipts create an audit trail from business need → PRD → stories → Jira.

## When to Apply
- End of every phase (1, 2, 3, 4)
- Saved to `{workspace}/{workflow_id}/receipts/`

## Receipt Format

### Phase 1 Receipt: Requirements Analysis
```json
{
  "receipt_id": "phase-1-{workflow_id}-{timestamp}",
  "phase": 1,
  "phase_name": "Requirements Analysis",
  "workflow_id": "{workflow_id}",
  "timestamp": "ISO-8601",
  "confidence": { "level": "HIGH", "score": 85 },
  "inputs": {
    "requirement_provided": true,
    "requirement_format": "text|jira",
    "requirement_length": 150
  },
  "outputs": {
    "categories_answered": 6,
    "categories_skipped": 2,
    "elicitation_executed": true,
    "elicitation_methods_used": ["5 Whys", "Pre-mortem"],
    "workflows_detected": 3,
    "workflows_selected": 2,
    "implicit_requirements_found": 5,
    "decisions_made": 3,
    "decisions_deferred": 2
  },
  "artifacts": [
    "state.json"
  ],
  "quality_score": null
}
```

### Phase 2 Receipt: PRD Creation
```json
{
  "receipt_id": "phase-2-{workflow_id}-{timestamp}",
  "phase": 2,
  "phase_name": "PRD Creation",
  "workflow_id": "{workflow_id}",
  "timestamp": "ISO-8601",
  "confidence": { "level": "MEDIUM", "score": 72 },
  "inputs": {
    "complexity_level": 2,
    "complexity_suggested": 2,
    "complexity_overridden": false,
    "prd_mode": "fresh"
  },
  "outputs": {
    "functional_requirements": 12,
    "non_functional_requirements": 4,
    "user_journeys": 2,
    "workflow_dependencies": 3,
    "impact_areas": 5,
    "out_of_scope_items": 4,
    "next_step_choice": 1
  },
  "quality_score": {
    "total": 78,
    "clarity": 22,
    "specificity": 20,
    "actionability": 19,
    "grammar": 12,
    "scope": 5
  },
  "verification": {
    "level_1_passed": true,
    "level_2_passed": true,
    "issues_found": 0
  },
  "artifacts": [
    "{story_title}_PRD.md",
    "quality-scores.json"
  ]
}
```

### Phase 3 Receipt: PO Review
```json
{
  "receipt_id": "phase-3-{workflow_id}-{timestamp}",
  "phase": 3,
  "phase_name": "PO Review",
  "workflow_id": "{workflow_id}",
  "timestamp": "ISO-8601",
  "confidence": { "level": "HIGH", "score": 90 },
  "inputs": {
    "prd_file": "{story_title}_PRD.md"
  },
  "outputs": {
    "approval_status": "approved|needs-revision|overridden",
    "correction_iterations": 1,
    "stage_1_compliance": { "passed": 6, "total": 6 },
    "stage_2_quality": { "passed": 7, "total": 8 },
    "critical_issues_found": 0,
    "important_issues_found": 1,
    "minor_issues_found": 1,
    "changes_applied": 1
  },
  "artifacts": [
    "{story_title}_PO-review-feedback.md"
  ]
}
```

### Phase 4 Receipt: Story Creation
```json
{
  "receipt_id": "phase-4-{workflow_id}-{timestamp}",
  "phase": 4,
  "phase_name": "Story Creation",
  "workflow_id": "{workflow_id}",
  "timestamp": "ISO-8601",
  "confidence": { "level": "HIGH", "score": 88 },
  "inputs": {
    "prd_file": "{story_title}_PRD.md",
    "complexity_level": 2,
    "generation_mode": "new|update"
  },
  "outputs": {
    "stories_created": 8,
    "total_acceptance_criteria": 24,
    "gwt_format_compliance": "100%",
    "stories_with_dependencies": 5,
    "prd_coverage": "100%",
    "fr_to_story_mapping": {
      "FR001": ["story-01"],
      "FR002": ["story-02", "story-03"]
    }
  },
  "jira": {
    "synced": true,
    "project_key": "OUTAGE",
    "issues_created": 8,
    "issue_keys": ["OUTAGE-2106", "OUTAGE-2107"],
    "failures": 0
  },
  "verification": {
    "level_1_passed": true,
    "level_2_passed": true,
    "level_3_passed": true,
    "issues_found": 0
  },
  "artifacts": [
    "stories/01-story-name.md",
    "stories/02-story-name.md",
    "jira-sync-status.json",
    "system-context.md"
  ]
}
```

## Storage
```
{workspace}/{workflow_id}/receipts/
  phase-1-receipt.json
  phase-2-receipt.json
  phase-3-receipt.json
  phase-4-receipt.json
```

## Workflow Summary Receipt
After Phase 4 completion, generate a combined summary:
```json
{
  "workflow_id": "{workflow_id}",
  "completed_at": "ISO-8601",
  "total_phases": 4,
  "phases_completed": 4,
  "overall_confidence": "HIGH",
  "total_requirements": 12,
  "total_stories": 8,
  "jira_synced": true,
  "quality_trend": [null, 78, null, null],
  "phases": ["phase-1-receipt.json", "phase-2-receipt.json", "phase-3-receipt.json", "phase-4-receipt.json"]
}
```
