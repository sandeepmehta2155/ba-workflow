# Testable Acceptance Criteria (Point-by-Point)

## Core Principle
If an acceptance criterion can't be expressed as a **clear, testable point**, it's too vague. Force refinement until it's verifiable by QA.

## When to Apply
- Phase 2 (ba-stories Step 5) — enforce on every AC in every story
- Quality gate: stories with vague or untestable criteria are flagged as incomplete

## Point-by-Point Format

Each AC is a numbered point with a short descriptive title, followed by bullet points that specify the behavior clearly:

```markdown
1. **[Short description of what is being tested]**
   - [Specific condition, context, or prerequisite]
   - [What the user/system does]
   - [Expected observable outcome]
```

**Do NOT use Given/When/Then (Gherkin) format.** Use plain, direct bullet points that a business analyst or QA tester can read and verify.

### Rules
1. Each AC covers **one scenario** — one clear behavior to verify
2. Outcomes must be **observable** — QA can verify by looking, clicking, or querying
3. Conditions and thresholds must be **specific** — numbers, not "many" or "some"
4. At least **1 negative/edge case** AC per story

## Format Examples

### Good (Point-by-Point)

```markdown
## Acceptance Criteria

1. **User can sign in with email and password**
   - User enters correct email and password on the login page
   - User clicks Sign In
   - User is redirected to the dashboard and a session is created with 24h expiry

2. **Failed login shows generic error**
   - User enters an email that doesn't exist in the system
   - System shows "Invalid email or password" (does not reveal whether email exists)
   - Failed attempt is logged with IP address

3. **Account lockout after repeated failures**
   - User fails login 5 times from the same IP
   - CAPTCHA is displayed on the next attempt
   - User is notified via email about suspicious activity

4. **Dashboard loads within performance target**
   - Database contains 100K+ records
   - User searches by name on the dashboard
   - Results display within 500ms
```

### Complex Scenario (Multiple Outcomes)

```markdown
5. **Admin can draw a storm polygon on the map**
   - Admin is logged in and on the Storm Creation page
   - Admin draws a polygon with 5 vertices on the map
   - The polygon displays with a blue boundary and semi-transparent fill
   - Area calculation is shown in square miles
   - "Save Storm" button becomes enabled
   - Polygon vertices are listed in the sidebar with lat/lng coordinates
```

## Conversion from Vague to Testable

| Vague AC | Testable AC |
|----------|-------------|
| "Handle errors gracefully" | **Form submission error shows user message** — API returns HTTP 500 → show "Something went wrong. Please try again." and log error with correlation ID |
| "User-friendly interface" | **Dashboard renders quickly and navigation is visible** — All widgets render within 2 seconds, navigation visible without scrolling |
| "Secure authentication" | **Sign-in uses HTTP-only session cookies** — Correct credentials → redirect to dashboard, set HTTP-only session cookie with 24h expiry |
| "Support multiple formats" | **Export supports CSV with current filters** — User selects CSV on export page → downloads CSV with all visible columns and current filter applied |
| "Admin can manage users" | **Admin can deactivate a user** — Admin clicks Deactivate on user row → status changes to "Inactive", user can no longer log in |

## Enforcement in Story Template

Every story's Acceptance Criteria section MUST use this format:

```markdown
## Acceptance Criteria

1. **[Short description]**
   - [Condition or context]
   - [User/system action]
   - [Expected outcome — observable and verifiable]

2. **[Short description]**
   - [Condition or context]
   - [User/system action]
   - [Expected outcome]

3. **Edge case — [description]**
   - [Condition]
   - [Expected behavior]
```

## Quality Checks

| Check | Pass | Fail |
|-------|------|------|
| Every AC is a numbered point with bullet details | All ACs follow format | Any AC is a prose paragraph or uses Given/When/Then |
| Outcome is observable | QA can verify by looking/clicking/querying | "system handles it correctly" |
| Each AC covers one scenario | One clear scenario per AC | Multiple unrelated behaviors in one AC |
| Edge cases included | At least 1 negative/edge AC per story | Only happy path ACs |
| No Gherkin format | Plain bullet points throughout | Given/When/Then keywords used |

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

## Skill Contract

### Entry Conditions
- `system-context.md` exists (codebase-context skill completed)
- Story template loaded
- Analyst persona active (generating stories)

### Exit Conditions
- Every AC in every story uses numbered point-by-point format with bullet details
- Zero vague phrases remain (all flagged phrases rewritten)
- At least 1 negative/edge case AC per story
- Each AC covers exactly one scenario
- No Given/When/Then (Gherkin) format used

### Previous Skill: `codebase-context` (provides business rules for ACs)
### Next Skill: `two-stage-review` (PO reviews the stories with enforced ACs)
