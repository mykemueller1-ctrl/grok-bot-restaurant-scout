# Skill: Morning Scan

**Trigger:** daily 07:00 local time (routine).

**Goal:** Find chef-driven / already-loved food brands (UGC proof) that fit **Never86 buy-now** — shoppable TikTok/IG without DoorDash-style marketplace rent. Not cold websites. Not forecasting targets.

1. Read configured city + cuisine tags from the commerce engine.
2. Discover love signals:
   - Prefer social plugin (OmniSocials/Blotato/Zernio) when connected.
   - Else Composio `COMPOSIO_SEARCH_WEB` / public SERP for recent chef/cult kitchen UGC (Bright Data if auth’d).
   - When Instagram Composio `never86` is Active, sample Business/Creator media for food love proofs (read-only).
3. For each of top 5, capture:
   - handle, followers, niche tags
   - hook summary + why people love it (UGC signal)
   - brand / kitchen name if identifiable
   - source URL, score (0–100)
   - Never86 fit note: shoppable SKU potential vs marketplace-only vibe
   - Rival wedge check: would Owner/Trenz-style “first-party marketing” or generic AI menu-video (PlateAI/Flik) own this better, or does **buy-now + cult proof** win?
4. Write results to `CreatorLead` via the commerce engine MCP.
5. Output a ranked list framed as **onboarding targets**, not content ideas alone.

**Done when:** 5 verifiable, love-proven leads returned within 30 minutes. Never post without approval.
