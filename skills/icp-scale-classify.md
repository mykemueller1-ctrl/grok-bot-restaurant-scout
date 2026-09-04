# Skill: ICP Scale Classify

**Used by:** ICP Scale parent + `owner-1-5` / `area-leader` / `cfo-ceo` subs.  
**Trigger:** after `report-ingest`, or when teach batch needs an ICP tag.

**Goal:** Tag every pack `icp_tier` so Never86 never pitches enterprise altitude to a clipboard buyer.

## Signals → tier

| Signal | Tier |
| --- | --- |
| Kitchen labor card photo, Calendarpedia week grid, Hy-Vee/distributor slip, owner on every open shift | `owner-1-5` |
| Single-store Toast Sales Summary / Labor Breakdown / Time Entries | `owner-1-5` (or early 1–5) |
| Sales Labor Report MP with Area Leader + Location + Region + System | `area-leader` |
| Portfolio consolidations, identical multi-entity P&Ls, CFO/Controller language | `cfo-ceo` |

## Rules

1. Prefer the **lowest** tier that fits the artifact (paper card ≠ CFO).
2. Multi-unit Excel with area leaders → `area-leader` even if CEO will eventually see System rollup.
3. Persist `icp_tier` on the snapshot; hand wrong-tier labels to Report Teacher as `wrong_icp`.
4. Read `docs/ICP-SCALE.md` before inventing new pains.

**Done when:** pack has `icp_tier` + matched report_ids for that tier.
