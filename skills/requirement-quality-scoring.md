# Requirement Quality Scoring

## When to Apply
- After Step 1 (Requirements Gathering) — score the raw requirement
- After Step 5 (PRD Creation) — score the PRD before PO review
- Gate: **Score < 60% forces refinement before proceeding**

## Scoring Rubric (100 points total)

### 1. Clarity (25 points)
| Score | Criteria |
|-------|----------|
| 25 | Every sentence has one clear meaning. No jargon without definition. |
| 20 | Mostly clear, 1-2 ambiguous phrases |
| 15 | Several ambiguous statements, but intent is understandable |
| 10 | Frequently unclear, requires interpretation |
| 0-5 | Cannot determine what is being asked |

**Red flags:** "should be user-friendly", "handle errors gracefully", "fast response times", "intuitive UI"

### 2. Specificity (25 points)
| Score | Criteria |
|-------|----------|
| 25 | Concrete numbers, named roles, defined behaviors, explicit conditions |
| 20 | Mostly specific, 1-2 vague areas |
| 15 | Mix of specific and generic statements |
| 10 | Mostly generic ("users", "data", "the system") |
| 0-5 | Entirely abstract with no concrete details |

**Red flags:** "all users", "relevant data", "appropriate permissions", "various formats"

### 3. Actionability (25 points)
| Score | Criteria |
|-------|----------|
| 25 | A developer could start implementing from this alone |
| 20 | Minor clarifications needed but direction is clear |
| 15 | Implementation direction clear but significant details missing |
| 10 | Describes a problem but not what to build |
| 0-5 | Pure vision statement with no actionable items |

**Red flags:** "improve the experience", "make it better", "optimize performance"

### 4. Grammar & Structure (15 points)
| Score | Criteria |
|-------|----------|
| 15 | Well-structured, consistent formatting, proper sections |
| 10 | Minor formatting issues, readable |
| 5 | Disorganized but parseable |
| 0 | Stream of consciousness, no structure |

### 5. Scope Definition (10 points)
| Score | Criteria |
|-------|----------|
| 10 | Explicit in-scope AND out-of-scope items listed |
| 7 | In-scope clear, out-of-scope implied |
| 4 | Scope boundaries fuzzy |
| 0 | No scope boundaries — could mean anything |

## Execution Flow

```
1. Read the requirement/PRD
2. Score each dimension independently
3. Calculate total: Clarity + Specificity + Actionability + Grammar + Scope
4. Present scorecard:

   Requirement Quality Score: XX/100

   Clarity:       XX/25  [specific feedback]
   Specificity:   XX/25  [specific feedback]
   Actionability: XX/25  [specific feedback]
   Grammar:       XX/15  [specific feedback]
   Scope:         XX/10  [specific feedback]

   Verdict: [PASS (60+) | NEEDS REFINEMENT (<60)]

5. If NEEDS REFINEMENT:
   - List specific improvements needed (max 5)
   - Offer to auto-improve: "Would you like me to refine this? (y/n)"
   - If yes: generate improved version, show diff, ask for approval
   - Re-score after improvement
   - Loop until PASS or user overrides

6. If PASS:
   - Note any optional improvements
   - Proceed to next phase
```

## Score History
Append each score to `{workspace}/{workflow_id}/quality-scores.json`:
```json
{
  "scores": [
    {
      "phase": "requirements",
      "score": 72,
      "breakdown": { "clarity": 20, "specificity": 18, "actionability": 19, "grammar": 10, "scope": 5 },
      "timestamp": "..."
    }
  ]
}
```
