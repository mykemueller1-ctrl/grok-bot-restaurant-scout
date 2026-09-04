# Skill: Tool Hunt Brief

**Trigger:** end of weekly routine; Telegram / Slack / chat to Myke.

**Goal:** One tight ops brief — what’s new, what competitors use, what we should do next.

1. Read today’s findings in `stack/tool-hunt-findings/`.
2. Rank by verdict then priority: `adopt` → `pilot` → `needs_auth` → `watch` → `skip`.
3. Output format (keep short):

```
Beyond the Hunt — YYYY-MM-DD

TOP MOVES
1. …
2. …

US vs THEM
| Lane | Us | Them | Gap |
| … |

NEEDS YOU
- [ ] Auth Mem0 / Context (if still blocked)
- [ ] Approve pilot: …

WATCHING
- …
```

4. Never paste tokens. Link to `docs/TOOL-HUNT.md` for the full loop.
5. If nothing beats the bar, say so in one sentence — empty briefs are valid.

**Done when:** brief delivered; ledger `last_brief` set.
