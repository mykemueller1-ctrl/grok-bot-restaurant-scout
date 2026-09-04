# Desktop unlocks — Beyond the Hunt

Cloud agents **cannot** complete interactive MCP auth. Do these in **Cursor desktop** (and the links below) so we stay best-in-vertical.

## 1. Cursor MCP (Settings → Tools / MCP)

| Server | Why |
| --- | --- |
| **Mem0** | Durable cross-session memory for ops + hunt |
| **Context.dev** | Live research when Bright Data flakes |
| **Apollo** (optional) | Pain→sales contact enrichment |
| **Clay** (optional) | Same — enrichment for shopped leads |

Never paste tokens into chat.

## 2. Cursor Agents

- **Sync Skills for Cloud Agents** = on
- Create **Automation** at [cursor.com/automations](https://cursor.com/automations) with **memories on**  
  Prompt: copy `cursor_automation.prompt_hint` from `routines/tool-hunt-weekly.json`

## 3. Composio social (sharpen morning-scan)

- **Instagram** (Business/Creator): open auth when an agent posts a fresh link (expires ~10 min). Alias `never86`.
- **TikTok**: first set up managed auth in [Composio TikTok app](https://dashboard.composio.dev/~/org/connect/apps/tiktok?open=true), then reconnect.

## Done when

`stack/tooling-ledger.json` open gaps `desktop-auth-mem0-context`, `automation-tool-hunt`, and `skills-sync` flip closed after the next weekly hunt verifies live tools.
