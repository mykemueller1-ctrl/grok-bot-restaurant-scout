# Never86 — Grok Bot Restaurant Scout

Instructions for Codex Cloud / Cursor / any coding agent working in this repo.

## Mission

Wire and operate Never86 restaurant GTM agents. Operator (Myke) gives direction and teaches labels. Agents own API wiring, deploy config, and swarm imports — do not ask the operator to paste MCP URLs or hand-connect Postgres.

## Layout

| Path | Purpose |
| --- | --- |
| `agent/restaurant-scout.json` | Love → buy-now scout |
| `agent/pain-shoppers/` | 238 vendor pain-shopper agents |
| `agent/report-ops/` | Parent / teacher / sub agents for labor · sales · inventory reports |
| `agent/tool-hunt/` | Beyond the Hunt — Cursor/memory/skills/competitor tooling scout |
| `mcp/` | MCP connector definitions (env-based URLs) |
| `services/pain-leads-api/` | Self-contained Fastify MCP API |
| `stack/wiring.json` | Canonical URLs, secrets map, import waves |
| `stack/tooling-ledger.json` | What we use vs competitors (agents, memory, skills, MCP) |
| `render.yaml` | Render Blueprint (Postgres + API) |
| `docs/OPERATOR.md` | Operator playbook |
| `docs/CODEX-CLOUD.md` | GitHub ↔ Codex Cloud connect steps |
| `docs/TOAST-REPORTS.md` | Toast labor + product-mix → SKU map |
| `docs/TOOL-HUNT.md` | Continuous best-in-vertical tooling research |
| `docs/DESKTOP-UNLOCKS.md` | Mem0/Context/Automation/Composio clicks |
| `docs/CTAP-SEATS.md` | CTAP sold seats + front-door login |

## Build / validate

```bash
# Swarm still 238
python3 agent/pain-shoppers/build_swarm.py

# Report-ops parents + teacher + subs
python3 agent/report-ops/build_report_swarm.py

# API typecheck/build (needs DATABASE_URL for prisma generate in some envs)
cd services/pain-leads-api && npm install && npm run build

# Resolve MCP secret bundle (uses NEVER86_API_URL + MCP_API_TOKEN)
node scripts/resolve-mcp-config.mjs

# Tooling ledger + Beyond the Hunt findings
node scripts/validate-tooling-ledger.mjs
node scripts/run-tool-hunt-week.mjs
```

## Secrets (never commit)

Required runtime names are listed in `stack/github-secrets.manifest.json`.

- Put live values only in **GitHub Actions secrets**, **Codex Cloud environment secrets**, or **Render env groups**.
- Never commit tokens, `.env`, or `stack/resolved-secrets.json`.
- If a token was pasted into chat or a screenshot, revoke it and mint a new one.

## Deploy preference

1. **Primary: Cloudflare Workers + D1** — `docs/CLOUDFLARE.md` + `bash scripts/cloudflare-deploy.sh`
2. Needs env `CLOUDFLARE_API_TOKEN` (fresh; never from a screenshot) + account `722e0fcc05092bb2333396735d644d44`
3. Then: `NEVER86_API_URL=… MCP_API_TOKEN=… node scripts/resolve-mcp-config.mjs`
4. Import wave 1: `./scripts/import-wave-1.sh` (Grok Bot desktop)

Fallback only: Render Blueprint (`render.yaml`). Do not use Supabase unless the operator explicitly asks.

## Do not

- Commit API tokens or Cloudflare tokens
- Ask the operator to manually wire `DATABASE_URL` when Blueprint `fromDatabase` works
- Expand beyond wave 1 imports until teach quality is stable
- Change GTM agent purpose away from Never86 love → buy-now / pain → sales-lead
- Skip weekly tooling frontier scans when AI platforms are shipping weekly

## Done means

- Stack validates in CI (`validate-stack.yml`)
- `AGENTS.md` + `docs/CODEX-CLOUD.md` present for Codex Cloud
- Secrets manifest matches what GitHub / Codex / Render expect
- Health endpoint documented; MCP paths match `stack/wiring.json`
- `stack/tooling-ledger.json` validates; Beyond the Hunt routine + skills present
