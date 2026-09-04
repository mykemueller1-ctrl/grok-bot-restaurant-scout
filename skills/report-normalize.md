# Skill: Report Normalize

**Used by:** report sub-agents.  
**Trigger:** after route assigns a file to this sub.

**Goal:** Emit schema-clean rows for this report only.

## Time Entries
Map columns → `schemas/labor-time-entry.json`. Roll `by_job` + `by_employee`.

## Item Selection / Product Mix
Map → `schemas/product-mix-sku.json`. Hierarchy: Sales Category → Menu → Menu Group → Menu Item (SKU). Skip voids + `**********` course lines. Line `Net Price` is already qty-inclusive.

## Z-Report
Extract day net, tenders, voids/comps, sales categories when present (PDF OCR or CSV).

## Liquor / Beer Par
Extract par, qty to order, cost, over/under budget by SKU.

## SKU Depletion
Copy product-mix qty → `inventory_depletion_qty` on the combined snapshot schema.

**Done when:** normalized payload validates against the sub-agent's schema/signals list.
