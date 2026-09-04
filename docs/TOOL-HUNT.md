# Beyond the Hunt — best in the restaurant vertical

Continuous research so Never86 runs the **best tools in our vertical**: love→buy-now social commerce, pain→sales-lead shopping, Cursor agents / memory / skills. Pivot fast. Stay ahead of vertical competitors.

## What we are hunting (yes)

| Lane | Examples |
| --- | --- |
| Social commerce GTM | TikTok/IG shoppable, UGC scout, buy-now scripts, creator→onboard |
| Pain → sales lead | Vendor complaint shoppers, teach/label, sales forms |
| Agent stack | Cursor Automations, memories, skills, MCP, Mem0 |
| Vertical rivals | Owner, Trenz, Restomas, Feedia, BrandPal, CreatOK, Straunt, Zayos |

## What we are NOT hunting (no)

- Historical sales forecasting products
- Labor forecasting / schedule-optimization research
- Generic BI / “restaurant analytics platform” bake-offs

Report-ops still **ingests** real Toast/labor/sales files Myke already gets — that is ops, not a tooling research lane.

## Why

Vertical AI moves weekly. Guessing loses. This loop:

1. Scans Cursor + restaurant GTM frontier
2. Diffs **us vs vertical competitors**
3. Audits memory / skills / MCP auth gaps
4. Briefs Myke with adopt / pilot / watch asks

## Pieces

| Path | Role |
| --- | --- |
| `agent/tool-hunt/beyond-the-hunt.json` | Scout agent |
| `skills/tool-frontier-scan.md` | Research pass |
| `skills/vertical-rival-watch.md` | Vertical competitor watch |
| `skills/memory-skills-audit.md` | Memory + skills inventory |
| `skills/stack-vs-competitors.md` | Us vs them matrix |
| `skills/tool-hunt-brief.md` | Operator brief |
| `stack/tooling-ledger.json` | Canonical stack + competitors + gaps |
| `stack/tool-hunt-memory.md` | Git-backed hunt memory until Mem0/Automations |
| `stack/tool-hunt-findings/` | Dated `ToolFinding` JSON |
| `docs/DESKTOP-UNLOCKS.md` | Auth clicks cloud agents cannot do |
| `schemas/tool-finding.json` | Finding schema |
| `routines/tool-hunt-weekly.json` | Monday 09:00 America/Chicago |

## Desktop unlocks (cloud agents cannot click these)

Full checklist: **`docs/DESKTOP-UNLOCKS.md`**.

Until Mem0/Automations are live, use `stack/tool-hunt-memory.md` + the cloud **timer** (`beyond-the-hunt-weekly`).

## Agent loop

```
tool-frontier-scan → memory-skills-audit → stack-vs-competitors → tool-hunt-brief
```

```bash
node scripts/validate-tooling-ledger.mjs
```

## Decision rules

- **adopt** — closes a named gap; pivot in hours/days; sharpens vertical GTM
- **pilot** — dogfood one week before promoting
- **watch** — track monthly
- **skip** — forecasting/labor-research, no edge, or forbidden surfaces
- **needs_auth** — already wired; only desktop auth blocks it

## Do not

- Commit API tokens or `.env`
- Expand to Supabase unless Myke explicitly asks
- Install paid tools or switch primary IDE without approval
- Drift tool-hunt into sales/labor **forecasting** research
- Change pain-shopper / restaurant-scout purpose while hunting tools
