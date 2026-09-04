# Skill: Lead Shop Enrich

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after `pain-complaint-scan`.

**"Shop" means:** pull everything useful about the human/venue and the complaint — identity + context window. Prefer **public** enrichment that sharpens Never86 sales readiness.

1. Deepen each stub:
   - Role guess (owner / GM / manager / chef / not-operator)
   - Venue name, city, cuisine, unit count if findable
   - Full complaint context (thread, caption, stitch, comments)
   - Primary `vendor_id` + other vendors mentioned (POS and silos)
   - $ / % / fee numbers
   - Public contact surfaces only
2. **Public venue enrichment (adopted — Active, no Apollo required):**
   - Composio `YELP_SEARCH_BUSINESSES` → `YELP_GET_BUSINESS_DETAILS` (phone, website, address)
   - When a phone is already known (love fixtures / complaint stubs): `YELP_SEARCH_BY_PHONE` (E.164) to resolve alias + identity fast — live 2026-09-04 all 5 markets: G&TG CHI, Franklin ATX, Michaels MIA, Husk BNA, Rioja DEN
   - `COMPOSIO_SEARCH_GOOGLE_MAPS` to disambiguate / confirm operational status
   - `COMPOSIO_SEARCH_WEB` + optional `COMPOSIO_SEARCH_FETCH_URL_CONTENT` for public email / contact page (never invent contacts)
   - When Apollo/Clay become desktop-auth’d, use them as a second pass — not a blocker
3. Write `PainLead`:
   - `pain_id`, `vendor_id`, `category` (`pos` | `silo` | `thematic`)
   - `sources[]`, `identity`, `venue`, `complaint_summary`
   - `quotes[]`, `vendors_mentioned[]`, `stack_guess[]`
   - `raw_context`, `opportunity_signals`, `status: NEEDS_TEACH`
4. Rank by Never86 fit:
   - pain intensity × operator authenticity × reachable × vendor displace potential
   - Boost when complaint maps to marketplace rent / POS lock-in / **KEEP-not-GMV** language that Never86 **buy-now** or stack displacement can answer
   - Do **not** rank on sales/labor forecasting potential
5. Optional: after teach `keep`, hand off to `sales-lead-form` (see end-to-end dogfood `fixtures/tool-hunt/pain-to-sales-keep-girl-goat.json`).

**Done when:** each kept stub is a filled `PainLead` ready for `teach-label`.
