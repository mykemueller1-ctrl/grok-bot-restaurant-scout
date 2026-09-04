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
| `suggested_angle` | 1 outreach angle (draft only) — contrast vs Owner email/SMS OS, Popmenu/Sauce/ChowNow/Lunchbox/OPA!/SWIPEBY/Outbites/Orderitto/Seared/Deonde/Flipdish first-party web-QR/IG ordering, Menami/TextOrder/Ainisa/Ordr DM agents, OrderPost post→order links, Seekadu reservations, Moast Shopify UGC widgets, Seekeasy/Beebz creator discovery, or content-only AI Reels (Feedo/PlateAI) |
| `sources` | URLs |
| `confidence` | score + teach history |
| `status` | `DRAFT` → owner approve → `QUALIFIED` |

Rules:
- Prefer **KEEP / commission % / quit marketplace / TikTok Shop ~6% referral vs DoorDash 15–30% / effective cost statement-math / menu-markup pad (~20%) / own-your-ordering / dual-run discovery / DoorDash OO·Uber Webshop·Grubhub Direct 0% direct / per-order platform fees ($0.99/$1.90/Otter txn) / first-party % fees (Owner Flex 5% / IG checkout 5%)** language from owners when framing `complaint_thesis` (see `fixtures/tool-hunt/pain-scan-marketplace-keep.json`, `pain-scan-doordash-effective-cost.json`, `pain-scan-tiktok-shop-fee.json`, `pain-scan-menu-markup.json`, `pain-scan-dual-run.json`, `pain-scan-bentobox-per-order.json`, `pain-scan-otter-per-order.json`, `pain-scan-owner-pct-fee.json`, `pain-scan-doordash-online-ordering.json`, `pain-to-sales-keep-girl-goat.json`).
- Optional KEEP$ channel rank: CLI `node scripts/keep-channel-grader.mjs` or MCP `keep_channel_grade` (see `skills/keep-channel-grader.md`). Dogfood: `fixtures/tool-hunt/pain-to-sales-keep-grader-rioja.json`.
- Draft outreach copy may be suggested; **sending** requires approvals MCP.
- Same human/venue across pain agents → merge / link, don't spam duplicate leads.
- Never pitch labor/sales **forecasting** as the Never86 product.
- Output digest: "N new qualified leads for {pain_id}."

**Done when:** `SalesLead` saved and owner notified.

**Active dogfood:** keep-grader→SalesLead across CHI/ATX/MIA/BNA/DEN (`pain-to-sales-keep-grader-girl-goat` + franklin + michaels-genuine + husk + rioja) without Apollo/Mem0.
