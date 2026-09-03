# Deploy Never86 API on Cloudflare (not Supabase / not Render)

Phone OK. One fresh token → agent deploys the rest.

## 1. Create a fresh Cloudflare API token

1. Open [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → template **Edit Cloudflare Workers** (must say **Edit**, not Read):
   - Account → **Workers Scripts**: **Edit**
   - Account → **D1**: **Edit**
   - Account → **Account Settings**: Read
   - Do **not** use an R2-only token or a Read-everything token — deploy will auth-fail with code 10000
3. Account resources → include account `722e0fcc05092bb2333396735d644d44`
4. Create → **copy the token once**

Do **not** reuse a token from a screenshot or old chat. If it was shown before, roll it.

## 2. Hand the token to the Cursor cloud agent

Reply in the agent chat with only:

```text
CLOUDFLARE_API_TOKEN=paste_here
```

(Or add `CLOUDFLARE_API_TOKEN` as a Cursor / cloud environment secret and say “deploy cloudflare”.)

## 3. What the agent runs

```bash
export CLOUDFLARE_API_TOKEN=…
export CLOUDFLARE_ACCOUNT_ID=722e0fcc05092bb2333396735d644d44
bash scripts/cloudflare-deploy.sh
```

That script:

1. Creates D1 `never86-pain-leads`
2. Applies `services/pain-leads-api/migrations/`
3. Sets Worker secret `MCP_API_TOKEN`
4. Deploys Worker `never86-pain-leads-api`
5. Writes `stack/cloudflare-deployed.json` (gitignored) with URL + token for Grok Bot import

## Endpoints (after deploy)

| Path | Use |
| --- | --- |
| `GET /health` | smoke |
| `POST /mcp/leads` | pain / sales / teach |
| `POST /mcp/sources` | complaint search hints |
| `POST /mcp/approvals` | approval queue |

Auth: `Authorization: Bearer $MCP_API_TOKEN`
