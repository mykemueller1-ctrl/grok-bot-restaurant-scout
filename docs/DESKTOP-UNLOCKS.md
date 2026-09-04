# Desktop unlocks — Beyond the Hunt

Cloud agents **cannot** complete interactive MCP auth. Do these so we stay best-in-vertical.

## 1. Cursor MCP (Settings → Tools / MCP)

| Server | Why | Status from cloud |
| --- | --- | --- |
| **Mem0** | Durable cross-session memory | needsAuth |
| **Context.dev** | Live research redundancy | needsAuth |
| **Apollo** / **Clay** | Optional lead enrich | needsAuth — **not blocking** (Yelp/Maps/Composio public enrich adopted) |
| **Pinecone** | Optional vector knowledge | MCP ready but needs `PINECONE_API_KEY` in MCP config |

Never paste tokens into chat. Mint Pinecone keys at https://app.pinecone.io

## 2. Cursor Agents

- **Sync Skills for Cloud Agents** = on
- Create **Automation** at [cursor.com/automations](https://cursor.com/automations) with **memories on**  
  Prompt: `cursor_automation.prompt_hint` in `routines/tool-hunt-weekly.json`

## 3. Composio social

- **Instagram** (Business/Creator): open the fresh Connect link from the latest agent message (~10 min TTL)
- **TikTok**: [set up auth-config](https://dashboard.composio.dev/~/org/connect/apps/tiktok?open=true) then reconnect

## Already adopted (no click needed)

- Composio `COMPOSIO_SEARCH_WEB` for vertical research
- Yelp + Google Maps via Composio for **pain→sales** public venue enrich (`lead-shop-enrich`)
- Git-backed `stack/tool-hunt-memory.md` + weekly/midweek timers

## Done when

Ledger gaps `desktop-auth-mem0-context`, `automation-tool-hunt`, `skills-sync` verify closed on the next hunt run.
