# Grok Bot — Never86 Setup

## Shared

1. Download Grok Bot desktop app, sign in with your Cursor account.
2. Secrets → store tokens: commerce, social, lead-shop, complaint-sources, approvals.
3. Agent Computer → browser takeover → sign into TikTok + Instagram (+ Reddit / Facebook). Session persists.

## Restaurant Scout

1. Import `agent/restaurant-scout.json`.
2. Plugins → `social-trends` + `restaurant-commerce-engine` + `approvals`.
3. Import `routines/daily.json`. Test once, enable.

## Pain Shoppers

### Import vendors (many agents)

1. If you changed the catalog, regenerate:
   ```bash
   python3 agent/pain-shoppers/generate_agents.py
   ```
2. Create one Grok Bot agent per file under:
   - `agent/pain-shoppers/pos/` (top 10 POS)
   - `agent/pain-shoppers/silo/` (silo vendors)
   - `agent/pain-shoppers/thematic/` (cross-cutting pains)
3. Plugins on each → `complaint-sources` + `social-trends` + `lead-shop` + `approvals`.
4. Attach skills: `pain-complaint-scan`, `lead-shop-enrich`, `teach-label`, `vendor-complaint-learn`, `recurse-learn`, `sales-lead-form`.
5. Import `routines/pain-shoppers-daily.json`.

### Teach mode (week one+)

Agents shop complaints and ping teach batches **per vendor**. Label:

- `keep` / `reject` / `wrong_pain` / `wrong_icp` / `needs_research`
- one-line notes ("this is real Toast lock-in hate")

That feedback builds per-vendor alias + phrase banks so complaint ID improves at scale. When keep-rate is solid, unlock auto-fill of `SalesLead`. Outreach still needs approval.

### Adding a vendor

1. Add entry to `agent/pain-shoppers/vendors/catalog.json` (`pos_top10` or `silo_vendors`).
2. Run `python3 agent/pain-shoppers/generate_agents.py`.
3. Import the new JSON into Grok Bot.

Reference: https://cursor.com/help/grok-bot/getting-started
