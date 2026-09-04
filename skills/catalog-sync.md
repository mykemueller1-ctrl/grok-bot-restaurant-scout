# Skill: Catalog Sync

**Trigger:** on ContentDraft APPROVED.

**Goal:** Put the brand's food on Never86's social buy-now rail (TikTok/Instagram), not a third-party delivery marketplace.

1. Convert draft → TikTok Shop / Never86 product payload (title, description, images, price, category, fulfillment).
2. Call commerce engine `POST /products/sync`.
3. Record returned `tiktokProductId` (or Never86 product id).
4. Notify owner: "Product live in sandbox — attach to your next video via Add Link / buy-now."

**Active dogfood:** `fixtures/tool-hunt/catalog-sync-franklin-sandbox.json` (payload-only until ContentDraft APPROVED).

**Never** sync live without APPROVED + approvals MCP.
**Never** treat this as marketplace delivery listing setup.
