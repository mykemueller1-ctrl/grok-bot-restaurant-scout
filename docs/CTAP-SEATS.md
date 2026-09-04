# CTAP seats + front door

Community Tap & Pizza (Fort Dodge) is the living lab for **Never 86'd Action Shift**.

While invoice OCR wires in parallel, this pack locks the **sold seats** and the **front-door login**.

## Sold seats (demo close 2026-09-04)

| Seat | SKU | Price | Assignee | House |
| --- | --- | --- | --- | --- |
| Owner | `action-shift-owner` | free | **Mychael Mueller** | ops |
| Manager FOH | `manager-foh` | paid | **Kenzy Thompson** | front |
| Manager BOH | `manager-boh` | paid | **Tom Dorothy** | back |

Ledger: `fixtures/ctap-portal/seats.json`  
Schema: `schemas/ctap-seat.json`

Routing (Action Shift): liquor / beer / FOH labor → Kenzy. Food / BOH labor → Tom. Prime / 3P / two-house → Myke.

## Front door

```bash
python3 -m http.server 5174 --bind 0.0.0.0 --directory fixtures/ctap-portal
# open http://127.0.0.1:5174/login.html
```

`login.html` is the Community Tap & Pizza door. Pick a sold seat → walk into the desk with all three seats lit and the historical sales spine.

## Historical sales

`fixtures/ctap-portal/historical-sales.json`

- Week pack **2025-09-14 → 2025-09-20** (Drive: *Ctap Weekly sales 9-14-25 to 9-20-25*) — week net **$40,274**
- Sample recent Zs **2026-07-15 / 2026-07-16**
- Drive index: `fixtures/toast/drive-ctap-index.json`
- Physical labor / schedule ground truth: `fixtures/toast/ctap-physical/`

Invoice photo OCR stays with the parallel ICP invoice agent — do not invent totals from HEICs here.

## Venue scout

`agent/report-ops/venues/community-pizza.json` points at this pack (`seats_ledger`, `front_door`, `historical_sales`).
