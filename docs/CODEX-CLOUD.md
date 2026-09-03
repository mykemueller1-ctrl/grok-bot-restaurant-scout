# GitHub ↔ Codex Cloud (phone-friendly)

Your computer is optional. Do these once on your phone.

## What this repo already has

- Pain-leads API + Render Blueprint (`services/pain-leads-api/`, `render.yaml`)
- Secret name list: `stack/github-secrets.manifest.json`
- Codex instructions: `AGENTS.md`
- Codex setup script: `scripts/codex-cloud-setup.sh`

You are **not** inventing an API wiring scheme. Agents already defined it.

## A. Connect Codex Cloud to this GitHub repo

1. Open [chatgpt.com/codex](https://chatgpt.com/codex) (ChatGPT Plus/Pro/Business — cloud needs the ChatGPT login, not an API key).
2. **Settings → Environments → New Environment**.
3. Connect GitHub → install the **Codex GitHub App** on `mykemueller1-ctrl` (or only `grok-bot-restaurant-scout`).
4. Select repo **`mykemueller1-ctrl/grok-bot-restaurant-scout`**.
5. Setup script:

```bash
bash scripts/codex-cloud-setup.sh
```

6. Save. You can later `@codex` on issues/PRs.

## B. Put API secrets in GitHub (not in chat)

1. Open [Actions secrets](https://github.com/mykemueller1-ctrl/grok-bot-restaurant-scout/settings/secrets/actions).
2. Add names from `stack/github-secrets.manifest.json`:
   - `MCP_API_TOKEN`
   - `NEVER86_API_URL`
   - `CLOUDFLARE_ACCOUNT_ID` = your Cloudflare account id
   - `CLOUDFLARE_API_TOKEN` = a **fresh** token (see security note)
   - `OWNER_EMAIL` = `ops@never86.ai` (or yours)

3. In Codex Environment → Secrets, add the same names Codex needs for setup (`MCP_API_TOKEN`, `NEVER86_API_URL`, optional Cloudflare).

## C. Deploy the API (Render)

1. [Render Dashboard](https://dashboard.render.com) → Blueprints → New → connect this GitHub repo.
2. Apply `render.yaml` (creates Postgres + `never86-pain-leads-api` + generates `MCP_API_TOKEN`).
3. Copy the service URL → GitHub secret `NEVER86_API_URL`.
4. Copy `MCP_API_TOKEN` from env group `never86-grok-bot-stack` → GitHub + Codex secrets.

When Render MCP is authorized for a Cursor cloud agent, that agent can do C without you.

## Security — Cloudflare token from a screenshot

If a Cloudflare API token was shown in a screenshot or chat:

1. Cloudflare → My Profile → API Tokens → **Roll / Delete** that token.
2. Create a new token with only the scopes you need.
3. Paste the new value **only** into GitHub Actions secrets and/or Codex Environment secrets.
4. Never paste tokens into Issues, PR comments, or agent chat again.

## Check it worked

- GitHub → Actions → **Validate Never86 stack** is green on `main`.
- Codex Environment for this repo exists and setup script succeeds.
- `GET $NEVER86_API_URL/health` returns ok after Render deploy.
