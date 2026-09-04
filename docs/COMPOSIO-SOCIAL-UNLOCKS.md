# Composio social unlocks — love→buy-now

Close Instagram + TikTok so morning-scan can pull UGC proofs. Until then, **Yelp love fixtures remain the Active public seed** (no social auth required).

**Live proof (2026-09-04):** Composio `YELP_SEARCH_BUSINESSES` + details reconfirmed Girl & The Goat Chicago — **10,731** reviews, 4.4★, phone matches fixture. Morning-scan love→buy-now does **not** block on IG/TikTok.

**Scope:** Never86 shoppable TikTok/IG buy-now  
**Out:** forecasting · fee-dogfood expansion (paused; overall strong_keep 65 includes brand_site_marketplace_leak)

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
- **Kyte** — Meta Business Extension Order Food on FB/IG profiles → Kyte online catalog ([Kyte FBE](https://www.kyteapp.com/apps/fbe)). IG Stories Food Orders sticker integration currently unavailable (Help banner) — use FB Start Order / profile Order Food instead; still counts as FBE peer.
- **Square Online** — Dashboard Channels → Facebook Food Ordering; Order Food buttons + Stories stickers → Square website ([Square Support](https://squareup.com/help/us/en/article/7778-add-food-ordering-buttons-to-facebook-and-instagram-with-square-online))
- **GloriaFood** — Facebook Start Order / Order Now via smart link ([how-to](https://www.gloriafood.com/restaurant-ideas/facebook-online-ordering-button) / [facebook-ordering](https://www.gloriafood.com/facebook-ordering)). **Oracle EOL Apr 30, 2027** (new signups closed; no Oracle replacement) — keep as FBE peer #9 until shutdown; Shop migration wedge for restaurants losing free Meta-adjacent OO ([Enacton](https://www.enacton.com/blog/gloriafood-shutting-down/), [Ogent](https://ogent.ai/gloriafood-shutdown)). Finding: `2026-09-04-gloriafood-eol-shop-wedge.json`.

Also watch Meta-adjacent **CTA linkers** (Order Food / Start Order → own menu — **not** Meta FBE peers; do not inflate `meta_order_food_peer_count`): **Ressto** ([facebook-ordering](https://ressto.co/facebook-ordering.shtml)), **FoodBooking** ([Start Order](https://startfoodbooking.com/facebook-ordering/) — OO EOL Mar 2027), **Tablevibe** ([Order Food website link](https://intercom.help/tablevibeco/en/articles/6867370-how-do-i-add-my-shop-to-facebook-instagram-google-and-my-own-website)), **Ontabee** Order Food website links.

FBE peer set reconfirmed at **9** (2026-09-04) — finding `2026-09-04-meta-fbe-peer-set-reconfirm.json`.

Also watch **DirectOrders** Instagram DM / WhatsApp / ChatGPT messaging close, **RAY** commission-free Instagram delivery, **Mirar** IG/WhatsApp/Messenger → POS (0% commission) ([mirar.ai](https://www.mirar.ai/)), **WaveOrder** WhatsApp menu + Instagram bio store (0% commission, $49–$399/mo) ([waveorder.app/restaurants](https://waveorder.app/restaurants)), **Zippi** SMS/IG/FB/web chat order+reserve ([zippichat.com](https://zippichat.com/)), **VoiceZero** phone/WA/widget AI → POS ([restaurant mode](https://voicezero.ai/features/restaurant-mode.html)), **BoostOrder** WA/social AI OO 0% ([boostorder.ai](https://boostorder.ai/)), **Mando** / **Orderlya** WA/IG order+reserve (MENA thematic), **TextOrder** AI DM ordering across IG/TikTok/FB Messenger/SMS/WhatsApp ([social-media-ordering](https://mytextorder.com/features/social-media-ordering)), **FOSA** Facebook Messenger ordering ([getfosa.ai](https://www.getfosa.ai/facebook-for-restaurant-marketing-and-ordering)), and **Palmate** / **DMHub** WhatsApp/IG order+reservation assistants — adjacent social intake, not Meta FBE peers.

**Meta Shops checkout note:** Native FB/IG Shops checkout sunset (Aug 2025) + Graph API v26 commerce endpoint blocks (2026) mean product tags route to merchant websites — webview cliffs apply; Never86 in-app Shop fills the vacuum. Watch Meta **Hatch** AI agent (Aug 2026: order food + book tables inside IG/WA; DoorDash/Yelp sandbox) as a platform rival — still **not** an Order Food FBE peer. This does **not** change `meta_order_food_peer_count` (still 9 FBE peers).

**Not Meta Order Food:** **Menusso** is a branded restaurant app / 0% commission OS ([menusso.com/us](https://menusso.com/us/)) — watch separately; do not inflate `meta_order_food_peer_count`.

Never86 wedge stays **in-app Shop buy-now** (avoids bio→webview cliffs — see **linkboo** watch: Toast/Square/ChowNow/OpenTable/Resy break in IG webview per [link.boo/for/restaurants](https://link.boo/for/restaurants) + [small-business](https://link.boo/for/small-business); peer **NullMark** IAB escape restores Apple Pay per [nullmark.tech guide](https://nullmark.tech/guides/apple-pay-in-app-browser); also watch **LinkScale** / **TableQR** restaurant bio hubs that still route Uber Eats / Toast/Resy; video-marketplace peers BiteSight / Smiilen; Shopify shoppable-feed peers CheckIt / FeedGrid / SwipeReel). Fee catalog pause still applies — do not dogfood these as fee products (BentoBox QR $0.99 / Flipdish €0.50+% already in catalog).

## Instagram reconnect (issued this hunt)

Fresh link (expires ~10 min): [Connect Instagram](https://connect.composio.dev/link/lk_qRDZmWg_tzSV) — Business/Creator only. Reply `instagram connected` when done.

**Marketplace rent contrast (not FBE):** Uber Eats [Instagram Delivery Button + Sticker](https://help.uber.com/merchants-and-restaurants/article/instagram-delivery-button-+-sticker?nodeId=92d1fcbf-1b65-4a79-9a16-690710e90046) routes Order Now / Food Orders sticker to Uber Eats menu — teach love→buy-now rent vs first-party peers; do **not** bump `meta_order_food_peer_count`.

**Meta FBE reconfirm (2026-09-04):** Deliverect + ChatFood + BentoBox + Toast + Zyda + Flipdish bounce URL still live — peer_count stays **9**.

## Still required for Beyond the Hunt READY

Mem0 + Context — `docs/DESKTOP-UNLOCKS.md`  
`node scripts/unlock-beyond-the-hunt.mjs` → exit 0
`node scripts/print-beyond-the-hunt-status.mjs` — one-screen auth + love live_proof + watch rivals
