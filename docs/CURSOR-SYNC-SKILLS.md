# Cursor Sync Skills — Cloud Agents

One desktop click so Cloud Agents inherit project + personal skills for Beyond the Hunt.

**Scope:** love→buy-now · pain→sales-lead · Cursor memory/skills/MCP  
**Out:** historical sales forecasting · labor forecasting

## Do this (desktop)

1. Open **Cursor Desktop** (not cloud-only)
2. **Settings → Agents → Sync Skills for Cloud Agents** → **On**
3. Confirm project skills under `skills/` are visible to cloud runs (especially `tool-frontier-scan`, `vertical-rival-watch`, `memory-skills-audit`, `morning-scan`, `script-draft`, `tool-hunt-brief`, `lead-shop-enrich`, `sales-lead-form`)
4. Reply in the cloud agent thread: `skills sync on`

## Why

Without Sync Skills, Cloud Agents may miss GTM skills that desk already has. Weekly hunt (`routines/tool-hunt-weekly.json`) depends on those skill files.

## Verify (cloud)

```bash
node scripts/print-sync-skills-checklist.mjs   # inventory + desktop ask
ls skills/*.md | wc -l                        # expect project skill count
```

## Still required for Beyond the Hunt READY

Mem0 + Context — `docs/DESKTOP-UNLOCKS.md`  
Then: `node scripts/unlock-beyond-the-hunt.mjs` → exit 0

Fee catalog remains paused (fee dogfoods frozen; overall `strong_keep` 65 includes `brand_site_marketplace_leak`) — no new fee dogfoods unless a cite sharpens love→buy-now / Cursor stack.
