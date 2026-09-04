# Skill: Invoice Photo OCR

**Used by:** `vendor-invoice`, `prime-cost`, `vendor-spend`, Community Pizza venue scout, owner-1-5 ICP.  
**Trigger:** new phone photo(s) of invoices / payout slips / store receipts.

**Goal:** Messy photo firehose → vendor + amount + **COGS category** (food / beer / wine / liquor / pop / paper / supplies). This is the forensic AP intake spine.

## Research spine

`docs/RESTAURANT-AP-OCR.md` + `agent/report-ops/taxonomy/cogs-categories.json`  
Leaders: MarginEdge (photo→code→daily P&L), Ottimate/Plate IQ (AP OCR), R365 (full P&L), xtraCHEF, MarketMan, BevSpot/Partender, ClearCOGS.

## Engines

1. **RapidOCR (ONNX)** — primary for messy phone photos  
2. **Tesseract** — fallback  
3. Auto-try rotations 90→0→270→180; pick best content+confidence score

```bash
pip install -r scripts/requirements-ocr.txt   # needs tesseract-ocr system package
python3 scripts/ocr-vendor-invoice.py path/to/*.jpg \
  --venue community-pizza --engine auto \
  --out fixtures/toast/ctap-physical/normalized/ocr-batch.json
```

## Category coding

- Vendor directory → default category (Sysco→food, Humes→beer, Hy-Vee Wine→liquor, …)
- Register #2 payout account (4312 Food, Beverage, Misc) overrides
- Line-item keyword hints for beer/liquor/pop/paper on mixed invoices

## Done when

Each image has `vendor`, `amount` (when readable), `cogs_category`, `vendor_type`, `ocr_confidence`. Pack has `category_rollups`. Low-confidence / `uncategorized` → teach-batch for Myke.
