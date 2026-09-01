# Grok Bot — Never86 Agents

Agent configs, skills, routines, and MCP connectors for Never86.

## Restaurant Scout

Shoppable content scout — love-proven food brands → buy-now scripts.

- `agent/restaurant-scout.json`
- Skills: `morning-scan`, `script-draft`, `catalog-sync`
- Routine: `routines/daily.json`

## Pain Shoppers (per-vendor sales hunters)

Agents that **shop customers** by scanning TikTok / Reddit / Facebook groups / forums for operator complaints, then teach → recurse-learn → sales lead forms.

### Top 10 POS (one agent each)

| # | File | Vendor |
| --- | --- | --- |
| 1 | `agent/pain-shoppers/pos/toast.json` | Toast |
| 2 | `agent/pain-shoppers/pos/square.json` | Square for Restaurants |
| 3 | `agent/pain-shoppers/pos/clover.json` | Clover |
| 4 | `agent/pain-shoppers/pos/lightspeed.json` | Lightspeed Restaurant |
| 5 | `agent/pain-shoppers/pos/aloha.json` | NCR Aloha |
| 6 | `agent/pain-shoppers/pos/touchbistro.json` | TouchBistro |
| 7 | `agent/pain-shoppers/pos/spoton.json` | SpotOn |
| 8 | `agent/pain-shoppers/pos/par-brink.json` | PAR Brink |
| 9 | `agent/pain-shoppers/pos/oracle-micros.json` | Oracle MICROS / Simphony |
| 10 | `agent/pain-shoppers/pos/skytab.json` | SkyTab (Shift4) |

### Silo vendors (one agent each)

| File | Vendor | Domain |
| --- | --- | --- |
| `silo/7shifts.json` | 7shifts | scheduling / labor |
| `silo/hotschedules.json` | HotSchedules | scheduling / labor |
| `silo/harri.json` | Harri | scheduling / labor |
| `silo/homebase.json` | Homebase | scheduling / labor |
| `silo/wheniwork.json` | When I Work | scheduling / labor |
| `silo/restaurant365.json` | Restaurant365 | accounting / ops |
| `silo/marginedge.json` | MarginEdge | COGS / AP |
| `silo/extrachef.json` | xtraCHEF | COGS / AP |
| `silo/crunchtime.json` | Crunchtime | enterprise ops |
| `silo/marketman.json` | MarketMan | inventory |
| `silo/ctuit.json` | CTUIT / Compeat | inventory |
| `silo/orderly.json` | Orderly | inventory |
| `silo/bevspot.json` | BevSpot | beverage inventory |
| `silo/bluecart.json` | BlueCart | procurement |
| `silo/upserve.json` | Upserve | legacy ops |

### Thematic (cross-vendor)

`agent/pain-shoppers/thematic/` — labor, cost, drift, marketplace-3p

### Source of truth + codegen

- `agent/pain-shoppers/vendors/catalog.json` — vendors, aliases, seed queries
- `agent/pain-shoppers/generate_agents.py` — regenerates POS/silo JSON + `family.json`
- `agent/pain-shoppers/family.json` — index of all shopper agents

### Shared loop

`pain-complaint-scan` → `lead-shop-enrich` → `teach-label` → `vendor-complaint-learn` → `recurse-learn` → `sales-lead-form`

**Shop** = identity + complaint context. **Teach** = your keep/reject labels. **Learn at scale** = per-vendor phrase/alias banks. **Automate** = sales lead forms (outreach still approval-gated).

Routine: `routines/pain-shoppers-daily.json`

## MCP

- `mcp/commerce-engine.json`, `social-connector.json`, `complaint-sources.json`, `lead-shop.json`, `approvals.json`

## Setup

See `SETUP.md`. Sibling: `restaurant-social-commerce-engine`.
