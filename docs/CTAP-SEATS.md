# CTAP seats + secure portal

Community Tap & Pizza (Fort Dodge) is the living lab for **Never 86'd Action Shift**.

**Canonical portal:** `fixtures/portals/community-pizza/` (see `docs/VENUE-PORTALS.md`).

While invoice OCR wires in parallel, this pack locks the **sold seats** and the **secure front-door login**.

**As of: Fri 2026-09-04.** Live book is the open Sun–Sat week that contains today — not a finished week, and not the Sep 2025 Drive pack.

## Sold seats (demo close 2026-09-04)

| Seat | SKU | Price | Assignee | House |
| --- | --- | --- | --- | --- |
| Owner | `action-shift-owner` | free | **Mychael Mueller** | ops |
| Manager FOH | `manager-foh` | paid | **Kenzy Thompson** | front |
| Manager BOH | `manager-boh` | paid | **Tom Dorothy** | back |

Ledger: `fixtures/portals/community-pizza/seats.json`  
Schema: `schemas/ctap-seat.json`

Routing (Action Shift): liquor / beer / FOH labor → Kenzy. Food / BOH labor → Tom. Prime / 3P / two-house → Myke.

## Front door (enterprise secure)

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
node services/portal-gateway/src/server.mjs
# open http://127.0.0.1:5174/community-pizza/login.html
# demo house code: see docs/PORTAL-SECURITY.md
```

Pick a sold seat → walk into the desk with all three seats lit and the live book through **Fri 9/4 only**. Community data only — server boundary blocks Taco Bamba and Grill.

## Sales book (honest calendar)

`fixtures/portals/community-pizza/data/historical-sales.json`

| Book | Window | Status |
| --- | --- | --- |
| **Live** | **2026-08-31 → 2026-09-06** (contains **2026-09-04**) | In progress — through Fri only. No invented Sat/Sun closes. |
| Prior invoice week | 2026-08-23 → 2026-08-29 | Last complete Sun–Sat before live book |
| Sample Zs | 2026-07-15 / 2026-07-16 | Recent PDQ summaries on file |
| Archive (prior year) | 2025-09-14 → 2025-09-20 | Drive pack *Ctap Weekly sales 9-14-25 to 9-20-25* — **not** this week |

Invoice photo OCR stays with the parallel ICP invoice agent — do not invent totals from HEICs here.

## Venue scout

`agent/report-ops/venues/community-pizza.json` points at this pack (`secure_portal`, `seats_ledger`, `front_door`, `historical_sales`).
