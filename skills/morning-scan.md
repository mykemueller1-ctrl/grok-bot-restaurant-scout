# Skill: Morning Scan

**Trigger:** daily 07:00 local time (routine).

**Goal:** Find chef-driven / already-loved food brands (UGC proof) that fit **Never86 buy-now** — shoppable TikTok/IG without DoorDash-style marketplace rent. Teach KEEP math: TikTok Shop US ~6% referral (`social_shop_fee`; watch Oct 2026 ~8% standard + 1.5% creator facilitation; consumables <$15 carve-out ~5%; Food&Bev Dashboardly still 6% — grader stays 6) vs Marketplace 15–30%. Meta Shops native checkout sunset (Aug 2025) + Graph API commerce endpoint blocks (2026) push IG product tags → merchant websites (webview cliffs) — Never86 in-app Shop fills that vacuum. Not cold websites. Not forecasting targets.

1. Read configured city + cuisine tags from the commerce engine.
2. Discover love signals:
   - Prefer social plugin (OmniSocials/Blotato/Zernio) when connected.
   - **Active public seed (no social auth):** Composio `YELP_SEARCH_BUSINESSES` → `YELP_GET_BUSINESS_DETAILS` for chef/cult venues by city (calibration: `fixtures/tool-hunt/chicago-love-brands.json`, `austin-love-brands.json`, `miami-love-brands.json`, `nashville-love-brands.json`, `denver-love-brands.json`). Prefer high review_count + chef/cult narrative over generic high-rating trucks. **Do not block on Instagram/TikTok.** Live 2026-09-04 CHI proof: Girl & The Goat **10,731** reviews (see fixture `live_yelp` + finding `2026-09-04-yelp-chi-live-morning-scan.json`).
   - Else Composio `COMPOSIO_SEARCH_WEB` / public SERP for recent chef/cult kitchen UGC (Bright Data if auth’d).
   - When Instagram Composio `never86` is Active, sample Business/Creator media for food love proofs (read-only).
   - Social connect steps: `docs/COMPOSIO-SOCIAL-UNLOCKS.md` (TikTok needs org auth-config first). **Do not block the scan on IG/TikTok** — Yelp seed is enough for love→buy-now calibration.
3. For each of top 5, capture:
   - handle, followers, niche tags
   - hook summary + why people love it (UGC signal)
   - brand / kitchen name if identifiable
   - source URL, score (0–100)
   - **order_rails / buy_now_path** (Active public second pass): official site + Composio `COMPOSIO_SEARCH_WEB` / `COMPOSIO_SEARCH_FETCH_URL_CONTENT` / `COMPOSIO_SEARCH_GOOGLE_MAPS` — note first-party OO, Toast OO, Shopify merch, Resy/OpenTable, or marketplace leak (UberEats/DoorDash on brand site → teach `brand_site_marketplace_leak`; OpenTable-only / no OO → teach `reservation_skew_no_buy_now`). If rails are Toast/Square/ChowNow/BentoBox/OpenTable/Resy via bio link, note IG webview Apple Pay / cookie cliff (linkboo + NullMark watches) — Never86 in-app Shop avoids that handoff. Calibration: `fixtures/tool-hunt/*-love-brands.json` → `buy_now_path` on live primaries (Franklin Shopify+preorder; Michaels marketplace leak; Husk Toast gift+Resy; G&TG reservation-skew; Rioja Flavor Dojo). **Pass-2 live loop current (2026-09-04):** all five markets re-verified this hunt — see `*-buy-now-pass2.json` / `*-leak-pass3.json` / `*-reservation-skew-pass2.json` findings.
   - Never86 fit note: shoppable SKU potential vs marketplace-only vibe; Shop ~6% KEEP vs delivery rent (watch ~8%)
   - Rival wedge check: would Owner/Dinevate/Trenz/Menami/Deonde/SWIPEBY/OPA!/Toast OO/Otter/KwickOS/RestauNax/BentoBox first-party OS, Deliverect/Zyda/ChatFood/BentoBox/Toast/Flipdish/Kyte/Square Online IG/FB Order Food, DirectOrders/RAY/Mirar/Mando/Orderlya/WaveOrder IG DM/WhatsApp, linkboo/NullMark webview-escape bio links (Toast/Square/ChowNow/OpenTable/Resy cliffs; Meta Shops checkout sunset → site handoff), LinkScale/TableQR restaurant bio hubs, BiteSight/Smiilen video marketplace, TextOrder/FOSA/Palmate/DMHub/Ainisa/Ordr DM ordering, Seekadu reservation DMs, Moast/CheckIt/FeedGrid/SwipeReel Shopify UGC widgets, Seekeasy creator discovery, Klikit Shop POS, or generic AI menu-video (Feedo/PlateAI/Flik/Mooz) own this better — or does **shoppable buy-now + cult proof** win?
4. Write results to `CreatorLead` via the commerce engine MCP.
5. Output a ranked list framed as **onboarding targets**, not content ideas alone.

**Done when:** 5 verifiable, love-proven leads returned within 30 minutes. Never post without approval.
