# Composio social unlocks — love→buy-now

Close Instagram + TikTok so morning-scan can pull UGC proofs. Until then, **Yelp love fixtures remain the Active public seed** (no social auth required).

**Live proof (2026-09-04):** Composio `YELP_SEARCH_BUSINESSES` + details reconfirmed Girl & The Goat Chicago — **10,731** reviews, 4.4★, phone matches fixture. Morning-scan love→buy-now does **not** block on IG/TikTok.

**Scope:** Never86 shoppable TikTok/IG buy-now  
**Out:** forecasting · fee-dogfood expansion (paused; overall strong_keep 64 includes brand_site_marketplace_leak)

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

## Meta Order Food rivals (watch)

IG/FB **Order Food** profile buttons are a parallel love→buy-now rail (not TikTok Shop):
- **Deliverect** Social Media Ordering / Direct Suite
- **Zyda** Meta Business Extension → first-party Zyda store
- **ChatFood** Instagram Order Food button + Stories stickers (+ Facebook Commerce)
- **BentoBox** (Clover Hospitality) Meta Business Extension → Bento Online Ordering / Catering + Stories Food Orders sticker ([Help Center](https://help.getbento.com/en/articles/412673))
- **Toast Online Ordering** — Instagram Action Button Order food → select Toast as partner; Stories Food Orders sticker; Facebook Start Order ([Toast Support](https://support.toasttab.com/en/article/Posting-Your-Online-Ordering-or-E-Gift-Card-Purchase-Link-on-Instagram-and-Facebook))
- **Flipdish** — Instagram Order Now / Food Orders sticker → Flipdish bounce URL (already in fee catalog for €0.50+%)
- **Kyte** — Meta Business Extension Order Food on FB/IG + Stories stickers → Kyte online catalog ([Kyte FBE](https://www.kyteapp.com/apps/fbe))

Also watch **DirectOrders** Instagram DM / WhatsApp / ChatGPT messaging close and **RAY** commission-free Instagram delivery channel (Order Food/Reserve + DM automation — [RAY blog](https://blog.rayapp.ai/en/delivery-without-commission/instagram-delivery-channel-restaurants/)) — adjacent social intake, not Meta FBE peers.

Never86 wedge stays **in-app Shop buy-now** (avoids bio→webview cliffs — see linkboo watch; also watch video-marketplace peers BiteSight / Smiilen). Fee catalog pause still applies — do not dogfood these as fee products (BentoBox QR $0.99 / Flipdish €0.50+% already in catalog).

## Instagram reconnect (issued this hunt)

Fresh link (expires ~10 min): [Connect Instagram](https://connect.composio.dev/link/lk_JYyUTk9S5ND5) — Business/Creator only. Reply `instagram connected` when done.

## Still required for Beyond the Hunt READY

Mem0 + Context — `docs/DESKTOP-UNLOCKS.md`  
`node scripts/unlock-beyond-the-hunt.mjs` → exit 0
`node scripts/print-beyond-the-hunt-status.mjs` — one-screen auth + love live_proof + watch rivals
