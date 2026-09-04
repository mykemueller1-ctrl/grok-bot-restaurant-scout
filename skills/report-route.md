# Skill: Report Route

**Used by:** domain parent agents (`labor`, `sales`, `inventory`).  
**Trigger:** after `report-ingest` or when a pack spans multiple report types.

**Goal:** Fan a dump into the right sub-agents and roll results up.

1. Parent reads ingest tags (`report_id`, formats, venue).
2. Spawn / wake matching sub-agents only — do not run the whole swarm on one file.
3. Collect sub outputs: labor hours by job, SKU mix, Z day net, par over/under.
4. Build the domain card (labor card / sales card / inventory card).
5. If sales + labor windows align, compute `sales_per_labor_hour`; else flag directional-only.
6. Hand the card to Report Teacher for Myke labels when confidence < teach threshold or source is Kristen holy grail.
