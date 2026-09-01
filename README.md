# Grok Bot — Never86 Agents

Agent configs, skills, routines, and MCP connectors for **Never86**.

## Restaurant Scout

Shoppable content scout — love-proven food brands → buy-now scripts.

- `agent/restaurant-scout.json`
- Skills: `morning-scan`, `script-draft`, `catalog-sync`
- Routine: `routines/daily.json`

## Pain Shoppers — SWARM

**238 agents** that shop Never86 buyers by hunting operator complaints across the restaurant tech stack. One agent per vendor. Teach → recurse-learn → sales lead forms.

| Lane | Count | Path |
| --- | --- | --- |
| POS | 50 | `agent/pain-shoppers/pos/` |
| Silo (labor, inventory, accounting, ordering middleware, loyalty, KDS, …) | 104 | `agent/pain-shoppers/silo/` |
| Marketplace 3P | 22 | `agent/pain-shoppers/marketplace/` |
| Ordering | 12 | `agent/pain-shoppers/ordering/` |
| Loyalty | 12 | `agent/pain-shoppers/loyalty/` |
| Reservations / waitlist | 10 | `agent/pain-shoppers/reservations/` |
| Payments | 12 | `agent/pain-shoppers/payments/` |
| Reputation | 8 | `agent/pain-shoppers/reputation/` |
| Thematic (cross-vendor) | 8 | `agent/pain-shoppers/thematic/` |

Top POS priority still ranked 1–10 (Toast → SkyTab); the other 40 POS agents cover Revel, Qu, Heartland, Aloha-adjacent legacy, kiosk, international, etc.

Silos include what you called out — **7shifts, Restaurant365, MarginEdge, xtraCHEF, Crunchtime, MarketMan** — plus HotSchedules, Harri, Olo, ChowNow, Otter, Punchh, OpenTable, Resy, and dozens more.

### Source of truth + codegen

```bash
python3 agent/pain-shoppers/build_swarm.py
```

- `vendors/catalog.json` — full vendor map
- `family.json` — index + agent_count
- `build_swarm.py` — regenerates every agent JSON

### Shared loop

`pain-complaint-scan` → `lead-shop-enrich` → `teach-label` → `vendor-complaint-learn` → `recurse-learn` → `sales-lead-form`

Routine: `routines/pain-shoppers-daily.json`

## MCP

`commerce-engine`, `social-connector`, `complaint-sources`, `lead-shop`, `approvals`

## Setup

See `SETUP.md`.
