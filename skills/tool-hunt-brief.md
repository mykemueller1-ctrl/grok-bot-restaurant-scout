# Skill: Tool Hunt Brief

**Trigger:** end of weekly routine; Telegram / Slack / chat to Myke.

**Goal:** One tight ops brief — best-in-vertical moves only.

1. Read today’s findings in `stack/tool-hunt-findings/`.
2. Drop any forecasting/labor-research noise.
3. Rank: `adopt` → `pilot` → `needs_auth` → `watch` → `skip`.
4. Output:

```
Beyond the Hunt — YYYY-MM-DD (vertical)

TOP MOVES
1. …
2. …

US vs VERTICAL
| Rival | Their edge | Our edge | Gap |
| … |

NEEDS YOU (desktop)
- [ ] Auth Mem0 / Context
- [ ] Sync Skills for Cloud Agents
- [ ] Approve Automation / pilot: …

WATCHING
- …
```

5. Optionally run `node scripts/tool-hunt-brief.mjs --write` (git-backed brief under `stack/tool-hunt-briefs/` until Mem0).
6. Never paste tokens. Link `docs/TOOL-HUNT.md`.

**Done when:** brief delivered; ledger `last_brief` set (via `--write` or manual).
