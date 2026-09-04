# Beyond the Hunt — AI tooling frontier

Continuous research loop so Never86 stays on the best Cursor agents, memory, skills, and knowledge tools — and knows what competitors use.

## Why

AI tooling moves weekly. Guessing loses. This loop:

1. Scans the frontier
2. Diffs **us vs them**
3. Audits memory / skills / MCP auth gaps
4. Briefs Myke with concrete adopt / pilot / watch asks

GTM agents (restaurant scout, pain shoppers, report-ops) stay on mission. This is **operator infrastructure**, not a change to love→buy-now or pain→sales-lead purpose.

## Pieces

| Path | Role |
| --- | --- |
| `agent/tool-hunt/beyond-the-hunt.json` | Scout agent |
| `skills/tool-frontier-scan.md` | Research pass |
| `skills/memory-skills-audit.md` | Memory + skills inventory |
| `skills/stack-vs-competitors.md` | Us vs them matrix |
| `skills/tool-hunt-brief.md` | Operator brief |
| `stack/tooling-ledger.json` | Canonical stack + competitors + gaps |
| `stack/tool-hunt-findings/` | Dated `ToolFinding` JSON |
| `schemas/tool-finding.json` | Finding schema |
| `routines/tool-hunt-weekly.json` | Monday 09:00 America/Chicago |

## Operator loop (you)

1. Read the weekly brief (Telegram / chat).
2. Authenticate blocked MCPs when asked (Mem0, Context) — never paste tokens into chat.
3. Approve pilots (`adopt` / `pilot` only).
4. Optional but recommended: create a **Cursor Automation** at [cursor.com/automations](https://cursor.com/automations) with memories on, using the prompt in `routines/tool-hunt-weekly.json` → `cursor_automation.prompt_hint`.
5. Turn on **Sync Skills for Cloud Agents** (Settings → Agents) so personal skills travel.

## Agent loop (cloud / automation)

```
tool-frontier-scan → memory-skills-audit → stack-vs-competitors → tool-hunt-brief
```

Validate ledger anytime:

```bash
node scripts/validate-tooling-ledger.mjs
```

## Decision rules

Copied from the ledger:

- **adopt** — closes a named gap; pivot in hours/days; no secret sprawl
- **pilot** — dogfood one week before promoting
- **watch** — track monthly
- **skip** — no edge, or expands forbidden surfaces
- **needs_auth** — already wired; only operator auth blocks it

## Do not

- Commit API tokens or `.env`
- Expand to Supabase unless Myke explicitly asks
- Install paid tools or switch primary IDE without approval
- Change pain-shopper / restaurant-scout purpose while hunting tools
