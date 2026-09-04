# Skill: Catalog Sync

**Trigger:** on ContentDraft APPROVED.

**Goal:** Put the brand's food on Never86's social buy-now rail (TikTok/Instagram), not a third-party delivery marketplace.

1. Convert draft → TikTok Shop / Never86 product payload (title, description, images, price, category, fulfillment).
2. Attach `buy_now_path` from the love fixture / script-draft lead (Shopify merch, brand-site marketplace leak, Resy/Toast, etc.) so the sandbox payload remembers the wedge.
3. Call commerce engine `POST /products/sync`.
4. Record returned `tiktokProductId` (or Never86 product id).
5. Notify owner: "Product live in sandbox — attach to your next video via Add Link / buy-now."

**Active dogfood:** `fixtures/tool-hunt/catalog-sync-*-sandbox.json` (5 markets; `product.buy_now_path.rails` required by `validate-buy-now-dogfood.mjs`). Payload-only until ContentDraft APPROVED.

**Never** sync live without APPROVED + approvals MCP.
**Never** treat this as marketplace delivery listing setup.
