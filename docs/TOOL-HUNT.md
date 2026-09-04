# Beyond the Hunt — best in the restaurant vertical

Continuous research so Never86 runs the **best tools in our vertical**: love→buy-now social commerce, pain→sales-lead shopping, Cursor agents / memory / skills. Pivot fast. Stay ahead of vertical competitors.

## What we are hunting (yes)

| Lane | Examples |
| --- | --- |
| Social commerce GTM | TikTok/IG shoppable, UGC scout, buy-now scripts, creator→onboard |
| Pain → sales lead | Vendor complaint shoppers, teach/label, sales forms |
| Agent stack | Cursor Automations, memories, skills, MCP, Mem0 |
| Vertical rivals | Owner, Trenz, Restomas, Feedia, BrandPal, CreatOK, Straunt, Zayos, TextOrder, Menami, Seekadu, Klikit, Popmenu, Flipdish, Sauce, Fleksa, BentoBox, Ressto |

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
| `scripts/run-tool-hunt-week.mjs` | Headless weekly gate (auth soft-check + ledger validate) |
| `scripts/unlock-beyond-the-hunt.mjs` | After READY: Mem0 import + Context smoke |
| `scripts/context-search.mjs` | Context REST research when `CONTEXT_DEV_API_KEY` set |
| `scripts/mem0-smoke.mjs` | Mem0 smoke when `MEM0_API_KEY` set |

## Desktop unlocks (cloud agents cannot click these)

Full checklist: **`docs/DESKTOP-UNLOCKS.md`**.

Until Mem0/Automations are live, use `stack/tool-hunt-memory.md` + the cloud **timer** (`beyond-the-hunt-weekly`).

## Agent loop

```
tool-frontier-scan → memory-skills-audit → stack-vs-competitors → tool-hunt-brief
```

```bash
node scripts/run-tool-hunt-week.mjs   # auth soft-check + ledger validate + brief preview
node scripts/tool-hunt-brief.mjs --write   # stack/tool-hunt-briefs/YYYY-MM-DD.md
node scripts/validate-tooling-ledger.mjs
node scripts/unlock-beyond-the-hunt.mjs   # exit 0 when Mem0+Context READY
```

Want `STATUS: READY` from the week gate (Mem0 + Context smokes). If blocked, continue with Active Composio/X/Yelp paths. Brief stays git-backed until Mem0 imports.

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
