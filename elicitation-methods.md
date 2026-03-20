# Advanced Elicitation Methods

## Execution Engine

### MANDATORY Rules
- Execute ALL steps IN EXACT ORDER
- HALT when halt-conditions are met
- Each method application builds upon previous enhancements
- Always re-offer choices after each method execution
- Continue until user selects `x` to proceed

### Flow

**Step 1: Smart Selection**
1. Analyze the requirement for **context signals** (see Context-to-Method Mapping below)
2. Match detected signals to the recommended methods in the mapping table
3. Select 5 methods: pick from the **highest-matching signal categories first**
4. If multiple signals match, blend methods from each matching category
5. Slots 1-2 MUST come from the strongest-matching signal category
6. Only fall back to Quick Picks (bottom of file) when NO signal matches at all

**CRITICAL: Do NOT default to Quick Picks when the requirement has any identifiable context signal. Scan for ALL signals below before selecting.**

#### Context-to-Method Mapping

Scan the requirement for these signals. When detected, prioritize the listed methods:

| Context Signal | Keywords / Indicators | Recommended Methods (prioritize in order) |
|---|---|---|
| **Security / Auth / Permissions** | login, auth, password, role, permission, access control, token, encryption, RBAC, SSO, OAuth | #17 Red Team vs Blue Team, #23 Security Audit Personas, #34 Pre-mortem, #37 Identify Risks, #38 Chaos Monkey |
| **UI / UX / Design** | screen, page, form, button, layout, dashboard, modal, responsive, user interface, wireframe, navigation | #4 User Persona Focus Group, #10 Customer Support Theater, #25 SCAMPER, #6 Cross-Functional War Room, #44 Expand/Contract for Audience |
| **Architecture / System Design** | microservice, API, database, schema, integration, migration, scalability, distributed, event-driven, queue | #20 Architecture Decision Records, #11 Tree of Thoughts, #39 First Principles, #22 Algorithm Olympics, #33 Comparative Analysis Matrix |
| **Performance / Scaling** | slow, latency, throughput, cache, optimization, load, concurrent, bottleneck, memory, indexing | #24 Performance Profiler Panel, #35 Failure Mode Analysis, #38 Chaos Monkey, #22 Algorithm Olympics, #26 Reverse Engineering |
| **New Product / Feature Ideation** | new feature, idea, concept, innovation, MVP, prototype, greenfield, brainstorm, opportunity | #25 SCAMPER, #9 Improv Yes-And, #28 Random Input Stimulus, #30 Genre Mashup, #18 Shark Tank Pitch |
| **Bug Fix / Incident / Debugging** | bug, error, crash, incident, broken, failing, regression, root cause, outage, exception | #40 5 Whys Deep Dive, #21 Rubber Duck Debugging, #47 Occam's Razor, #35 Failure Mode Analysis, #49 Hindsight Reflection |
| **Migration / Refactoring** | migrate, refactor, legacy, upgrade, deprecate, rewrite, modernize, technical debt, replace | #34 Pre-mortem, #5 Time Traveler Council, #26 Reverse Engineering, #20 Architecture Decision Records, #37 Identify Risks |
| **Business Process / Workflow** | workflow, process, approval, notification, status, lifecycle, state machine, escalation, SLA | #1 Stakeholder Round Table, #4 User Persona Focus Group, #6 Cross-Functional War Room, #33 Comparative Analysis Matrix, #16 Reasoning via Planning |
| **Data / Reporting / Analytics** | report, dashboard, metrics, KPI, analytics, chart, aggregation, export, data warehouse, BI | #33 Comparative Analysis Matrix, #12 Graph of Thoughts, #1 Stakeholder Round Table, #44 Expand/Contract for Audience, #26 Reverse Engineering |
| **Compliance / Legal / Regulatory** | compliance, GDPR, HIPAA, audit, regulation, policy, data retention, consent, privacy, PCI | #23 Security Audit Personas, #34 Pre-mortem, #48 Trolley Problem Variations, #37 Identify Risks, #31 Literature Review Personas |
| **Testing / QA / Quality** | test, QA, coverage, regression, automation, acceptance criteria, validation, edge case | #14 Self-Consistency Validation, #36 Challenge from Critical Perspective, #38 Chaos Monkey, #35 Failure Mode Analysis, #19 Code Review Gauntlet |
| **Communication / Notification** | email, notification, SMS, alert, message, webhook, push notification, real-time, broadcast | #10 Customer Support Theater, #4 User Persona Focus Group, #27 What If Scenarios, #8 Good Cop Bad Cop, #34 Pre-mortem |
| **Multi-Stakeholder / Cross-Team** | stakeholder, cross-team, alignment, multiple departments, competing priorities, sign-off | #1 Stakeholder Round Table, #3 Debate Club Showdown, #6 Cross-Functional War Room, #2 Expert Panel Review, #8 Good Cop Bad Cop |
| **Strategic / Long-Term Planning** | roadmap, strategy, vision, long-term, quarterly, OKR, initiative, horizon, milestone | #5 Time Traveler Council, #16 Reasoning via Planning, #49 Hindsight Reflection, #18 Shark Tank Pitch, #39 First Principles |
| **API / Integration / Third-Party** | API, REST, GraphQL, webhook, integration, third-party, SDK, connector, sync, endpoint | #20 Architecture Decision Records, #17 Red Team vs Blue Team, #35 Failure Mode Analysis, #33 Comparative Analysis Matrix, #27 What If Scenarios |

**Multi-signal blending:** If a requirement matches 2+ signals (e.g., "security + API"), take slots 1-2 from the strongest signal, slot 3 from the second signal, and slots 4-5 from either or a complementary category for balance.

**Step 2: Present & Handle**

```
Advanced Elicitation Options
Choose a number (1-5), [r] to Reshuffle, [a] List All, or [x] to Proceed:

1. [Method Name] — [short description]
2. [Method Name] — [short description]
3. [Method Name] — [short description]
4. [Method Name] — [short description]
5. [Method Name] — [short description]
r. Reshuffle with 5 new options
a. List all 50 methods
x. Proceed / No Further Actions
```

**Response Handling:**

| Input | Action |
|-------|--------|
| `1-5` | Execute selected method on the requirement. Show enhanced insights. Ask: "Apply these changes? (y/n/other)". If yes: apply. If no: discard. If other: follow user instruction. Re-present 1-5,r,a,x prompt. |
| `r` | Select 5 different methods (diverse categories, slots 1-2 most useful). Present new list. |
| `a` | Show all 50 methods in compact table. Allow selection by number or name. |
| `x` | Complete elicitation. Return enhanced content. |
| Multiple numbers (e.g. `1,3,5`) | Execute methods in sequence, then re-offer choices. |
| Direct feedback text | Apply changes and re-present choices. |

**Step 3: Execution Guidelines**
- Use the description to understand and apply each method
- Use the output pattern as a flexible guide (e.g., "paths → evaluation → selection")
- Adapt complexity based on content needs
- Interpret methods flexibly while maintaining pattern consistency
- Focus on actionable insights
- Stay relevant: tie elicitation to the specific requirement being analyzed
- For multi-persona methods: clearly identify viewpoints
- Track all enhancements made during elicitation
- Each method should: (1) Apply to current enhanced version, (2) Show improvements, (3) Return to prompt

---

## Method Registry (50 Methods)

### Collaboration (10)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 1 | Stakeholder Round Table | Convene multiple personas to contribute diverse perspectives — essential for requirements gathering and finding balanced solutions across competing interests | perspectives → synthesis → alignment |
| 2 | Expert Panel Review | Assemble domain experts for deep specialized analysis — ideal when technical depth and peer review quality are needed | expert views → consensus → recommendations |
| 3 | Debate Club Showdown | Two personas argue opposing positions while a moderator scores points — great for exploring controversial decisions and finding middle ground | thesis → antithesis → synthesis |
| 4 | User Persona Focus Group | Gather your product's user personas to react to proposals and share frustrations — essential for validating features and discovering unmet needs | reactions → concerns → priorities |
| 5 | Time Traveler Council | Past-you and future-you advise present-you on decisions — powerful for gaining perspective on long-term consequences vs short-term pressures | past wisdom → present choice → future impact |
| 6 | Cross-Functional War Room | Product manager + engineer + designer tackle a problem together — reveals trade-offs between feasibility, desirability, and viability | constraints → trade-offs → balanced solution |
| 7 | Mentor and Apprentice | Senior expert teaches junior while junior asks naive questions — surfaces hidden assumptions through teaching | explanation → questions → deeper understanding |
| 8 | Good Cop Bad Cop | Supportive persona and critical persona alternate — finds both strengths to build on and weaknesses to address | encouragement → criticism → balanced view |
| 9 | Improv Yes-And | Multiple personas build on each other's ideas without blocking — generates unexpected creative directions through collaborative building | idea → build → build → surprising result |
| 10 | Customer Support Theater | Angry customer and support rep roleplay to find pain points — reveals real user frustrations and service gaps | complaint → investigation → resolution → prevention |

### Advanced (6)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 11 | Tree of Thoughts | Explore multiple reasoning paths simultaneously then evaluate and select the best — perfect for complex problems with multiple valid approaches | paths → evaluation → selection |
| 12 | Graph of Thoughts | Model reasoning as an interconnected network of ideas to reveal hidden relationships — ideal for systems thinking and discovering emergent patterns | nodes → connections → patterns |
| 13 | Thread of Thought | Maintain coherent reasoning across long contexts by weaving a continuous narrative thread — essential for maintaining consistency | context → thread → synthesis |
| 14 | Self-Consistency Validation | Generate multiple independent approaches then compare for consistency — crucial for high-stakes decisions where verification matters | approaches → comparison → consensus |
| 15 | Meta-Prompting Analysis | Step back to analyze the approach structure and methodology itself — valuable for optimizing problem-solving | current → analysis → optimization |
| 16 | Reasoning via Planning | Build a reasoning tree guided by world models and goal states — excellent for strategic planning and sequential decision-making | model → planning → strategy |

### Competitive (3)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 17 | Red Team vs Blue Team | Adversarial attack-defend analysis to find vulnerabilities — critical for security testing and building robust solutions | defense → attack → hardening |
| 18 | Shark Tank Pitch | Entrepreneur pitches to skeptical investors who poke holes — stress-tests business viability and forces clarity on value proposition | pitch → challenges → refinement |
| 19 | Code Review Gauntlet | Senior devs with different philosophies review the same code — surfaces style debates and finds consensus on best practices | reviews → debates → standards |

### Technical (5)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 20 | Architecture Decision Records | Multiple architect personas propose and debate architectural choices with explicit trade-offs — ensures decisions are well-reasoned and documented | options → trade-offs → decision → rationale |
| 21 | Rubber Duck Debugging Evolved | Explain your code to progressively more technical ducks until you find the bug — forces clarity at multiple abstraction levels | simple → detailed → technical → aha |
| 22 | Algorithm Olympics | Multiple approaches compete on the same problem with benchmarks — finds optimal solution through direct comparison | implementations → benchmarks → winner |
| 23 | Security Audit Personas | Hacker + defender + auditor examine system from different threat models — comprehensive security review from multiple angles | vulnerabilities → defenses → compliance |
| 24 | Performance Profiler Panel | Database expert + frontend specialist + DevOps engineer diagnose slowness — finds bottlenecks across the full stack | symptoms → analysis → optimizations |

### Creative (6)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 25 | SCAMPER Method | Apply seven creativity lenses (Substitute/Combine/Adapt/Modify/Put/Eliminate/Reverse) — systematic ideation for product innovation | S→C→A→M→P→E→R |
| 26 | Reverse Engineering | Work backwards from desired outcome to find implementation path — powerful for goal achievement and understanding endpoints | end state → steps backward → path forward |
| 27 | What If Scenarios | Explore alternative realities to understand possibilities and implications — valuable for contingency planning and exploration | scenarios → implications → insights |
| 28 | Random Input Stimulus | Inject unrelated concepts to spark unexpected connections — breaks creative blocks through forced lateral thinking | random word → associations → novel ideas |
| 29 | Exquisite Corpse Brainstorm | Each persona adds to the idea seeing only the previous contribution — generates surprising combinations through constrained collaboration | contribution → handoff → contribution → surprise |
| 30 | Genre Mashup | Combine two unrelated domains to find fresh approaches — innovation through unexpected cross-pollination | domain A + domain B → hybrid insights |

### Research (3)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 31 | Literature Review Personas | Optimist researcher + skeptic researcher + synthesizer review sources — balanced assessment of evidence quality | sources → critiques → synthesis |
| 32 | Thesis Defense Simulation | Student defends hypothesis against committee with different concerns — stress-tests research methodology and conclusions | thesis → challenges → defense → refinements |
| 33 | Comparative Analysis Matrix | Multiple analysts evaluate options against weighted criteria — structured decision-making with explicit scoring | options → criteria → scores → recommendation |

### Risk (5)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 34 | Pre-mortem Analysis | Imagine future failure then work backwards to prevent it — powerful technique for risk mitigation before major launches | failure scenario → causes → prevention |
| 35 | Failure Mode Analysis | Systematically explore how each component could fail — critical for reliability engineering and safety-critical systems | components → failures → prevention |
| 36 | Challenge from Critical Perspective | Play devil's advocate to stress-test ideas and find weaknesses — essential for overcoming groupthink | assumptions → challenges → strengthening |
| 37 | Identify Potential Risks | Brainstorm what could go wrong across all categories — fundamental for project planning and deployment preparation | categories → risks → mitigations |
| 38 | Chaos Monkey Scenarios | Deliberately break things to test resilience and recovery — ensures systems handle failures gracefully | break → observe → harden |

### Core (6)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 39 | First Principles Analysis | Strip away assumptions to rebuild from fundamental truths — breakthrough technique for innovation and solving impossible problems | assumptions → truths → new approach |
| 40 | 5 Whys Deep Dive | Repeatedly ask why to drill down to root causes — simple but powerful for understanding failures | why chain → root cause → solution |
| 41 | Socratic Questioning | Use targeted questions to reveal hidden assumptions and guide discovery — excellent for teaching and self-discovery | questions → revelations → understanding |
| 42 | Critique and Refine | Systematic review to identify strengths and weaknesses then improve — standard quality check for drafts | strengths/weaknesses → improvements → refined |
| 43 | Explain Reasoning | Walk through step-by-step thinking to show how conclusions were reached — crucial for transparency | steps → logic → conclusion |
| 44 | Expand or Contract for Audience | Dynamically adjust detail level and technical depth for target audience — matches content to reader capabilities | audience → adjustments → refined content |

### Learning (2)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 45 | Feynman Technique | Explain complex concepts simply as if teaching a child — the ultimate test of true understanding | complex → simple → gaps → mastery |
| 46 | Active Recall Testing | Test understanding without references to verify true knowledge — essential for identifying gaps | test → gaps → reinforcement |

### Philosophical (2)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 47 | Occam's Razor Application | Find the simplest sufficient explanation by eliminating unnecessary complexity — essential for debugging | options → simplification → selection |
| 48 | Trolley Problem Variations | Explore ethical trade-offs through moral dilemmas — valuable for understanding values and difficult decisions | dilemma → analysis → decision |

### Retrospective (2)

| # | Method | Description | Pattern |
|---|--------|-------------|---------|
| 49 | Hindsight Reflection | Imagine looking back from the future to gain perspective — powerful for project reviews | future view → insights → application |
| 50 | Lessons Learned Extraction | Systematically identify key takeaways and actionable improvements — essential for continuous improvement | experience → lessons → actions |

---

## Quick Picks (LAST RESORT — only when no context signal matches)

**IMPORTANT: These are fallback defaults ONLY. If the requirement matches ANY signal in the Context-to-Method Mapping table above, use those mapped methods instead. These Quick Picks are for truly generic or ambiguous requirements where no signal can be detected:**

1. **#40 — 5 Whys Deep Dive** — Understand the real business need
2. **#4 — User Persona Focus Group** — Validate user value
3. **#34 — Pre-mortem Analysis** — Catch risks early
4. **#25 — SCAMPER Method** — Explore creative alternatives
5. **#27 — What If Scenarios** — Cover edge cases
