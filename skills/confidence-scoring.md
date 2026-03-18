# Confidence Scoring

## Core Principle
Self-rate confidence at every phase gate. **LOW confidence = stop and ask human.** Never push uncertain work forward.

## When to Apply
- End of every phase (1, 2, 3, 4)
- Stored in `state.json` per phase

## Confidence Levels

| Level | Score | Meaning | Action |
|-------|-------|---------|--------|
| **HIGH** | 80-100% | All requirements clear, no ambiguity, ready to proceed | Auto-proceed to next phase |
| **MEDIUM** | 50-79% | Minor gaps or uncertainties, but workable | Proceed with noted caveats. List uncertainties. |
| **LOW** | 0-49% | Significant gaps, contradictions, or missing info | **HALT. Present issues to user. Ask for guidance.** |

## Scoring Factors (per phase)

### Phase 1: Requirements Analysis
| Factor | Weight | HIGH | MEDIUM | LOW |
|--------|--------|------|--------|-----|
| Requirement clarity | 30% | Clear, specific requirement | Some vague areas | Can't determine what's being asked |
| Question coverage | 25% | 6+ categories answered | 3-5 categories answered | <3 categories, mostly skipped |
| Workflow detection | 20% | Relevant workflows found and confirmed | Some workflows unclear | No business docs or no matches |
| Stakeholder alignment | 25% | User confirmed understanding | User said "proceed" without confirming | User seemed unsure or contradicted themselves |

### Phase 2: PRD Creation
| Factor | Weight | HIGH | MEDIUM | LOW |
|--------|--------|------|--------|-----|
| Requirement coverage | 35% | All requirements mapped to PRD | 80%+ mapped | <80% mapped or gaps found |
| Quality score | 25% | Score 80+ | Score 60-79 | Score <60 |
| Acceptance criteria | 25% | All ACs are testable (GWT) | Most ACs testable | Many ACs are vague |
| Scope definition | 15% | Clear in/out scope | In-scope clear, out fuzzy | Scope undefined |

### Phase 3: PO Review
| Factor | Weight | HIGH | MEDIUM | LOW |
|--------|--------|------|--------|-----|
| Review verdict | 50% | APPROVED, no critical issues | APPROVED WITH CONDITIONS | NEEDS REVISION with criticals |
| Feedback clarity | 25% | PO feedback is specific and actionable | Some vague feedback | Contradictory or unclear feedback |
| Correction success | 25% | Fixed in 1 iteration | Fixed in 2-3 iterations | Still unresolved after 3 iterations |

### Phase 4: Story Creation
| Factor | Weight | HIGH | MEDIUM | LOW |
|--------|--------|------|--------|-----|
| PRD-to-story coverage | 35% | Every FR has at least one story | 80%+ FRs covered | Significant FRs missing |
| Story quality | 25% | All GWT, clear tasks, dependencies mapped | Most stories well-formed | Many stories vague or incomplete |
| Dependency clarity | 20% | All inter-story dependencies documented | Most documented | Circular or missing dependencies |
| Jira readiness | 20% | Stories ready for dev pickup | Minor edits needed | Not ready for development |

## Execution

```
After completing each phase:

1. Score each factor for the current phase
2. Calculate weighted average
3. Determine confidence level (HIGH/MEDIUM/LOW)
4. Present:

   Phase X Confidence: [HIGH|MEDIUM|LOW] (XX%)

   Factor Breakdown:
     Requirement coverage: XX% (weight: 35%) — [reason]
     Quality score:        XX% (weight: 25%) — [reason]
     ...

   [If LOW]:
   ⚠️ HALTING — Confidence too low to proceed.
   Issues requiring human input:
   1. [specific issue needing decision]
   2. [specific issue needing decision]

   How would you like to proceed?
   a) Address the issues above
   b) Override and proceed anyway (not recommended)
   c) Go back to previous phase

   [If MEDIUM]:
   ⚠️ Proceeding with caveats:
   1. [noted uncertainty]
   2. [noted uncertainty]
   These may need revisiting later.

   [If HIGH]:
   ✓ Proceeding to next phase.
```

## State Storage

```json
{
  "confidence": {
    "phase_1": { "level": "HIGH", "score": 85, "factors": {...}, "caveats": [] },
    "phase_2": { "level": "MEDIUM", "score": 67, "factors": {...}, "caveats": ["Edge cases for offline not covered"] },
    "phase_3": { "level": "HIGH", "score": 90, "factors": {...}, "caveats": [] },
    "phase_4": { "level": "HIGH", "score": 88, "factors": {...}, "caveats": [] }
  }
}
```
