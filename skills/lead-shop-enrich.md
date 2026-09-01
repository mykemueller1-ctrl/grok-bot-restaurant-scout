# Skill: Lead Shop Enrich

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after `pain-complaint-scan`.

**"Shop" means:** pull everything useful about the human/venue and the complaint — identity + context window — not buy anything.

1. For each stub, deepen research:
   - Role guess (owner / GM / manager / chef / influencer cosplaying)
   - Venue name, city, cuisine, unit count if findable
   - Full complaint context window: surrounding comments, thread, caption, stitch/duet context
   - Named vendors (Toast, DoorDash, 7shifts, etc.)
   - $ / % / fee numbers if present
   - Contact surface if public (email in bio, IG, LinkedIn, website form) — never scrape private data illegally
2. Write a `PainLead` via commerce / lead-shop MCP:
   - `pain_id`, `sources[]`, `identity`, `venue`, `complaint_summary`
   - `quotes[]`, `vendors_mentioned[]`, `severity_signals`
   - `raw_context` (enough for Myke to teach without reopening every tab)
   - `status`: `NEEDS_TEACH`
3. Rank by Never86 fit heuristic (pain intensity × operator authenticity × reachable).

**Done when:** each kept stub has a filled `PainLead` ready for `teach-label`.
