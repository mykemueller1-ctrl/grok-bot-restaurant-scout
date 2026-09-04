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
