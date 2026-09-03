# Never86 — Operator playbook

You give mindset and direction. Agents wire the stack.

## What runs where

| Piece | Where | Repo path |
| --- | --- | --- |
| Pain lead API + MCP | Render (Blueprint) | `services/pain-leads-api/` + `render.yaml` |
| 238 pain-shopper agents | Grok Bot desktop | `agent/pain-shoppers/` |
| Wiring manifest | This repo | `stack/wiring.json` |
| Commerce monorepo (TikTok/IG) | Vercel + Render | `restaurant-social-commerce-engine` (sibling) |
| never86.ai site | Vercel | `never86` (sibling) |

## Your job (operator)

1. **Say what to hunt** — vendor, complaint angle, ICP (already encoded in each agent JSON).
2. **Teach labels** — keep / reject / wrong_pain when agents surface leads.
3. **Approve outreach** — nothing sends without your OK via approvals MCP.
4. **Steer waves** — wave 1 POS + marketplaces + core silos first; expand when quality holds.

You do **not** connect APIs, paste MCP URLs, or hand-wire Postgres.

## Cloud agent job (already in repo)

1. Connect Render Blueprint to `grok-bot-restaurant-scout` (one dashboard click when auth allows).
2. Read `MCP_API_TOKEN` + service URL from Render env.
3. Run `node scripts/resolve-mcp-config.mjs` → `stack/resolved-secrets.json`.
4. Import Grok Bot secrets from that file.
5. Import wave 1 agents: `./scripts/import-wave-1.sh`.

## Daily loop (238 agents)

```
pain-complaint-scan → lead-shop-enrich → teach-label → vendor-complaint-learn → recurse-learn → sales-lead-form
```

Routine: `routines/pain-shoppers-daily.json`

## Teach → swarm learning

Each label updates vendor phrase banks (`VendorLearnedBank`). Wrong-pain routes sharpen routing. Sales lead forms auto-fill faster over time.

## Add vendors

Edit `agent/pain-shoppers/build_swarm.py` or `vendors/catalog.json` → `python3 agent/pain-shoppers/build_swarm.py` → import new JSON.

## Codex Cloud (GitHub)

Phone steps: **`docs/CODEX-CLOUD.md`**. Repo already has `AGENTS.md` + setup script. You only install the Codex GitHub App and paste secrets into GitHub/Codex UIs — never into chat.

## If Render Blueprint is not connected yet

The API code is self-contained in this repo. A cloud agent with Render MCP auth runs:

- `render.yaml` → Postgres + `never86-pain-leads-api`
- Sets env from `fromDatabase` + `generateValue: true` for token
- No manual DATABASE_URL wiring

Fallback: sibling `restaurant-social-commerce-engine` branch `cursor/wire-mcp-and-deploy-bc19` has the full commerce API when that repo grants bot write access.
