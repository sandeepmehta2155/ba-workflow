# Feedback Handling Protocol

## Core Principle
When receiving PO review feedback, **verify before implementing**. Not all feedback is correct. Push back with evidence when feedback would break other requirements.

## When to Apply
- Phase 3 (ba-review correction loop)
- Any time PO or stakeholder provides feedback on PRD or stories

## Protocol: VERIFY → ASSESS → RESPOND → IMPLEMENT

### Step 1: VERIFY — Understand the feedback
For each feedback item:
```
1. Restate the feedback in your own words
2. Identify what specific section/requirement it targets
3. Classify: Is this a correction, addition, removal, or clarification?
4. Ask: "Did I understand this correctly?" (if ambiguous)
```

**Never assume you understand vague feedback.** Ask for specifics:
- Bad: "Make it better" → Ask: "Which specific section? What would 'better' look like?"
- Bad: "This doesn't feel right" → Ask: "What specifically feels off? The scope? The acceptance criteria?"

### Step 2: ASSESS — Check impact before changing
For each feedback item, before implementing:

```
Impact Assessment:
1. Does this change conflict with any other requirement?
   → Cross-reference against all FRs
2. Does this expand scope beyond what was discovered?
   → Check against Phase 1 scope boundaries
3. Does this invalidate any existing acceptance criteria?
   → List ACs that would need updating
4. Is this feedback technically feasible?
   → Check against system-context.md (if available)
5. Is this a preference or a requirement?
   → Preferences are optional; requirements are mandatory
```

### Step 3: RESPOND — Push back when needed

**If feedback is valid and non-conflicting:**
```
"Agreed. I'll update [specific section] to [specific change]."
```

**If feedback conflicts with another requirement:**
```
"This change would conflict with FR003 (role-based access) because [reason].
Options:
  a) Update FR003 to accommodate this change
  b) Keep FR003 as-is and adjust this feedback
  c) Defer this to a future phase
Which do you prefer?"
```

**If feedback expands scope:**
```
"This wasn't in our discovered requirements from Phase 1. Adding it would:
  - Increase complexity from Level 2 to Level 3
  - Add approximately X more stories
  - Impact [list affected areas]
Options:
  a) Add it now (accept scope increase)
  b) Add to Out-of-Scope / Phase 2 backlog
  c) Replace an existing requirement to stay in scope
Which do you prefer?"
```

**If feedback is vague:**
```
"I want to make sure I implement this correctly. Could you clarify:
  - [specific question about the feedback]
  - [specific question about expected outcome]"
```

### Step 4: IMPLEMENT — One change at a time

```
1. Implement ONE feedback item
2. Show the diff (what changed, what it affects)
3. Confirm: "Change applied. Next feedback item?"
4. Repeat until all feedback is addressed
5. Never batch-implement — changes may interact
```

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|----------------|
| "Yes, I'll fix everything" | Performative agreement without understanding | Restate each item, verify understanding |
| Implementing all changes at once | Changes may conflict with each other | One at a time, verify after each |
| Silently accepting scope creep | Feedback adds features not in requirements | Flag it, ask user to decide |
| Ignoring feedback you disagree with | Feedback may be valid even if uncomfortable | Assess impact, respond with evidence |
| "That's a great point!" (for every item) | Sycophantic, not technical | Evaluate technically, respond honestly |

## Feedback Classification

| Type | Example | Response Strategy |
|------|---------|-------------------|
| **Correction** | "FR003 says X but should say Y" | Verify against discovery, update if valid |
| **Addition** | "We also need Z" | Flag as scope change, assess impact |
| **Removal** | "Remove FR005, not needed" | Confirm no dependencies on FR005, then remove |
| **Clarification** | "FR002 is unclear about edge case" | Rewrite for clarity, confirm understanding |
| **Preference** | "I'd prefer the wording to be..." | Implement if harmless, note as preference not requirement |
| **Contradiction** | "Make it both X and not-X" | Surface the contradiction, ask for resolution |
