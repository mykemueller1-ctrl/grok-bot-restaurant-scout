# Beyond the Hunt — durable memory (git-backed)

Cross-run notes until Mem0 + Cursor Automation memories are authenticated.
Agents: append dated bullets; never delete history without operator OK; no secrets.

## Standing orders (Myke)

- Hunt **best-in-vertical** only: love→buy-now, pain→sales-lead, Cursor agents/memory/skills.
- **Never** research historical sales forecasting or labor forecasting products.
- Report-ops file ingest stays ops — not a tooling-research lane.

## Desktop blockers (still open)

- Mem0 MCP: needsAuth (desktop only)
- Context.dev MCP: needsAuth (desktop only)
- Apollo / Clay: needsAuth (desktop only)
- Instagram Composio: auth link initiated 2026-09-04 (see docs/DESKTOP-UNLOCKS.md)
- TikTok Composio: needs org auth-config setup in Composio dashboard first
- Cursor Automation + memories: not created yet (timer is interim)

## Vertical intel (adopted into skills)

- Owner.com: $240M Series D (Goldman, Aug 2026); AI-native direct order + marketing vs marketplace rent — first-party channels, not TikTok Shop-first. Sources: [PR Newswire](https://www.prnewswire.com/news-releases/owner-raises-240m-led-by-goldman-sachs-alternatives-to-build-the-ai-native-platform-for-every-local-business-302862420.html), [Owner](https://www.owner.com/).
- Trenz / BrandPal / CreatOK: TikTok Shop agent + shoppable video production stacks — direct rivals to script-draft / buy-now path.
- PlateAI / Flik AI: AI food video / Reels for restaurants — content production rivals; keep Never86 wedge on **shoppable commerce + pain leads**, not generic menu media.

## Skill adoptions (in-repo)

- `morning-scan` + `script-draft` sharpened for love→buy-now vs DoorDash rent + shoppable proof.
- `vertical-rival-watch` weekly skill added.
- Research fallback: Composio `COMPOSIO_SEARCH_WEB` when Bright Data 401s / Context unauth’d.

## Log

### 2026-09-04 (later)

- Adopted Yelp + Google Maps + COMPOSIO_SEARCH_WEB into `lead-shop-enrich` for public venue contacts (Apollo/Clay no longer block pain→sales).
- Pinecone MCP present but `PINECONE_API_KEY` unset — optional vector memory; document in DESKTOP-UNLOCKS.
- Mem0 + Context still needsAuth (desktop-only).
- Fresh Instagram Composio connect link issued (10 min TTL).
- Midweek vertical-rival timer added.

### 2026-09-04 (auth path + dogfood)

- Filed cursor-cloud environment setup actions: Mem0 desktop, Context desktop, Automation+memories, optional MEM0_API_KEY + PINECONE_API_KEY.
- Added `mcp/mem0.json` + `scripts/mem0-smoke.mjs` for headless Mem0 when key is set.
- Dogfooded Yelp/Maps enrich: Girl & The Goat Chicago → phone + girlandthegoat.com (Stephanie Izard) — fixture saved. Proves pain→sales / buy-now shop path without Apollo.
- Mem0/Context still needsAuth until Myke completes desktop/API unlocks.

### 2026-09-04 (rival refresh)

- Owner wedge clarified: email/SMS/first-party CRM — adopt differentiation in script-draft (Never86 = TikTok/IG buy-now).
- Seekadu added: Instagram DM→reservations — watch only; not our SKU close.
- Context confirmed OAuth-only for MCP; Mem0 still OAuth or MEM0_API_KEY.
- Auth still blocked in this cloud run.

### 2026-09-04 (auth UX)

- Added `.cursor/mcp.json` + `mcp/context.json` so desktop Auth is one click from the repo.
- Weekly routine starts with `auth-gap-check` + `scripts/check-auth-gaps.mjs`.
- Mem0/Context still needsAuth in cloud; MEM0_API_KEY still missing.

### 2026-09-04 (pain dogfood)

- Verified Composio+X pain scan: Toast fee lock-in + DoorDash ~$188K commission quit (Omaha) → Never86 anti-rent sales angle.
- Saved fixtures/tool-hunt/pain-scan-toast-doordash.json + chicago-love-brands.json.
- Auth gaps unchanged (Mem0/Context needsAuth).

### 2026-09-04 (context headless path)

- Added scripts/context-search.mjs for CONTEXT_DEV_API_KEY REST research (MCP Context remains OAuth-desktop-only; numResults≥10).
- check-auth-gaps now requires both Mem0 + Context smokes for STATUS: READY.
- Keys still missing in this cloud run.

### 2026-09-04 (TextOrder rival)

- Watched TextOrder (mytextorder.com): AI order-taking in TikTok/IG/FB DM + SMS/WhatsApp — messaging close, not Shop rails.
- Finding: stack/tool-hunt-findings/2026-09-04-textorder-dm-ordering.json. Skills script-draft + morning-scan contrast updated.
- Auth still BLOCKED (Mem0/Context needsAuth; secrets unset).

### 2026-09-04 (Menami + Klikit + keep-what-you-sell pain)

- Watched Menami (getmenami.com): ACP Agent Protocol + IG/WhatsApp + direct Stripe ordering — top vertical rival; skip staff/labor forecast features.
- Watched Klikit TikTok Shop POS (APAC) as Shop→kitchen validation.
- Bright Data still HTTP 401 despite namespace ready — Composio SEARCH_WEB stays research primary.
- Dogfood X pain: fixtures/tool-hunt/pain-scan-marketplace-keep.json (rank channels by KEEP / Uber cut / 15–30% commissions).
- Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Austin love calibration + weekly gate)

- Adopted multi-market Yelp morning-scan: fixtures/tool-hunt/austin-love-brands.json (Uchi, Franklin, Intero, Eldorado).
- Added scripts/run-tool-hunt-week.mjs headless gate (auth + ledger); CI tool-hunt runs it.
- Auth still blocked (Mem0/Context).

### 2026-09-04 (pain→sales KEEP dogfood)

- Closed Active loop: marketplace KEEP + $188K quit signal → Yelp/Maps Girl & The Goat enrich → SalesLead DRAFT.
- Fixture: fixtures/tool-hunt/pain-to-sales-keep-girl-goat.json. Skills sales-lead-form + lead-shop-enrich updated.
- Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Mem0 import ready + Franklin script)

- Added scripts/mem0-import-tool-hunt-memory.mjs — runs the moment MEM0_API_KEY lands.
- Dogfood buy-now script: fixtures/tool-hunt/script-draft-franklin-buy-now.json (PENDING_APPROVAL).
- Auth still blocked (Mem0/Context).

### 2026-09-04 (Outbites/Orderitto + IG reconnect)

- Watched Outbites ($1/order first-party KEEP) and Orderitto (flat-fee zero-commission apps).
- Re-initiated Instagram Composio: https://connect.composio.dev/link/lk_xiDg14zPJDHd (expires ~10 min).
- Auth Mem0/Context still BLOCKED.

### 2026-09-04 (KEEP scorer + catalog-sync sandbox)

- Adopted scripts/score-marketplace-keep.mjs for pain stub boosting (no network/auth).
- Catalog-sync sandbox: fixtures/tool-hunt/catalog-sync-franklin-sandbox.json (await APPROVED).
- Instagram still not Active; Mem0/Context still blocked.

### 2026-09-04 (MCP score_marketplace_keep)

- Wired score_marketplace_keep into complaint-sources MCP (Fastify sources.ts + Worker).
- mcp/complaint-sources.json + pain-complaint-scan updated. Auth Mem0/Context still BLOCKED.

### 2026-09-04 (unlock runner)

- Added scripts/unlock-beyond-the-hunt.mjs (READY → Mem0 import + Context smoke).
- Worker KEEP scorer now imports shared marketplaceKeepScore lib.
- CI pain-leads-api runs KEEP scorer smoke after build. Auth still blocked.

### 2026-09-04 (Moast/Ainisa/Seekeasy + effective-cost KEEP)

- Weekly rival scan (Composio SEARCH_WEB; Bright Data still 401): watched Moast (Shopify shoppable UGC), Ainisa (TikTok/IG DM orders), Seekeasy (creator trends — skip their Forecasting feature), Feedo (content-only).
- Skipped Cartsense (non-restaurant ecom) and Nailah labor/forecast research.
- Adopted effective_cost_math on KEEP scorer + fixtures/tool-hunt/pain-scan-doordash-effective-cost.json (statement: 8.37% commission → 18.75% effective cost).
- Ledger v1.17.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP (Mem0 + Context).

### 2026-09-04 (OrderPost + Tavily + Franklin effective-cost dogfood)

- Watched OrderPost (IG post→order link — top buy-now peer), Beebz (creator/video menus), Seared (first-party KEEP).
- Adopted COMPOSIO_SEARCH_TAVILY as research secondary; scripts/score-pain-fixtures.mjs CI batch KEEP gate.
- Dogfood: fixtures/tool-hunt/pain-to-sales-effective-cost-franklin.json (statement math → Franklin SalesLead DRAFT).
- Ledger v1.18.0. Auth still BLOCKED (Mem0 + Context).

### 2026-09-04 (Miami love + KEEP-hardened pain + DirectOrders)

- Adopted Miami Yelp love calibration: fixtures/tool-hunt/miami-love-brands.json (Chef Adrianne's, Michael's Genuine, Carbone, La Fresa Francesa).
- Hardened all pain-scan hits to anti_marketplace_buy_now (7/7); score-pain-fixtures gate ≥4.
- Watched DirectOrders (zero-commission + IG/WhatsApp intake).
- Ledger v1.19.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Toast pos_fee_lockin + Miami sales dogfood + Gegsy)

- Adopted pos_fee_lockin on KEEP scorer (Toast fee/lock-in); validate-love-fixtures.mjs CI gate (CHI/ATX/MIA).
- Dogfood: pain-to-sales-miami-michaels-genuine.json (KEEP + Design District pickup → SalesLead DRAFT).
- Watched Gegsy (Square branded apps). Ledger v1.20.0. Auth still BLOCKED.

### 2026-09-04 (tool-hunt-brief runner + secrets required)

- Adopted scripts/tool-hunt-brief.mjs --write → stack/tool-hunt-briefs/2026-09-04.md; weekly gate previews brief.
- MEM0_API_KEY + CONTEXT_DEV_API_KEY marked optional:false in github-secrets.manifest.json.
- Ledger v1.21.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Nashville + menu-markup KEEP + Deonde/OPA!/SWIPEBY/Ordr)

- Adopted Nashville Yelp love calibration: fixtures/tool-hunt/nashville-love-brands.json (Husk, Catbird Seat, Henrietta Red, Rolf and Daughters); validate-love markets=4.
- Adopted menu_markup_pain + own_ordering_keep on KEEP scorer (CLI + Fastify/Worker); pain-scan-menu-markup.json (9/9 strong).
- Dogfood: pain-to-sales-nashville-husk.json (menu-markup KEEP → SalesLead DRAFT).
- Watched Deonde (white-label own ordering), SWIPEBY + OPA! (first-party KEEP), Ordr (WhatsApp/IG AI orders). Skip forecasting.
- Bright Data still 401 — Composio SEARCH_WEB/Tavily + X Active. Ledger v1.22.0. Auth still BLOCKED (Mem0 + Context).

### 2026-09-04 (Husk buy-now script + Lunchbox watch)

- Adopted script-draft-husk-buy-now.json + catalog-sync-husk-sandbox.json (PENDING_APPROVAL / SANDBOX).
- Watched Lunchbox (first-party web/app + marketplace aggregation; OPA! partner). Skip forecasting.
- Ledger v1.23.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP (Mem0 + Context).

### 2026-09-04 (Denver love + ChowNow + buy-now dogfood gate)

- Adopted denver-love-brands.json (Rioja, Hop Alley, Tavernetta, Uncle); validate-love markets=5.
- Dogfood: pain-to-sales-denver-rioja.json. Adopted scripts/validate-buy-now-dogfood.mjs CI gate.
- Watched ChowNow (commission-free first-party + dual-run DoorDash). Skip forecasting.
- Ledger v1.24.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Rioja buy-now + dual-run KEEP + Chowly)

- Adopted script-draft-rioja-buy-now.json + catalog-sync-rioja-sandbox.json (validate-buy-now ≥3).
- Adopted dual_run_marketplace KEEP signal + pain-scan-dual-run.json (10/10 strong).
- Watched Chowly (commission-free ordering + marketing OS; DoorDash hybrid). Skip forecasting.
- Ledger v1.25.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (KEEP channel grader pilot + Menufy)

- Piloted scripts/keep-channel-grader.mjs (rank channels by KEEP$ after fees — Zayos-style wedge; not forecasting).
- Fixture + skill: keep-channel-grader-pilot.json / skills/keep-channel-grader.md. vertical-grader-wedge gap updated.
- Watched Menufy (flat-fee first-party + ~12.5% negotiated DoorDash/Uber dual-run).
- Ledger v1.26.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (MCP keep_channel_grade + Rioja dogfood)

- Wired keep_channel_grade into complaint-sources (Fastify sources.ts + Worker) via keepChannelGrade.ts.
- Dogfood: pain-to-sales-keep-grader-rioja.json folds KEEP$ rank into SalesLead DRAFT.
- Ledger v1.27.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Popmenu + Flipdish watch + grader dogfood gate)

- Watched Popmenu (commission-free marketing OS + on-site ordering) and Flipdish (IG Order Now + first-party KEEP). Skip Flipdish forecasting features.
- Added scripts/validate-keep-grader-dogfood.mjs CI gate.
- Ledger v1.28.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Sauce watch + GloriaFood skip + Franklin grader dogfood)

- Watched Sauce (commission-free ordering + multi-fleet delivery KEEP). Skip Sauce demand-forecasting content.
- Skipped GloriaFood (discontinued new signups).
- Second KEEP grader→SalesLead dogfood: pain-to-sales-keep-grader-franklin.json (gate ≥2).
- Ledger v1.29.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Fleksa/BentoBox + per-order fee KEEP + Husk grader)

- Watched Fleksa (0% commission OS) + BentoBox ($0.99/order + Clover lock-in).
- Adopted per_order_platform_fee KEEP signal + pain-scan-bentobox-per-order.json (strong_keep 11).
- Third KEEP grader dogfood: pain-to-sales-keep-grader-husk.json (gate ≥3).
- Ledger v1.30.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Ressto watch + Miami KEEP grader dogfood)

- Watched Ressto (GloriaFood-successor 0% commission; Deonde-family).
- Fourth KEEP grader→SalesLead: pain-to-sales-keep-grader-michaels-genuine.json (gate ≥4).
- API CI smoke covers per_order_platform_fee.
- Ledger v1.31.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Eatsy watch + Chicago KEEP grader completes 5 markets)

- Watched Eatsy Orders (bilingual flat-fee 0% commission).
- Fifth KEEP grader dogfood: pain-to-sales-keep-grader-girl-goat.json — CHI/ATX/MIA/BNA/DEN set complete (gate ≥5).
- Ledger v1.32.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Buy-now dogfood completes 5 love markets)

- Added script-draft + catalog-sync for Girl & The Goat (CHI) and Michael's Genuine (MIA).
- validate-buy-now-dogfood gate ≥5 (matches love markets).
- Ledger v1.33.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (5-market coverage validator)

- Added scripts/validate-market-coverage.mjs — love↔keep-grader↔script-draft↔catalog-sync per CHI/ATX/MIA/BNA/DEN (shared yelp_alias).
- Wired into validate-stack.yml CI.
- Ledger v1.34.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Owner 5% KEEP signal + FlavorFeed/Restos/INFI/WhatsMenu watch)

- Adopted first_party_pct_fee KEEP signal (Owner Flex $249 + 5% restaurant fee / guest order support fee) + pain-scan-owner-pct-fee.json (strong_keep 12).
- Watched FlavorFeed AI (POS+IG/TikTok content+ordering), Restos.io (€0/€29 commission-free), INFI ONLINE (0% commission), WhatsMenu (owned storefront vs TikTok Shop).
- Ledger v1.35.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Square AI-channel + UpMenu overage + DineOpen/Muncho)

- Watched Square ChatGPT/Claude ordering (Jul 2026, 0% marketplace commission into POS).
- Widened per_order_platform_fee for $1.90-style overages; UpMenu fixture (strong_keep 13).
- Watched DineOpen + Muncho (AI/QR KEEP peers). Skip labor-forecast deep dives.
- Ledger v1.36.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (DoorDash Online Ordering KEEP + Restolabs/MenuForma/Clover OO)

- Adopted marketplace_direct_zero KEEP signal (DoorDash OO 0% direct vs Marketplace 15–30%) + pain-scan-doordash-online-ordering.json (strong_keep 14).
- Watched Restolabs, MenuForma, Clover Restaurant OO (POS lock-in note). Skip labor modules.
- Ledger v1.37.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Uber Webshop + Grubhub Direct + Olo/Menusso)

- Widened marketplace_direct_zero for Uber Webshop + Grubhub Direct (strong_keep 15).
- Noted Uber Marketplace Lite ~20% after Mar 2026 hike.
- Watched Olo Network (second-party 0% commission app) + Menusso branded app.
- Ledger v1.38.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (TikTok Shop 6% social_shop_fee + Toast OO watch)

- Adopted social_shop_fee (TikTok Shop US ~6% unified referral vs Marketplace 15–30%) + widened first_party_pct_fee for IG checkout 5% selling fee (strong_keep 16).
- Updated script-draft anti-rent teach with Shop KEEP math.
- Watched Toast Online Ordering (0% commission + POS lock-in). Skip labor/forecast.
- Ledger v1.39.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (social_shop SalesLead dogfood + Dinevate watch)

- Dogfood pain-to-sales-social-shop-franklin.json + validate-social-shop-dogfood.mjs CI gate.
- Morning-scan teach: Shop ~6% KEEP vs Marketplace rent.
- Watched Dinevate (Owner alternative OS). Skip labor/forecast.
- Ledger v1.40.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (social_shop SalesLead completes 5 love markets)

- Added girl-goat / michaels-genuine / husk / rioja social_shop SalesLeads (with franklin = 5).
- validate-social-shop-dogfood ≥5; market-coverage chain includes social-shop.
- Ledger v1.41.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (KEEP grader default Shop ~6%)

- Default `social_fee_pct` 0→6 in keep-channel-grader.mjs + keepChannelGrade.ts (MCP inherits).
- Updated 5 keep-grader dogfoods + pilot: social keep_pct 94%; teach Shop ~6% vs Marketplace 15–30%.
- Validator asserts social_fee_pct=6 + quote `social_buy_now keep_pct 94%`.
- Ledger v1.42.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Shop fee-hike watch + RestauNax)

- Composio scan: Ecommerce Times claims TikTok Shop US referral 6%→8% Oct 1 2026 (+1.5% creator facilitation). Dashboardly still ~6% (Jul 2026). **Watch only** — keep grader default at 6 until confirmed.
- Watched RestauNax (~$99/mo commission-free site/app) as first-party KEEP peer (not Shop-native). Skip SpotOn labor.
- `social_shop_fee` already matches 6|8%. Ledger v1.43.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (CI finding schema + KwickOS/Otter watch)

- Fixed ToolFinding schema (`finding_id` + `researched_at`) on keep-grader / Shop-hike / RestauNax findings — unblocks validate-tooling-ledger CI.
- Watched KwickOS KwickMenu (POS-bundled 0% OO) + Otter commission-free OO (watch per-order txn fee KEEP leak). Skip Otter labor.
- Ledger v1.44.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Otter per-order fee pain-scan adopt)

- Adopted pain-scan-otter-per-order.json → `per_order_platform_fee` (strong_keep 17).
- Morning-scan / script-draft / sales-lead-form teach Shop 6% (watch ~8%) + Otter/KwickOS/RestauNax peers.
- Ledger v1.45.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (DevourNow guest-fee adopt + OrderOut watch)

- Adopted pain-scan-devournnow-guest-fee.json ($2.99 / $1+5% / $1+8% diner tech fees under 0% commission) → strong_keep 18.
- Watched OrderOut flat-fee POS router vs Otter tablet. Skip forecasting.
- Ledger v1.46.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (guest-fee SalesLead completes 5 love markets)

- Added pain-to-sales-guest-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json.
- validate-guest-fee-dogfood.mjs ≥5; CI wired. Contrasts diner tech fees vs Shop ~6% + Marketplace rent.
- Ledger v1.47.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (market-coverage includes guest-fee)

- validate-market-coverage chain now love→keep-grader→social-shop→guest-fee→script-draft→catalog-sync.
- Ledger v1.48.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (guest_paid_platform_fee KEEP signal)

- Adopted guest_paid_platform_fee on KEEP scorer (CLI + keepChannelGrade sibling marketplaceKeepScore.ts).
- CI smoke for DevourNow-class “customers pay $2.99 tech fee”. Distinct from restaurant-paid per_order fees.
- Ledger v1.49.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Otter per-order SalesLead + IG checkout refresh)

- Added pain-to-sales-otter-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json (restaurant-paid ~$0.15+/order under 0% OO claim).
- validate-otter-fee-dogfood.mjs ≥5; CI wired as parallel gate (not yet in market-coverage chain).
- IG Shopping 2026: native Checkout still cited at 5%/$0.40 min; link-out often $0 Meta selling fee — watch only; keep social_fee_pct=6.
- Ledger v1.50.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (otter-fee coverage + BentoBox diner fee)

- Folded otter-fee into validate-market-coverage chain (guest-fee→otter-fee→script→catalog).
- Adopted pain-scan-bentobox-guest-fee.json ($0.99 diner fee on QR Order & Pay) → strong_keep 19; distinct from restaurant-paid bentobox-per-order.
- Klikit Shop middleware refresh stays watch (APAC). Menufy flat OO already watched.
- Ledger v1.51.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (UpMenu overage SalesLead + ChowNow refresh)

- Added pain-to-sales-upmenu-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json ($1.90/order after 75/210 caps).
- validate-upmenu-fee-dogfood.mjs ≥5; CI wired as parallel gate.
- ChowNow ~$149 flat OO pricing refresh → watch only (not Shop-native).
- Ledger v1.52.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Owner Flex/guest 5% SalesLead + Ontabee watch)

- Adopted pain-scan-owner-guest-fee.json (guest 5% order support on Flex AND Flat) → strong_keep 20.
- Added pain-to-sales-owner-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-owner-fee-dogfood ≥5.
- Watched Ontabee ($49 flat, no %) as Owner cost alternative — not Shop-native.
- Ledger v1.53.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Popmenu $1/order guest fee SalesLead)

- Adopted pain-scan-popmenu-guest-fee.json ($1/order guest-passable under commission-free OO add-on) → strong_keep 21.
- Added pain-to-sales-popmenu-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-popmenu-fee-dogfood ≥5.
- Ledger v1.54.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Flipdish 2–7% + Slice watch)

- Widened first_party_pct_fee for Flipdish-class 2–7% direct commissions (CLI + marketplaceKeepScore.ts).
- Adopted pain-scan-flipdish-pct-fee.json + 5 flipdish-fee SalesLeads; validate-flipdish-fee-dogfood ≥5 → strong_keep 23.
- Watched Slice (5% Family / ~$3 card order) — pizza niche only.
- Ledger v1.55.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Lunchbox guest convenience fee + Olo refresh)

- Adopted pain-scan-lunchbox-guest-fee.json (free/no-commission OO, guest pays convenience fee) → strong_keep 24.
- Added pain-to-sales-lunchbox-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-lunchbox-fee-dogfood ≥5.
- Olo App 0% + Order with Google fee → watch refresh (enterprise).
- Ledger v1.56.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Menufy guest convenience fee + CloudWaitress watch)

- Adopted pain-scan-menufy-guest-fee.json (guest fee on direct + ~12.5% hybrid) → strong_keep 25.
- Added pain-to-sales-menufy-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-menufy-fee-dogfood ≥5.
- Watched CloudWaitress as GloriaFood EOL successor (~$39/mo 0%).
- Ledger v1.57.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Zay-OS guest per-order fee SalesLead)

- Adopted pain-scan-zayos-guest-fee.json (guests pay ~$1.99–$3.99/order under commission-free claim) → strong_keep 26.
- Added pain-to-sales-zayos-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-zayos-fee-dogfood ≥5.
- Ledger v1.58.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (247waiter $0.25/order transmission SalesLead)

- Adopted pain-scan-247waiter-per-order.json ($45/mo + restaurant-paid $0.25/order transmission under no-commission OO) → strong_keep 27.
- Added pain-to-sales-247waiter-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-247waiter-fee-dogfood ≥5.
- Ledger v1.59.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.

### 2026-09-04 (Outbites $1/fulfilled-order Pass SalesLead)

- Widened per_order_platform_fee for “per fulfilled order”; pain-scan-outbites-per-order.json → strong_keep 28.
- Added pain-to-sales-outbites-fee-{girl-goat,franklin,michaels-genuine,husk,rioja}.json; validate-outbites-fee-dogfood ≥5.
- Promoted Outbites watch→adopt. Ledger v1.60.0. Auth still BLOCKED_UNTIL_SECRETS_OR_DESKTOP.
