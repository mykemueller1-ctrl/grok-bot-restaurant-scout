# Never86 stack — deploy checklist (night of 2026-09-01)

## Merged to `grok-bot-restaurant-scout` main

- PR #3 — Restaurant Scout Never86 purpose
- PR #4 — 238 pain-shopper agents (swarm)
- PR #5 — MCP URLs use `${COMMERCE_ENGINE_URL}` env vars

## Vercel (you do once — ~3 min)

Your team `myke-muellers-projects` has **no GitHub repos linked yet**. That’s why auto-import failed.

1. [vercel.com/account/settings](https://vercel.com/account/settings) → **Git** → connect GitHub
2. Import **`mykemueller1-ctrl/never86`** → add env from `never86/.env.example` → Deploy
3. Import **`mykemueller1-ctrl/restaurant-social-commerce-engine`** → root **`apps/web`** → Deploy
4. API (`apps/api`) → use **Render** (see `restaurant-social-commerce-engine/docs/DEPLOY.md`)

## Commerce engine MCP (ready locally, needs push)

Branch `cursor/wire-mcp-and-deploy-bc19` in `restaurant-social-commerce-engine` adds:

- `POST /mcp` + `POST /mcp/leads` — Grok Bot tool dispatch
- Prisma: `PainLead`, `SalesLead`, `TeachFeedback`, `VendorLearnedBank`
- `MCP_API_TOKEN` bearer auth
- `docs/DEPLOY.md`

Push failed from cloud agent (403). Re-run in that repo or cherry-pick commit message: *Wire MCP HTTP bridge for Grok Bot agents + pain lead storage*.

## Grok Bot secrets (after API is live)

| Secret | Value |
| --- | --- |
| `COMMERCE_ENGINE_URL` | `https://your-api.onrender.com` |
| `COMMERCE_ENGINE_TOKEN` | same as API `MCP_API_TOKEN` |
| `LEAD_SHOP_TOKEN` | same token |
| `COMPLAINT_SOURCES_TOKEN` | same token (until dedicated search service) |

## Morning

1. Connect Vercel Git
2. Deploy never86 + commerce web
3. Deploy commerce API on Render + `pnpm db:push`
4. Import pain-shopper agents from `agent/pain-shoppers/`
