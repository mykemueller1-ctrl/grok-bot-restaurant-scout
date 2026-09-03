# Never86 pain-leads API — LIVE

**Base URL:** `https://never86-pain-leads.vercel.app`

| Check | Path |
| --- | --- |
| Health | `GET /health` |
| MCP discovery | `GET /mcp` |
| Lead shop | `POST /mcp/leads` |
| Sources | `POST /mcp/sources` (same handler) |
| Approvals | `POST /mcp/approvals` (same handler) |

Auth: `Authorization: Bearer $MCP_API_TOKEN`

Grok Bot secrets (already resolved into `stack/resolved-secrets.json` by agent):

- `COMMERCE_ENGINE_URL` = `https://never86-pain-leads.vercel.app`
- `COMMERCE_ENGINE_TOKEN` / `LEAD_SHOP_TOKEN` / `COMPLAINT_SOURCES_TOKEN` / `APPROVALS_TOKEN` = same MCP token

## Notes

- Deployed via Vercel MCP from cloud agent — **no laptop required**.
- Persistence is warm-instance memory until Supabase unpaid invoices are cleared (then Postgres + Prisma).
- Render Blueprint (`render.yaml`) remains the durable path once Render MCP auth works.
- Tunnel fallback during session: localtunnel (ephemeral).
