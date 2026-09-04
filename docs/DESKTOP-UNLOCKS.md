# Desktop unlocks — Beyond the Hunt

Close **Mem0** + **Context** so the best-in-vertical hunt can run fully in cloud.

Project MCP stubs: **`.cursor/mcp.json`** (`mem0` + `context` URLs).

## 1. Mem0 (required)

| Path | How |
| --- | --- |
| Desktop OAuth | Settings → MCP → mem0 → Authenticate (`https://mcp.mem0.ai/mcp`) |
| Headless / cloud | `MEM0_API_KEY` (`m0-…`) from https://app.mem0.ai/dashboard/api-keys → cloud/Codex secrets |

Verify: `node scripts/mem0-smoke.mjs`  
After first READY: `node scripts/mem0-import-tool-hunt-memory.mjs` (loads `stack/tool-hunt-memory.md`)

## 2. Context (required)

| Path | How |
| --- | --- |
| Desktop OAuth (MCP tools) | Settings → MCP → context → Authenticate (`https://mcp.context.dev/mcp`) |
| Headless / cloud (REST research) | `CONTEXT_DEV_API_KEY` (`ctxt_secret_…`) from https://context.dev dashboard → secrets |

Verify: `node scripts/context-search.mjs "Owner.com restaurant AI"`

Until keys land, Composio `COMPOSIO_SEARCH_WEB` stays the Active research fallback.

## 3. Cursor Agents

- Sync Skills for Cloud Agents = on  
- Automation + memories: https://cursor.com/automations  
  Paste pack: `docs/CURSOR-AUTOMATION-TOOL-HUNT.md` (`node scripts/print-tool-hunt-automation.mjs`)

## Verify both

```bash
node scripts/check-auth-gaps.mjs   # want STATUS: READY
node scripts/unlock-beyond-the-hunt.mjs   # after READY: Mem0 import + Context smoke
```

Reply in this cloud agent when secrets/OAuth are done.
