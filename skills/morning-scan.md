# Skill: Morning Scan

**Trigger:** daily 07:00 local time (routine).

**Goal:** Find chef-driven / already-loved food brands (UGC proof), not random restaurants. These are Never86 onboarding targets.

1. Read configured city + cuisine tags from the commerce engine.
2. Use the social plugin (OmniSocials/Blotato/Zernio) to find the top 5 food videos/creators where people clearly love the food (chef brands, cult kitchens, local favorites blowing up).
3. For each, capture:
   - handle, followers, niche tags
   - hook summary + why people love it (UGC signal)
   - brand / kitchen name if identifiable
   - source URL, score (0–100)
   - Never86 fit note (shoppable SKU potential vs marketplace-only vibe)
4. Write results to `CreatorLead` via the commerce engine MCP.
5. Output a ranked list to the owner (Telegram/Slack) framed as **onboarding targets**, not content ideas alone.

**Done when:** 5 verifiable, love-proven leads returned within 30 minutes.
