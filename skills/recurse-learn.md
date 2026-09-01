# Skill: Recurse Learn

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after each teach batch, or weekly consolidation.

**Goal:** Research → learn → tighten the hunt. Agents get sharper from Myke's labels, not from guessing forever.

1. Pull last N labeled leads for this `pain_id`.
2. Diff keeps vs rejects:
   - Phrases / vendors / roles that predict `keep`
   - Noise patterns to suppress (diner rants, memes, job seekers, Toast employees, etc.)
3. Update the agent's learned bank (stored via lead-shop MCP, not only in chat):
   - `query_boosts[]` / `query_blocks[]`
   - `icp_rules` (must / must-not)
   - `example_keeps` / `example_rejects` (short)
4. Research pass on ambiguous `needs_research` labels: open venue site, menu, socials; enrich; re-queue for teach once.
5. Emit a short learning note to owner: "Next scan will boost X, kill Y."
6. When keep-rate on auto-scored leads is stable (owner-defined threshold), enable auto-fill path in `sales-lead-form` for high-confidence keeps only.

**Never** auto-outreach from learning alone — learning only improves search + form fill.
