# Skill: Report Ingest

**Used by:** `never86-report-ops` parents, subs, venue scouts.  
**Trigger:** new CSV / Excel / PDF / Google Sheet / email attachment / phone photo dropped.

**Goal:** Classify the file into the right report sub-agent and normalize it.

1. Match filename + headers against `agent/report-ops/catalog.json` `file_globs` and known schemas.
2. Detect venue hints: Grill, Taco Bamba / Taco Bomb, Community Pizza / CTAP.
3. Route to sub-agent (`time-entries`, `item-selection`, `z-report`, `liquor-beer-par`, `vendor-invoice`, …).
4. For Toast Time Entries + Item Selection pairs, run:
   `node scripts/parse-toast-reports.mjs --labor … --sales … --out … [--anonymize]`
5. **Vendor invoices — photo-first for owner 1–5:**
   - Primary: phone photos (jpg/png/heic). Run `invoice-photo-ocr` → `schemas/vendor-invoice.json`.
   - Small ICPs will dump huge photo batches — rotate, staple pairs, blur are normal. Do not reject for OCR mess alone; flag `low_confidence` and teach-batch.
   - Bonus: emailed PDF/CSV when they forward (`source_channel: email`).
6. Persist a snapshot under `fixtures/toast/` or venue folder; never commit multi‑MB photo blobs or card PANs.
7. Queue `report-teach-batch` for anything Kristen-sourced, unlabeled, or `ocr_confidence < 50`.

**Done when:** file has `report_id`, `venue_id` (or `needs_research`), `source_channel` when known, and normalized JSON.
