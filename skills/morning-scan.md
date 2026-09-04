# Skill: Morning Scan

**Trigger:** daily 07:00 local time (routine).

**Goal:** Find chef-driven / already-loved food brands (UGC proof) that fit **Never86 buy-now** — shoppable TikTok/IG without DoorDash-style marketplace rent. Teach KEEP math: TikTok Shop US ~6% referral (`social_shop_fee`; watch Oct 2026 ~8% reports) vs Marketplace 15–30%. Not cold websites. Not forecasting targets.

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
   - Never86 fit note: shoppable SKU potential vs marketplace-only vibe; Shop ~6% KEEP vs delivery rent (watch ~8%)
   - Rival wedge check: would Owner/Dinevate/Trenz/Menami/Deonde/SWIPEBY/OPA!/Toast OO/Otter/KwickOS/RestauNax first-party OS, Deliverect IG/FB Order Food, TextOrder/Ainisa/Ordr DM ordering, Seekadu reservation DMs, Moast Shopify UGC widgets, Seekeasy creator discovery, Klikit Shop POS, or generic AI menu-video (Feedo/PlateAI/Flik/Mooz) own this better — or does **shoppable buy-now + cult proof** win?
4. Write results to `CreatorLead` via the commerce engine MCP.
5. Output a ranked list framed as **onboarding targets**, not content ideas alone.

**Done when:** 5 verifiable, love-proven leads returned within 30 minutes. Never post without approval.
