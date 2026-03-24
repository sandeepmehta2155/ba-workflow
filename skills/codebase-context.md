# Codebase Context for Business Analysis

## Core Principle
Query **Serena plugin's project memory** to understand what the system does from a business perspective — not how it's built. Serena builds and maintains codebase knowledge through ad-hoc indexing runs. During the BA workflow, leverage that existing memory instead of scanning code directly. This helps the BA write better stories, NOT to guide developers on implementation.

## What This Is NOT
- NOT a live code scan — do not read source files during the workflow
- NOT a technical architecture review
- NOT a guide for developers on which files to change
- Does NOT produce technical terms in stories (no mentions of migrations, services, controllers, DTOs, APIs, database schemas, ORMs, etc.)
- Stories are for business stakeholders — they describe WHAT the system should do, never HOW

## When to Apply
- Phase 2, before story generation
- **Uses** Serena plugin's project memory (built through ad-hoc `/sc:load` or Serena indexing runs)
- Generates `{workspace}/{workflow_id}/system-context.md`

## How It Works — Serena Memory Instead of Code Scanning

### Prerequisites
Serena plugin should have been run on the project previously (ad-hoc, outside the BA workflow) to build project knowledge. If Serena has no memory for this project, note it and proceed with whatever context is available from `docs/business-docs/` and the brainstorm output.

### Step 1: Query Serena for Business-Relevant Context
Use Serena plugin tools to query for information relevant to the requirement:

```
Ask Serena about:
- Business rules and validation logic related to the requirement
- Status transitions and state machines
- Permission/authorization patterns
- User-facing behavior (success paths, error messages, notifications)
- Edge cases and boundary conditions
- Existing workflows that touch the requirement area
```

Translate every finding into **business language**. Strip all technical details.

### Step 2: Cross-Reference with Business Docs
From `docs/business-docs/` only (files selected by the user in Step 1b):
- Which business processes already exist that touch this requirement?
- What are the dependencies between workflows?
- Are there business rules that conflict with or constrain the new requirement?
Do NOT scan code to detect workflows. Workflows = business docs selected by the user.

### Step 3: Fill Gaps
If Serena's memory doesn't cover an area relevant to the requirement:
- Note the gap explicitly in the output
- Do NOT fall back to reading source code during the workflow
- Flag it as "needs ad-hoc Serena indexing" for the team to run separately

## Output Format

Save to `{workspace}/{workflow_id}/system-context.md`:

```markdown
# Business Context for {workflow_id}

Generated: {timestamp}
Source: Serena plugin project memory + business docs
Purpose: Business rules and edge cases relevant to this requirement

## Discovered Business Rules
| Rule | Current Behavior | Relevance to Requirement |
|------|-----------------|-------------------------|
| {business rule in plain language} | {what the system does today} | {how this affects new stories} |

## User-Facing Behavior
| Action | Success Outcome | Failure Outcome |
|--------|----------------|-----------------|
| {user action} | {what user sees} | {what user sees on failure} |

## Edge Cases to Address in Stories
- {scenario in business language}
- {scenario in business language}
- ...

## Related Business Workflows
- {workflow name}: {how it connects to this requirement}

## Constraints for Story Writing
- {business constraint that stories must respect}
- {business constraint that stories must respect}

## Coverage Gaps
- {areas where Serena had no context — flag for ad-hoc indexing}
```

## Skill Contract

### Entry Conditions
- Phase 1 complete (`state.json` with `status: "phase_1_complete"`)
- Story complexity determined (Step 4 complete)
- Serena plugin available (if not, proceed with business docs only and note gaps)

### Exit Conditions
- `{workspace}/{workflow_id}/system-context.md` saved
- Business rules extracted and expressed in business language
- Edge cases documented as business scenarios
- No technical implementation details in output
- Coverage gaps documented (if any)

### Previous Skill: `elicitation-methods` (Phase 1) or `project-scan` (if elicitation skipped)
### Next Skill: `testable-criteria` (applied during story generation)

---

## Integration with Story Creation

When ba-stories generates stories:
1. Read system-context.md
2. Incorporate discovered business rules into Acceptance Criteria
3. Add discovered edge cases to the Edge Cases section of relevant stories
4. Ensure stories don't contradict existing business workflows
5. **NEVER add technical implementation notes to stories**
