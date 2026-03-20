# TDD for Acceptance Criteria (Given/When/Then)

## Core Principle
If an acceptance criterion can't be expressed as **Given/When/Then**, it's too vague. Force refinement until it's testable.

## When to Apply
- Phase 2 (ba-stories Step 5) — enforce on every AC in every story
- Quality gate: stories with non-GWT criteria are flagged as incomplete

## Given/When/Then Format

```gherkin
Given [precondition / initial state]
When [action / trigger]
Then [expected outcome / observable result]
```

### Rules
1. **Given** = Setup. What must be true BEFORE the action?
2. **When** = Trigger. What single action does the user/system perform?
3. **Then** = Assertion. What observable result proves it worked?
4. **Then** must be verifiable by QA (visible, measurable, or queryable)

## Conversion Examples

### Bad → Good

| Bad (Vague) AC | Good (GWT) AC |
|----------------|---------------|
| "Handle errors gracefully" | Given API returns HTTP 500, When user submits the form, Then show "Something went wrong. Please try again." message and log error with correlation ID |
| "User-friendly interface" | Given user lands on dashboard, When page loads, Then all widgets render within 2 seconds and navigation is visible without scrolling |
| "Secure authentication" | Given user enters correct email and password, When user clicks Sign In, Then redirect to dashboard and set HTTP-only session cookie with 24h expiry |
| "Fast response times" | Given database has 100K records, When user searches by name, Then results display within 500ms |
| "Support multiple formats" | Given user is on export page, When user selects CSV and clicks Export, Then download a CSV file with all visible columns and current filter applied |
| "Admin can manage users" | Given admin is on User Management page, When admin clicks Deactivate on a user row, Then user status changes to "Inactive" and user can no longer log in |

### Complex Scenarios (Multiple Thens)

```gherkin
Given admin is logged in and on the Storm Creation page
When admin draws a polygon with 5 vertices on the map
Then:
  - The polygon is displayed with a blue boundary and semi-transparent fill
  - The area calculation is shown in square miles
  - The "Save Storm" button becomes enabled
  - The polygon vertices are listed in the sidebar with lat/lng coordinates
```

### Negative / Edge Case Scenarios

```gherkin
Given user is on the login page
When user enters an email that doesn't exist in the system
Then:
  - Show "Invalid email or password" (generic message, don't reveal if email exists)
  - Log failed attempt with IP address
  - After 5 failed attempts from same IP, show CAPTCHA
```

## Enforcement in Story Template

Every story's Acceptance Criteria section MUST use this format:

```markdown
## Acceptance Criteria

### AC1: [Short description]
- [bullet point describing the condition or context]
- [bullet point describing what the user or system does]
- [bullet point describing the expected outcome]

### AC2: [Short description]
- [bullet point]
- [bullet point]
- [bullet point]

### AC3: Edge case — [description]
- [bullet point]
- [bullet point]
```

## Quality Checks

| Check | Pass | Fail |
|-------|------|------|
| Every AC uses bullet points | All ACs follow format | Any AC is prose-only paragraph |
| Outcome bullet is observable | QA can verify by looking/clicking/querying | "system handles it correctly" |
| Each AC covers one scenario | One clear scenario per AC | Multiple unrelated behaviours in one AC |
| Edge cases included | At least 1 negative/edge AC per story | Only happy path ACs |

## Vague AC Detector

Flag these phrases — they're almost always untestable:

| Phrase | Why It Fails | Ask Instead |
|--------|-------------|-------------|
| "should be intuitive" | Not measurable | "What specific action should take ≤2 clicks?" |
| "handle gracefully" | No defined behavior | "What exact message/behavior on failure?" |
| "performant" | No number | "What max response time in ms?" |
| "secure" | No specific control | "What auth mechanism? What encryption?" |
| "user-friendly" | Subjective | "What specific UX pattern? Describe the flow." |
| "scalable" | No target | "How many concurrent users/records?" |
| "appropriate" | Who decides? | "What specific value/behavior?" |
| "as needed" | No trigger defined | "What condition triggers this?" |

When any of these phrases appear in an AC, **halt and rewrite** before proceeding.
