# Skill: Pain Complaint Scan

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** daily routine per pain agent, or on demand.

**Goal:** Find public complaints matching this agent's `pain_id` across TikTok, Reddit, Facebook groups, X, forums — restaurants, managers, GMs, owners.

1. Load agent config: `pain_id`, `seed_queries`, `icp_hints`, plus any learned query bank from `recurse-learn`.
2. Search each connected source (social MCP + reddit/facebook connectors when wired).
3. Keep posts/videos from the last 90 days that sound like **operator pain**, not random diner noise.
4. For each hit, capture a thin stub:
   - `source`, `url`, `posted_at`
   - `handle` / display name
   - `snippet` (raw quote)
   - `pain_id` + provisional score (0–100)
5. Dedupe against existing `PainLead` records.
6. Pass top N (default 10) stubs into `lead-shop-enrich`.

**Done when:** ≥5 fresh stubs scored, or sources exhausted with a written shortfall note.
