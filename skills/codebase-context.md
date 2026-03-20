# Codebase Context for Business Analysis

## Core Principle
Read the code to understand **what the system does from a business perspective** — not how it's built. The goal is to discover business rules, user flows, edge cases, and constraints that are buried in code but missing from documentation. This helps the BA write better stories, NOT to guide developers on implementation.

## What This Is NOT
- NOT a technical architecture review
- NOT a guide for developers on which files to change
- Does NOT produce technical terms in stories (no mentions of migrations, services, controllers, DTOs, APIs, database schemas, ORMs, etc.)
- Stories are for business stakeholders — they describe WHAT the system should do, never HOW

## When to Apply
- Phase 2, before story generation
- **Builds on** `{workspace}/{workflow_id}/project-scan.md` from Step 0 (knows where to look)
- Generates `{workspace}/{workflow_id}/system-context.md`

## What to Extract from Code

### 1. Business Rules Hidden in Code
```
Read source files to find:
- Validation rules (e.g., "password must be 8+ chars" → story edge case)
- Status transitions (e.g., order: pending → confirmed → shipped → delivered)
- Permission checks (e.g., "only admins can approve refunds" → role-based AC)
- Calculation logic (e.g., "discount applies only if cart > $50")
- Rate limits or thresholds (e.g., "max 3 login attempts")
```
Translate each finding into **business language**.

### 2. User-Facing Behavior
```
Read code to understand:
- What happens when a user performs an action (success path)
- What error messages users see (failure paths)
- What notifications/emails are triggered
- What data users can see vs. what is hidden
- Default values and auto-populated fields
```

### 3. Edge Cases from Code Logic
```
Look for:
- Boundary conditions (what if quantity is 0? what if date is in the past?)
- Null/empty handling (what happens if optional fields are missing?)
- Concurrent scenarios (what if two users edit the same record?)
- External dependency failures (what does the user see if payment fails?)
```
Express each as a business scenario, not a technical condition.

### 4. Existing Business Workflows
```
From docs/business-docs/ and code:
- Which business processes already exist that touch this requirement?
- What are the dependencies between workflows?
- Are there business rules that conflict with or constrain the new requirement?
```

## Output Format

Save to `{workspace}/{workflow_id}/system-context.md`:

```markdown
# Business Context for {workflow_id}

Generated: {timestamp}
Purpose: Business rules and edge cases discovered from codebase analysis

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
```

## Integration with Story Creation

When ba-stories generates stories:
1. Read system-context.md
2. Incorporate discovered business rules into Acceptance Criteria
3. Add discovered edge cases to the Edge Cases section of relevant stories
4. Ensure stories don't contradict existing business workflows
5. **NEVER add technical implementation notes to stories**
