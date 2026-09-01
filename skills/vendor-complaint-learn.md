# Skill: Vendor Complaint Learn

**Used by:** every POS and silo vendor agent.  
**Trigger:** after each teach batch (with `recurse-learn`), and weekly consolidation across the family.

**Goal:** Learn complaint language **per vendor at scale** — not one blurry "POS sucks" bucket.

1. For this `vendor_id`, pull labeled leads (`keep` / `reject` / `wrong_pain` / …).
2. Extract and store in the learned bank (`update_learned_bank`):
   - **alias hits** that predicted keep (e.g. "Toast Tab", "Brink by PAR")
   - **phrase clusters** ("crashed mid ticket", "30% effective rate", "hardware lease trap")
   - **anti-patterns** (job seekers, vendor staff, meme reposts, diner complaints)
   - **switch-off language** ("migrating to…", "ripping out…")
   - **co-mentioned silos** (Toast + xtraCHEF, Aloha + Crunchtime) for stack mapping
3. Update `vendors/catalog.json` runtime overlay (MCP-side; repo catalog stays seed):
   - boost/block queries
   - new aliases discovered in the wild
4. Cross-agent pass weekly:
   - if lead tagged `wrong_pain` → route to sibling vendor agent
   - if multi-vendor rant → clone stubs to each named vendor agent with link ids
5. Emit owner note: top new phrases learned for this vendor + keep-rate trend.

**Done when:** learned bank version bumps and next scan uses the new boosts/blocks.
