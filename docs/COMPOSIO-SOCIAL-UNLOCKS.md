# Composio social unlocks — love→buy-now

Close Instagram + TikTok so morning-scan can pull UGC proofs. Until then, **Yelp love fixtures remain the Active public seed** (no social auth required).

**Scope:** Never86 shoppable TikTok/IG buy-now  
**Out:** forecasting · fee-dogfood expansion (paused at strong_keep 63)

## Active now (no auth)

```bash
node scripts/validate-love-fixtures.mjs          # 5 markets
node scripts/print-social-unlocks.mjs            # this checklist + status hints
```

Morning-scan skill already prefers:
1. Yelp Composio (`YELP_SEARCH_BUSINESSES` / details) + `fixtures/tool-hunt/*-love-brands.json`
2. Composio web search for chef/cult UGC
3. Instagram / TikTok only when Active

## Instagram (Business/Creator)

1. Cloud agent issues a fresh Composio link (expires ~10 min) — or open [Composio Instagram](https://dashboard.composio.dev/~/org/connect/apps/instagram?open=true)
2. Complete OAuth for a **Business or Creator** account (Personal unsupported)
3. Reply in thread: `instagram connected`
4. Agent verifies with `INSTAGRAM_GET_USER_INFO` (`ig_user_id=me`) — read-only for morning-scan

## TikTok (org auth-config first)

TikTok often needs an org-level auth config before Connect works:

1. Open [Composio TikTok app](https://dashboard.composio.dev/~/org/connect/apps/tiktok?open=true)
2. Complete **auth config** if prompted (developer app / scopes)
3. Then Connect the Never86 creator/business account
4. Reply: `tiktok connected`
5. Agent verifies with `TIKTOK_GET_USER_STATS` (authenticated user only — no arbitrary public profiles)

Do **not** auto-publish. Morning-scan is read/discover; publish stays approval-gated.

## Still required for Beyond the Hunt READY

Mem0 + Context — `docs/DESKTOP-UNLOCKS.md`  
`node scripts/unlock-beyond-the-hunt.mjs` → exit 0
