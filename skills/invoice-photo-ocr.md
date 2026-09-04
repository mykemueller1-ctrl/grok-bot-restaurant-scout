# Skill: Invoice Photo OCR

**Used by:** `vendor-invoice` sub-agent, Community Pizza / CTAP venue scout, owner-1-5 ICP.  
**Trigger:** new phone photo(s) of invoices, payout slips, or store receipts (Drive dump, Telegram, upload).

**Goal:** Turn messy countertop photos into `schemas/vendor-invoice.json` rows at scale. Small ICPs will dump millions of these — photo OCR is the spine, not a fallback.

## Reality

- Photos arrive rotated 90/180/270°, stapled payout↔receipt pairs, shadows, tears, blur.
- Register #2 payout slips code Food / Bread / Misc onto Hy-Vee / Fareway / Menards runs.
- Distributor pages (Sysco, PFS, Northern Lights, beer houses) are dense grids — expect partial line-item OCR; totals + vendor + date still win.

## Steps

1. Batch images into the venue week folder (do not commit multi‑MB JPGs to git).
2. Run:

```bash
python3 scripts/ocr-vendor-invoice.py path/to/*.jpg \
  --venue community-pizza \
  --out fixtures/toast/ctap-physical/normalized/ocr-batch-YYYY-MM.json
```

3. Script auto-tries 0/90/180/270, picks best Tesseract confidence, extracts vendor / date / amount / account / employee / invoice #.
4. Tag `source_channel: photo`. Flag `low_confidence`, `rotated`, `partial`.
5. Queue `report-teach-batch` for low-confidence + unknown vendor docs — Myke labels keep/reject/wrong_report.
6. Email PDF invoices (`source_channel: email`) still ingest when present — bonus, not required for owner 1–5 to work.

## Done when

Pack JSON has one doc per image (or stapled pair), schema-shaped, with stats (mean confidence, rotated count, vendors). Teach batch ready for anything under ~50 confidence or `vendor: unknown`.
