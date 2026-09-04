# Skill: SKU → Recipe / Beer Cost

**Used by:** `recipe-cost`, `beer-cost`, `prime-cost`, `vendor-invoice`, owner-1-5 ICP.  
**Trigger:** new distributor invoice photos with item # / UPC / pack / unit price.

**Goal:** Invoice lines → **vendor SKU directory** → unit cost for **food recipes** and **beer pour cost**.

## Packs

- Curated teach: `fixtures/toast/ctap-physical/normalized/sku-invoice-pack-2026-08.json`
- Doc OCR batch: `fixtures/toast/ctap-physical/normalized/sku-ocr-batch-2026-08.json`
- SKU seed: `agent/report-ops/taxonomy/sku-directory-seed.json`
- Schema: `schemas/vendor-sku-line.json`

## Line coding rules (operator)

| Line | Category |
| --- | --- |
| Meat, cheese, produce, sauce, flour, oil, crust, toppings | `food` |
| Milk, buttermilk, pop, juice, coffee | `na_beverage` (Pop) |
| Pizza boxes, circles, liners, foam, gloves, straws, detergent, rinse | `paper_goods_boxes_chemicals` (under food costs) |
| Humes / FT Dodge / Confluence kegs & cases | `beer` |
| Hy-Vee Wine & Spirits bottles | `liquor` |
| Empty keg / bottle returns | `deposit_credit` |
| Fuel surcharge | `fuel_surcharge` |

**Critical:** Mixed Sysco / Performance / Northern Lights invoices must code **per line**, not whole-doc.

## Recipe / beer math (next)

1. Upsert `sku-directory-seed` from each invoice line (`vendor` + `vendor_sku` + `last_unit_price`).
2. Food recipe BOM: menu item → ingredients × unit cost → portion cost → food cost %.
3. Beer: keg/case cost ÷ sellable oz × pour oz → beer cost % (exclude deposits from contents cost when vendor prints Beer$/Contents$).

## Done when

Each photo pack has line SKUs with `cogs_category` + `unit_price` where readable; recipe-ready SKUs land in the directory; beer lines carry UPC/keg size when present.
