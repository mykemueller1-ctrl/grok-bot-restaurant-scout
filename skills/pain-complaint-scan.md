# Skill: Pain Complaint Scan

**Used by:** all `never86-pain-shoppers` agents (POS, silo, thematic).  
**Trigger:** daily routine per agent, or on demand.

**Goal:** Find public complaints matching this agent's vendor / pain across TikTok, Reddit, Facebook groups, X, forums — operators who can become Never86 sales leads.

1. Load agent config:
   - POS/silo: `vendor_id`, `aliases`, `seed_queries`, learned query bank
   - thematic: `pain_id`, `seed_queries`, learned bank
2. Expand queries with aliases + `vendors/catalog.json` complaint signal templates (`fuck {vendor}`, `leaving {vendor}`, …).
3. Search connected sources:
   - Primary: complaint-sources + social-trends MCP
   - Fallback (Active): Composio `COMPOSIO_SEARCH_WEB` / X `search_posts_all` for recent operator complaints when MCP sources are thin
4. Keep posts from the last 90 days that sound like **operator pain**, not diner noise or vendor employees.
5. Require vendor/alias hit for POS/silo agents (or high-confidence paraphrase confirmed later in teach).
6. Capture thin stubs: source, url, posted_at, handle, snippet, `pain_id` / `vendor_id`, score 0–100.
7. Dedupe against existing `PainLead` records (same url / same handle+vendor+day).
8. Pass top N (default 10) into `lead-shop-enrich`.

**Out of scope:** hunting for forecasting / labor-schedule complaints as a primary lane (unless the post also shows displaceable vendor pain).

**Done when:** ≥5 fresh stubs scored, or sources exhausted with a shortfall note.
