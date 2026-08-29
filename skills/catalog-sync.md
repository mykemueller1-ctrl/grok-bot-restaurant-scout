# Skill: Catalog Sync

**Trigger:** on ContentDraft APPROVED.

1. Convert draft → TikTok Shop product payload (title, description, images, price, category, fulfillment).
2. Call commerce engine `POST /products/sync`.
3. Record returned `tiktokProductId`.
4. Notify owner: "Product live in sandbox — attach to your next video via Add Link."
