# Skill: Morning Scan

**Trigger:** daily 07:00 local time (routine).

1. Read configured city + cuisine tags from the commerce engine.
2. Use the social plugin (OmniSocials/Blotato/Zernio) to find the top 5 trending food videos/creators in that market.
3. For each, capture: handle, followers, niche tags, hook summary, source URL, score (0-100).
4. Write results to `CreatorLead` via the commerce engine MCP.
5. Output a ranked list to the owner (Telegram/Slack).

**Done when:** 5 verifiable leads returned within 30 minutes.
