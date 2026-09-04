# Skill: KEEP Channel Grader (pilot)

**Trigger:** pain→sales teach, operator asks “which channel is worth it?”, or weekly tool-hunt when refreshing the public wedge.

**Goal:** Rank restaurant sales channels by **KEEP$ after fees**, not GMV — Zayos-style inbound diagnostic that points to Never86 love→buy-now. **Not** sales/labor forecasting.

### Steps
1. Collect monthly GMV + fee % per channel (dine-in, takeout, DoorDash, Uber Eats, Grubhub, Never86 social buy-now).
2. Run:
   ```bash
   node scripts/keep-channel-grader.mjs \
     --dinein 12000 --takeout 4000 \
     --doordash 9000 --doordash_fee_pct 25 \
     --uber 3500 --uber_fee_pct 30 \
     --social_buy_now 2500 --social_fee_pct 0
   ```
3. Read `ranked[]` + `summary.never86_wedge`.
4. Fold into `SalesLead.complaint_thesis` / `suggested_angle`: biggest GMV may be worst KEEP; shift social demand to buy-now; dual-run marketplaces for discovery only.
5. Contrast vs ChowNow/Chowly/Lunchbox web OS and Owner email/SMS — Never86 owns TikTok/IG shoppable close.

**Fixture:** `fixtures/tool-hunt/keep-channel-grader-pilot.json`

**Done when:** JSON rank printed; wedge noted on the lead; no secrets; no forecast pitch.
