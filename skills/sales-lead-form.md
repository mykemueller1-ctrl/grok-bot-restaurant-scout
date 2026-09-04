# Skill: Sales Lead Form

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after owner `keep` (manual), or high-confidence auto after recurse-learn unlocks it.

**Goal:** Turn a shopped + taught complaint into a Never86 sales lead form Myke (or later automation) can work — wedge is **love→buy-now / anti-marketplace rent / displace painful vendor**, not forecasting software.

Fill and save `SalesLead`:

| Field | Source |
| --- | --- |
| `pain_id` | agent |
| `account_name` | venue |
| `contact_name` / `role` / `handles` | identity shop |
| `city` / `market` | enrich (Yelp/Maps/public web) |
| `complaint_thesis` | taught summary |
| `quotes` | raw |
| `vendors_to_displace` | Toast, DoorDash, etc. |
| `why_never86_now` | map pain → Never86 wedge (buy-now / social commerce / leave marketplace tax / stack pain) |
| `suggested_angle` | 1 outreach angle (draft only) — contrast vs Owner email/SMS OS, Outbites/Orderitto/Seared first-party web-QR ordering, Menami/TextOrder/Ainisa DM agents, OrderPost post→order links, Seekadu reservations, Moast Shopify UGC widgets, Seekeasy/Beebz creator discovery, or content-only AI Reels (Feedo/PlateAI) |
| `sources` | URLs |
| `confidence` | score + teach history |
| `status` | `DRAFT` → owner approve → `QUALIFIED` |

Rules:
- Prefer **KEEP / commission % / quit marketplace / effective cost statement-math** language from owners when framing `complaint_thesis` (see `fixtures/tool-hunt/pain-scan-marketplace-keep.json`, `pain-scan-doordash-effective-cost.json`, `pain-to-sales-keep-girl-goat.json`).
- Draft outreach copy may be suggested; **sending** requires approvals MCP.
- Same human/venue across pain agents → merge / link, don't spam duplicate leads.
- Never pitch labor/sales **forecasting** as the Never86 product.
- Output digest: "N new qualified leads for {pain_id}."

**Done when:** `SalesLead` saved and owner notified.

**Active dogfood:** `fixtures/tool-hunt/pain-to-sales-keep-girl-goat.json` + `fixtures/tool-hunt/pain-to-sales-effective-cost-franklin.json` prove Yelp/Maps/X/KEEP → SalesLead DRAFT without Apollo/Mem0.
