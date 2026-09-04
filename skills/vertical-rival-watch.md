# Skill: Vertical Rival Watch

**Trigger:** weekly with `tool-hunt-weekly`, or on-demand (“who’s beating us in the vertical?”).

**Goal:** Track restaurant **social-commerce / anti-marketplace / pain-GTM** rivals — adopt patterns that sharpen Never86, skip forecasting suites.

### Watch set (seed)
Owner.com · Trenz · BrandPal · CreatOK · Restomas · Feedia · Straunt · Zayos · PlateAI · Flik AI · Seekadu · TextOrder · FOSA (FB Messenger order) · Menami · Klikit (APAC+US GTM) · Deliverect (IG/FB/WA Order Food) · Zyda (Meta Order Food) · ChatFood (IG Order Food) · BentoBox (Meta Order Food + QR) · Toast Online Ordering (Meta Order Food + POS) · Flipdish (IG Order Now) · Kyte (Meta Order Food) · Square Online (Meta Order Food) · GloriaFood (Facebook Order Now — Oracle EOL 2027-04-30) · Ogent AI (GloriaFood successor — 4% PAYG / $149 POS) · Menuro (GloriaFood successor — 0% OO + branded app) · iShopo (CA GloriaFood successor — $49–$249 flat 0%) · Platesready (CA 5% platform fee OO) · MenuDirect (CA flat 0% OO) · FoodBooking / Ressto / Tablevibe (Meta-adjacent CTA linkers — not FBE peers) · BiteSight (video marketplace) · Smiilen (video→delivery) · DripnDip (fashion+food creator shop) · CheckIt / FeedGrid / SwipeReel (Shopify shoppable TikTok/IG feeds) · linkboo (webview escape — Toast/Square/Resy cliffs) · NullMark (IAB escape — Apple Pay restore) · LinkScale / TableQR (restaurant bio hubs) · WaveOrder (WhatsApp menu + IG bio store) · Zippi (SMS/IG/FB chat order+reserve) · VoiceZero (phone/WA/widget AI → POS) · BoostOrder (WA/social AI OO 0%) · Outbites · Orderitto · Moast · Ainisa · Seekeasy · Feedo AI · OrderPost · Beebz · Seared · DirectOrders (IG DM / WhatsApp / ChatGPT) · Mirar (IG/WA/Messenger → POS) · Mando / Orderlya (WA/IG order+reserve, MENA) · Palmate / DMHub (WA/IG order + reserve) · RAY (IG commission-free delivery) · Gegsy · Deonde · SWIPEBY · OPA! · Ordr · Lunchbox · ChowNow · Chowly · Menufy · Popmenu · Sauce · RestauNax · KwickOS · Otter · DevourNow · OrderOut · Fleksa · Ressto · Eatsy Orders · FlavorFeed AI · Restos.io · INFI ONLINE · WhatsMenu · Square AI-channel · UpMenu · DineOpen · Muncho · DoorDash Online Ordering · Restolabs · MenuForma · Clover Restaurant OO · Uber Webshop · Grubhub Direct · Olo Network · Menusso (branded app 0% — **not** Meta Order Food) · Dinevate

**Meta Order Food note:** Only FBE-class peers bump `meta_order_food_peer_count` (currently 9). CTA website-link vendors (Ressto, FoodBooking, Tablevibe, Ontabee) and branded-app OS (Menusso) stay watch — do not inflate the peer count without a Meta FBE primary cite. Meta Shops **native checkout sunset** (Aug 2025) + Graph API commerce endpoint blocks (2026) are a separate Shop wedge (product tags → merchant site / webview cliffs) — not an Order Food peer. Also watch Meta **Hatch** AI shopping agent (Instagram agentic checkout, Q4 2026 target) as a platform rival to Never86 Shop / TikTok Shop — still not an FBE peer.

**Fee watch:** TikTok Shop US referral currently ~6% (grader default); secondary reports of Oct 1 2026 hike to ~8% + 1.5% creator facilitation — consumables <$15 carve-out ~5%; Food&Bev category table still 6% — confirm before changing KEEP defaults. Still beats Marketplace 15–30%. DevourNow guest tech fees ($2.99 / $1+5% / $1+8%) = diner-paid platform friction under 0% commission claims. GloriaFood-successor **Ogent** PAYG is **4% of net sales** despite “commission-free” marketing (`first_party_pct_fee`) — watch only under fee pause. CA **Platesready** flat **5%** platform fee (no monthly) is the same KEEP class — watch only, do not dogfood.

**Skip for hunt research:** Cartsense (non-restaurant TikTok Shop ecom), Nailah labor/demand-forecast features, any historical sales/labor forecasting suite. Also skip SpotOn/DineOpen/Clover/Toast/Otter labor-scheduling deep dives — ordering KEEP only.

### Steps
1. Read `stack/tool-hunt-memory.md` + `stack/tooling-ledger.json` competitors.
2. Research with Composio `COMPOSIO_SEARCH_WEB` / `COMPOSIO_SEARCH_TAVILY` / news (preferred when Bright Data 401s); else WebSearch.
3. For each material change, write a `ToolFinding` (`lane: vertical_gtm`) under `stack/tool-hunt-findings/`.
4. Ask: does this sharpen **love→buy-now** or **pain→sales-lead**?
   - Yes → `adopt` / `pilot` / `watch` with concrete skill or wedge note
   - No / forecasting-only → `skip`
5. Append a dated bullet to `stack/tool-hunt-memory.md`.
6. Update ledger competitor rows + `last_scan`.

**Done when:** ≥1 finding or an explicit “no material moves” note; memory log updated; no secrets.
