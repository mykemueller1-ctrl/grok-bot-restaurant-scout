# Desktop unlocks — Beyond the Hunt

Cloud agents **cannot** complete interactive MCP OAuth. These unlocks close the goal’s Mem0/Context auth gaps.

Project MCP stubs (no secrets): **`.cursor/mcp.json`** — open this repo in Cursor Desktop, then Authenticate each server under Settings → Tools & MCP.

## 1. Mem0 (required)

**Option A — Desktop OAuth**  
Settings → MCP → `mem0` → Authenticate (URL `https://mcp.mem0.ai/mcp`)

**Option B — API key (headless / cloud)**  
1. https://app.mem0.ai/dashboard/api-keys → `m0-…`  
2. Add `MEM0_API_KEY` to Cursor cloud environment secrets / Codex (never chat)  
3. `MEM0_API_KEY=… node scripts/mem0-smoke.mjs` must exit 0

## 2. Context.dev (required — OAuth only)

No API-key MCP path. Desktop only:

Settings → Tools & MCP → `context` → Authenticate  
URL: `https://mcp.context.dev/mcp`  
Docs: https://docs.context.dev/install-mcp

Until then, Composio `COMPOSIO_SEARCH_WEB` is the Active research fallback.

## 3. Cursor Agents

- Sync Skills for Cloud Agents = on  
- Automation at https://cursor.com/automations with memories ON  
  Prompt: `routines/tool-hunt-weekly.json` → `cursor_automation.prompt_hint`

## 4. Optional

| Item | Why |
| --- | --- |
| `PINECONE_API_KEY` | Vector knowledge |
| Instagram / TikTok Composio | Social read for morning-scan |
| Apollo / Clay | Extra enrich — Yelp/Maps already adopted |

## Verify

```bash
node scripts/check-auth-gaps.mjs
node scripts/mem0-smoke.mjs   # needs MEM0_API_KEY or will exit 2
```

Reply in the cloud agent thread after unlocks so we can re-verify and mark the goal complete.
