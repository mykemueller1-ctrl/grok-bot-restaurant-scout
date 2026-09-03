# Never86 stack — automated wiring

Operator playbook: **`docs/OPERATOR.md`**. You do not hand-connect APIs.

## Self-contained in this repo

| Asset | Purpose |
| --- | --- |
| `services/pain-leads-api/` | Fastify MCP API (leads, sources, approvals) |
| `render.yaml` | Postgres + API — one Blueprint deploy |
| `stack/wiring.json` | Canonical URLs, secrets map, import waves |
| `scripts/generate-secrets.mjs` | Token + Grok Bot secret bundle |
| `scripts/resolve-mcp-config.mjs` | Resolved MCP URLs for import |
| `scripts/import-wave-1.sh` | Priority agent import list |

## Cloud agent deploy sequence

1. **Render Blueprint** — connect repo → apply `render.yaml`
2. **Health** — `GET https://<service>/health`
3. **Secrets** — copy `MCP_API_TOKEN` from Render env group `never86-grok-bot-stack`
4. **Resolve** — `NEVER86_API_URL=https://... MCP_API_TOKEN=... node scripts/resolve-mcp-config.mjs`
5. **Grok Bot** — import secrets from `stack/resolved-secrets.json`
6. **Agents** — wave 1 via `./scripts/import-wave-1.sh`

## MCP endpoints (live after deploy)

| Connector | Path |
| --- | --- |
| lead-shop | `POST /mcp/leads` |
| complaint-sources | `POST /mcp/sources` |
| approvals | `POST /mcp/approvals` |
| commerce-engine (legacy) | `POST /mcp` |

Auth: `Authorization: Bearer $MCP_API_TOKEN`

## Sibling repos (optional full commerce)

| Repo | Role |
| --- | --- |
| `never86` | never86.ai site + briefing cron |
| `restaurant-social-commerce-engine` | TikTok Shop / IG dashboard + full commerce MCP |

Branch `cursor/wire-mcp-and-deploy-bc19` on commerce-engine adds pain-lead Prisma models to the monorepo API when bot push access is granted.

## Merged agent work (main)

- PR #3 — Restaurant Scout Never86 purpose
- PR #4 — 238 pain-shopper swarm
- PR #5 — MCP env-based URLs
- PR #6 — this deploy checklist (superseded by automated wiring above)

## Grok Bot secrets (auto-resolved)

All use the same token from Render `generateValue`:

- `COMMERCE_ENGINE_URL` → API host
- `COMMERCE_ENGINE_TOKEN`, `LEAD_SHOP_TOKEN`, `COMPLAINT_SOURCES_TOKEN`, `APPROVALS_TOKEN` → `MCP_API_TOKEN`
