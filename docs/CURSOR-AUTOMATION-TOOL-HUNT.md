# Cursor Automation — Beyond the Hunt (weekly)

Paste-ready setup so the weekly vertical hunt does not depend on the interim cloud timer alone.

**Scope:** love→buy-now · pain→sales-lead · Cursor memory/skills/MCP  
**Out:** historical sales forecasting · labor forecasting  
**Fee catalog:** paused — do not expand fee dogfoods unless a cite sharpens love→buy-now or Cursor stack beyond the catalog. Overall `strong_keep` 65 includes `brand_site_marketplace_leak` (not a fee dogfood).

## Create

1. Open [cursor.com/automations](https://cursor.com/automations)
2. New Automation → attach this repo
3. **Memories:** on
4. Schedule: Mondays 09:00 America/Chicago (matches `routines/tool-hunt-weekly.json`)
5. Paste the prompt below (or `node scripts/print-tool-hunt-automation.mjs` → `automation.prompt`)
6. Prerequisites still required for full READY: Mem0 + Context — see `docs/DESKTOP-UNLOCKS.md`

## Prompt (paste)

```text
Run Beyond the Hunt for Never86 best-in-vertical only: love→buy-now social commerce, pain→sales-lead, Cursor agents/memory/skills/MCP, and vertical rivals including DoorDash Online Ordering, Uber Webshop, Grubhub Direct, Olo Network, Menusso, Owner, Trenz, Klikit, Deliverect, Zyda, ChatFood, BentoBox Meta Order Food, Toast Meta Order Food, Flipdish IG Order Now, Kyte Meta Order Food, Square Online Meta Order Food, DirectOrders IG DM, RAY IG delivery, BiteSight, Smiilen, linkboo, Popmenu, Sauce, Ressto, Eatsy, Square AI-channel, UpMenu, DineOpen, Muncho.

Fee KEEP catalog is sufficient (fee dogfoods paused; overall strong_keep 65 includes brand_site_marketplace_leak love teach) — pause further fee dogfood expansion unless a cite sharpens love→buy-now or Cursor memory/skills/MCP beyond the catalog.

Do NOT research historical sales forecasting or labor forecasting tools.

Start with: node scripts/print-beyond-the-hunt-status.mjs
Then: node scripts/run-tool-hunt-week.mjs
Follow skills in routines/tool-hunt-weekly.json in order.
Update stack/tooling-ledger.json and write findings under stack/tool-hunt-findings/.
Validate with: node scripts/validate-tooling-ledger.mjs
After secrets land: node scripts/unlock-beyond-the-hunt.mjs (expect STATUS: READY / exit 0).
Commit on a cursor/* branch. No secrets in git or chat.
```

## Verify

```bash
node scripts/print-tool-hunt-automation.mjs   # reprints this prompt + checklist
node scripts/print-beyond-the-hunt-status.mjs # auth + love live_proof + gaps
node scripts/check-auth-gaps.mjs              # want STATUS: READY
node scripts/tool-hunt-brief.mjs              # TOP MOVES should be auth-first while fee pause is on
```

Source of truth: `routines/tool-hunt-weekly.json` → `cursor_automation`.
