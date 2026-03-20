# Subagent Coordination

## Core Principle
Fresh subagents produce better results than persona-switching within a single session. The Analyst's reasoning biases the PO's review. A fresh PO subagent has no knowledge of *why* the story was written — it can only evaluate *what* was written.

## When to Use Subagents

| Scenario | Strategy | Why |
|----------|----------|-----|
| Complexity 0-1 (1-10 stories) | Sequential in-session | Overhead of dispatch exceeds benefit |
| Complexity 2-4 (5-40+ stories) | Parallel subagent dispatch | Faster generation, independent clusters |
| PO review of 1-3 stories | In-session persona switch | Quick, low overhead |
| PO review of 4+ stories | Fresh subagent per story | Independent review, parallel execution |
| Correction loop (fix + re-review) | Analyst in-session, PO as fresh subagent | Analyst needs session context; PO needs fresh eyes |

## Subagent Dispatch Rules

### What to provide (INLINE — never make subagents read files):
1. **Full content** of all required files — state.json, agent persona, skills, templates
2. **The specific task** — which cluster to generate, or which story to review
3. **Output instructions** — exact file paths to save to, exact format to use

### What NOT to provide:
1. **Session history** — subagent should not know what happened before
2. **Other stories** — each subagent works on its assignment only
3. **Analyst reasoning** — PO subagent must not know why stories were written a certain way

### Dispatch limits:
- **Maximum 3 subagents in parallel** — more than 3 creates coordination overhead
- **Never dispatch generation and review in parallel** — all stories must be generated before review begins
- **Never resume a PO subagent for re-review** — always dispatch fresh (previous context contaminates the re-review)

## Response Handling

### Story Generation Subagent

| Response | Action |
|----------|--------|
| Stories generated, saved to files | Read files, proceed to reconciliation |
| "I need more context about [X]" | Provide the specific Phase 1 data, re-dispatch |
| "Requirements in this cluster conflict" | Escalate to user — requirement conflict detected |
| "This cluster is too large for clean stories" | Split cluster, re-dispatch two smaller subagents |
| Subagent generated stories outside its cluster | Discard out-of-scope stories, keep only assigned cluster |

### PO Review Subagent

| Response | Action |
|----------|--------|
| APPROVED with substantive feedback | Accept, mark story approved |
| APPROVED with zero comments | Suspicious — re-dispatch with "Challenge this story" instruction |
| NEEDS REVISION with CRITICAL issues | Present to user, enter correction loop |
| NEEDS REVISION with only MINOR issues | Present to user, but note these are non-blocking |
| "I need the Phase 1 requirements" | You forgot to include state.json — re-dispatch with it |
| Review doesn't follow two-stage format | Discard, re-dispatch with explicit two-stage-review skill content |

## Reconciliation (after parallel generation)

After all generation subagents complete, the coordinator (this session) must:

1. **Read all generated stories** from `{workspace}/{workflow_id}/stories/`
2. **Check for duplicates** — same requirement covered by stories from different clusters
   - If found: merge into the better-written story, delete the duplicate
3. **Check for gaps** — requirements from Phase 1 not covered by any story
   - If found: generate missing stories in this session
4. **Check for contradictions** — conflicting ACs across stories
   - If found: flag for user decision
5. **Renumber** — ensure sequential numbering `01-`, `02-`, etc.
6. **Present reconciliation summary:**
   ```
   Story Generation Complete (parallel)

   Generated: X stories across Y clusters
   Duplicates merged: X
   Gaps filled: X
   Contradictions flagged: X (need your input)

   Ready for PO Review.
   ```

## Platform Compatibility

If the Agent tool is unavailable (non-Claude Code platforms):
- Fall back to sequential story generation in this session
- Fall back to in-session PO persona switching
- All enforcement rules still apply — only the dispatch mechanism changes
- Display: "Running in sequential mode (subagent dispatch unavailable on this platform)"
