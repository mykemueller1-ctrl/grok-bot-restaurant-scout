# Desktop unlocks — Beyond the Hunt

Cloud agents **cannot** complete interactive MCP OAuth. Close these so we stay best-in-vertical.

Environment setup actions were also filed for this run (Mem0, Context, Automation, optional secrets).

## 1. Mem0 (required for goal “close auth gaps”)

**Option A — Desktop OAuth (easiest)**  
Cursor Desktop → Settings → MCP → Mem0 → Authenticate

**Option B — API key (headless / cloud)**  
1. Create key at https://app.mem0.ai/dashboard/api-keys (`m0-…`)  
2. Put `MEM0_API_KEY` in Cursor MCP / Codex / cloud secrets (never chat)  
3. Connector stub: `mcp/mem0.json` → `https://mcp.mem0.ai/mcp` bearer  
4. Verify: `MEM0_API_KEY=… node scripts/mem0-smoke.mjs`

## 2. Context.dev (required — OAuth only)

Context MCP has **no API-key auth path**. Desktop OAuth only:

Cursor Desktop → Settings → Tools & MCP → Context → Authenticate/Connect  
URL: `https://mcp.context.dev/mcp`

Composio SEARCH_WEB remains the Active research fallback until Context is connected.

## 3. Cursor Agents

- Sync Skills for Cloud Agents = on  
- Automation at [cursor.com/automations](https://cursor.com/automations) with memories ON  
  Prompt: `routines/tool-hunt-weekly.json` → `cursor_automation.prompt_hint`

## 4. Optional

| Item | Why |
| --- | --- |
| `PINECONE_API_KEY` | Vector knowledge (MCP ready, key missing) |
| Instagram Composio | Fresh connect link from agent (~10 min TTL) |
| TikTok Composio | [Auth-config](https://dashboard.composio.dev/~/org/connect/apps/tiktok?open=true) first |
| Apollo / Clay | Optional — Yelp/Maps enrich already adopted |

## Already verified Active (no click)

- Composio SEARCH_WEB  
- Yelp + Google Maps enrich (dogfood: Girl & The Goat Chicago → phone + girlandthegoat.com)  
- Weekly + midweek Beyond the Hunt timers  
- Git memory: `stack/tool-hunt-memory.md`
