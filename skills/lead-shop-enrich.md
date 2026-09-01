# Skill: Lead Shop Enrich

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after `pain-complaint-scan`.

**"Shop" means:** pull everything useful about the human/venue and the complaint — identity + context window.

1. Deepen each stub:
   - Role guess (owner / GM / manager / chef / not-operator)
   - Venue name, city, cuisine, unit count if findable
   - Full complaint context (thread, caption, stitch, comments)
   - Primary `vendor_id` + other vendors mentioned (POS and silos)
   - $ / % / fee numbers
   - Public contact surfaces only
2. Write `PainLead`:
   - `pain_id`, `vendor_id`, `category` (`pos` | `silo` | `thematic`)
   - `sources[]`, `identity`, `venue`, `complaint_summary`
   - `quotes[]`, `vendors_mentioned[]`, `stack_guess[]`
   - `raw_context`, `severity_signals`, `status: NEEDS_TEACH`
3. Rank by Never86 fit (pain intensity × operator authenticity × reachable × vendor displace potential).

**Done when:** each kept stub is a filled `PainLead` ready for `teach-label`.
