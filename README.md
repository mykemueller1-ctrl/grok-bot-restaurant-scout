# Grok Bot — Never86 Agents

Agent configs, skills, routines, and MCP connectors for **Never86**.

**Restaurant Scout job:** find food brands people already love (UGC / chef-driven), onboard them onto Never86, and sell via TikTok/Instagram buy-now — not DoorDash-style marketplaces.

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

Silos include **7shifts, Restaurant365, MarginEdge, xtraCHEF, Crunchtime, MarketMan** — plus HotSchedules, Harri, Olo, ChowNow, Otter, Punchh, OpenTable, Resy, and dozens more.

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

Wiring manifest: `stack/wiring.json`. Self-contained API: `services/pain-leads-api/`. Operator playbook: `docs/OPERATOR.md`.

## Deploy (Cloudflare — preferred)

Phone guide: **`docs/CLOUDFLARE.md`**. Script: `bash scripts/cloudflare-deploy.sh` with `CLOUDFLARE_API_TOKEN`.

Worker + D1 live under `services/pain-leads-api/` (`src/worker/`, `wrangler.toml`, `migrations/`).

## Codex Cloud + GitHub

- `AGENTS.md` — instructions Codex loads automatically
- `docs/CODEX-CLOUD.md` — connect ChatGPT Codex → this GitHub repo (phone OK)
- `stack/github-secrets.manifest.json` — secret **names** for GitHub Actions + Codex (values never in git)
- `scripts/codex-cloud-setup.sh` — Codex Cloud environment setup script

## Toast labor + product mix

Operator exports: Schedule & Labor **Time Entries** + Menu Sales **Item Selection Details** (product mix → SKUs). Map + parse: `docs/TOAST-REPORTS.md`, `scripts/parse-toast-reports.mjs`, `fixtures/toast/`.

## Report-ops swarm (parent / teacher / subs)

**18 agents** that own every sales/labor/inventory report dump (CSV, Excel, PDF):

```bash
python3 agent/report-ops/build_report_swarm.py
```

| Role | Count | Path |
| --- | --- | --- |
| Teacher | 1 | `agent/report-ops/teacher.json` |
| Parents (Labor, Sales, Inventory) | 3 | `agent/report-ops/parents/` |
| Subs (Time Entries, Item Selection, Z-Report, Par, …) | 11 | `agent/report-ops/subs/` |
| Venue scouts (Grill, Taco Bamba, CTAP) | 3 | `agent/report-ops/venues/` |

Holy grail inbox: **Mike Mueller Gmail** — Kristen → Grill + Taco Bamba Excel/CSV. CTAP Drive indexed under `fixtures/toast/drive-ctap-index.json`. Courser pack: `fixtures/toast/courser/`. ICP scale (owner 1–5 vs area-leader vs CFO/CEO): `docs/ICP-SCALE.md`. Routine: `routines/report-ops-daily.json`.

### Secure venue portals

Each house gets its own door and data boundary (`docs/VENUE-PORTALS.md`):

| Venue | Status |
| --- | --- |
| Community Tap & Pizza | Live secure demo — Myke / Kenzy / Tom |
| Taco Bamba | Live secure multi-unit — System + area leaders |
| The New American Grill | Ready after Community — Kristen packs staged |

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
node services/portal-gateway/src/server.mjs
# http://127.0.0.1:5174/
```

CTAP seats detail: `docs/CTAP-SEATS.md`. Security: `docs/PORTAL-SECURITY.md`. Isolation CI: `python3 scripts/validate-portal-isolation.py`.

## Setup

See `SETUP.md`.

Sibling repo: `restaurant-social-commerce-engine` (the API + dashboard the bot talks to).
