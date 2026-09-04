# ICP scale: owner 1–5 vs area-leader vs CFO/CEO

Never86 must not treat “multi-unit” as one buyer. Report packs and pain language change by **who holds the clipboard / Excel**.

Ground truth in this repo:

| Pack | ICP | Evidence |
| --- | --- | --- |
| CTAP kitchen labor cards + paper weekly schedules + distributor invoices | **Owner-operator / 1-unit (→ early 1–5)** | Hand-filled station cards, Calendarpedia schedules, Hy-Vee / Hopkins / FT Dodge slips |
| Grill Toast Time Entries + Labor Breakdown + Sales Summary | **Single-unit digital owner/GM** | One restaurantGuid day: labor 35.56%, SPLH $35.17, net $3,408 |
| Taco Bamba Sales Labor Report (MP) v5 | **Scaled multi-unit + area leaders** | Daily/WTD boards by Location under John / Red / Travis / Yas → System |

---

## Tier A — Single-owner 1–5 (owner still in the building)

**Who buys:** Owner (sometimes spouse/GM). No CFO. May hire first area sense around unit 3–5.

**How they run labor/sales:**
- Paper **Kitchen Labor Cards** (AM/PM × station: Pizza 1–3, Fry, Oven, Drivers)
- Handwritten **weekly schedules** (open→close, R/O, station letters W/B/P)
- POS Z / sales summary when they remember to export
- Distributor invoices + Hy-Vee runs as the “inventory system”
- Petty cash / payout slips (Misc / Bread / Beverage / Food)
- **As-is weekly AP:** phone snaps of paper slips (rotated, stapled payout↔receipt) — see `fixtures/toast/ctap-physical/normalized/weekly-invoice-photo-pack-2026-08.json`
- **Truth:** most distributors already **email** invoices; the human still prints / photographs / staples instead of routing email into a system

**Pains (survival → early scale):**
- Owner burnout; cash-flow and food/labor gut feel ([MarketStreet 2–5 unit survey](https://www.businesswire.com/news/home/20260217728317/en/MarketStreet-Releases-Second-National-Research-Report-on-Independent-Restaurants-Identifies-Widening-Capability-Gap-Between-Survival-and-Scale))
- Second unit adds ~60% revenue capacity but ~130% ops surface ([Tableview](https://www.tableview.com/blog/multi-location-restaurant-management/))
- Labor % drift when each GM “runs their own labor” without group targets ([Tableview](https://www.tableview.com/blog/multi-location-restaurant-management/))
- Independents often ~3–5% store margins; labor mid-30%s FSR ([Factura stats](https://factura.ai/restaurant-industry-profit-margin-statistics/))
- **Human AP grind:** photographing invoices every week instead of a repeatable email → system loop

**Report agents that matter:** `time-entries`, `labor-summary`, `bar-kitchen-schedule`, `kitchen-labor-card`, `paper-weekly-schedule`, `item-selection`, `sales-summary`, `liquor-beer-par`, `vendor-invoice`

**Never86 wedge:** Coach operators to **forward email invoices** into Never86 (repeatable intake). Kill the photo/staple loop. Store cash runs stay exceptional. Daily “oh shit” dollars — not enterprise BI.

---

## Tier B — Multi-unit with **Area / District Leaders** (scale problems)

**Who buys:** Director of Ops / Area Leader (often oversees ~5–15 stores). Owner/CEO above them. GMs below.

**How they run:**
- Standardized Daily / WTD sales & checks boards (CY vs PY vs FCST)
- Region rollups (John’s Region, Red’s Region…) then System
- Field cadence: daily sales+labor, weekly scorecards, unit visits ([Access Point](https://www.accesspointgroup.com/how-to-scale-multiunit-restaurants/))
- Hiring multi-unit manager commonly around 3–5 locations ([Sage](https://www.sage.com/en-us/blog/multi-unit-restaurant-management/))

**Pains at scale:**
- Margin lost *between* locations: coding inconsistency, labor at wrong grain, delivery reconcile, inventory variance absorbed ([Tris](https://wearetris.com/2026/05/01/multi-unit-restaurant-margin-loss-between-locations/))
- 8-pt labor swings between GMs on same brand ([FORCS](https://www.useforcs.com/blog/multi-unit-restaurant-accounting-guide/))
- Must coach GMs, not run shifts — different skill than single-unit ([Operandio](https://operandio.com/multi-unit-management/))
- Five spine reports: sales vs forecast, prime cost/unit, comps/discounts, guest YoY, exceptions ([Tableview](https://www.tableview.com/blog/multi-location-restaurant-management/))

**Report agents:** `multi-unit-sales-labor`, `sales-summary` (per store), `labor-summary` (cross-store), `weekly-sales-pack`

**Never86 wedge:** Exception + variance by store/region for area leaders — not another 30 unread tabs.

---

## Tier C — **CFO / CEO** enterprise finance (portfolio)

**Who buys:** CFO, Controller, CEO/COO of 10–50+ (or PE-backed). Area leaders are users; finance owns the stack.

**How they run:**
- Location-level P&Ls weekly, identical COA ([Tris](https://wearetris.com/2026/05/01/multi-unit-restaurant-margin-loss-between-locations/), [FORCS](https://www.useforcs.com/blog/multi-unit-restaurant-accounting-guide/))
- Prime cost, contribution, SSS, labor by role/daypart across dozens of units ([Solver](https://www.solverglobal.com/blog/restaurant-financial-planning-and-reporting-for-multi-unit-operators))
- ERP + POS + labor integrations; hate stale Excel consolidations ([Sage Intacct / Charcoal CFO story](https://www.sage.com/en-us/blog/restaurant-prime-costs/))

**Pains:**
- Days to assemble consolidated view → already stale ([Solver](https://www.solverglobal.com/blog/restaurant-financial-planning-and-reporting-for-multi-unit-operators))
- Manual flash reports; no real-time variance alerts
- Corporate overhead vs four-wall EBITDA; need institutional-grade reporting by ~10+ units ([FranchiseIQ scale stages](https://fddiq.com/blog/multi-unit-franchise-operator-guide))

**Report agents:** rollups of all of the above + finance exports (GL, AP, inventory variance)

**Never86 wedge:** Faster “time to leak dollar” across the portfolio; action layer for ops — not replace R365/Intacct overnight.

---

## Management hire ladder (cheat sheet)

| Units | Typical structure |
| --- | --- |
| 1–3 | Owner manages GMs + back office |
| 4–6 | First district/area manager |
| 7–10 | Dir of Ops; HR/training formalizes |
| 10+ | CFO/COO/HR — full corporate |

Source pattern: [FranchiseIQ](https://fddiq.com/blog/multi-unit-franchise-operator-guide), [Franchise Sales tiers](https://www.franchisorsales.org/multi-unit-franchise-operators/)

---

## Teach labels for ICP

When Myke labels a pack, also tag:

`icp_tier`: `owner_1_5` | `area_leader` | `cfo_ceo`

Wrong-tier = `wrong_icp` (reuse teach-label). Sub-agents refuse to pitch enterprise dashboards to a kitchen labor card buyer.
