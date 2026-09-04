# Skill: KEEP Channel Grader (pilot)

**Trigger:** pain→sales teach, operator asks “which channel is worth it?”, or weekly tool-hunt when refreshing the public wedge.

**Goal:** Rank restaurant sales channels by **KEEP$ after fees**, not GMV — Zayos-style inbound diagnostic that points to Never86 love→buy-now. **Not** sales/labor forecasting.

### Steps
1. Collect monthly GMV + fee % per channel (dine-in, takeout, DoorDash, Uber Eats, Grubhub, Never86 social buy-now).
2. Run CLI **or** MCP:
   ```bash
   node scripts/keep-channel-grader.mjs \
     --dinein 12000 --takeout 4000 \
     --doordash 9000 --doordash_fee_pct 25 \
     --uber 3500 --uber_fee_pct 30 \
     --social_buy_now 2500
   ```
   - Default `--social_fee_pct` is **6** (TikTok Shop US referral). Pass `0` only for true first-party zero-fee rails.
   - MCP (complaint-sources): `keep_channel_grade` with the same keys (`dinein`, `doordash`, `doordash_fee_pct`, …) or a `channels[]` array.
3. Read `ranked[]` + `summary.never86_wedge`.
4. Fold into `SalesLead.complaint_thesis` / `suggested_angle`: biggest GMV may be worst KEEP; Shop ~6% beats Marketplace 15–30%; dual-run marketplaces for discovery only.
5. Contrast vs ChowNow/Chowly/Lunchbox web OS and Owner email/SMS — Never86 owns TikTok/IG shoppable close.

**Fixtures:** keep-grader→SalesLead for all 5 love markets — Girl & Goat · Franklin · Michael's Genuine · Husk · Rioja

**Lib (keep in sync):** `services/pain-leads-api/src/lib/keepChannelGrade.ts`

**Done when:** JSON rank printed; wedge noted on the lead; no secrets; no forecast pitch.
