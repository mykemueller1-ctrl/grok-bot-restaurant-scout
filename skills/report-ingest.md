# Skill: Report Ingest

**Used by:** `never86-report-ops` parents, subs, venue scouts.  
**Trigger:** new CSV / Excel / PDF / Google Sheet / email attachment dropped (upload, Drive, or Gmail forward).

**Goal:** Classify the file into the right report sub-agent and normalize it.

1. Match filename + headers against `agent/report-ops/catalog.json` `file_globs` and known schemas.
2. Detect venue hints: Grill, Taco Bamba / Taco Bomb, Community Pizza / CTAP.
3. Route to sub-agent (`time-entries`, `item-selection`, `z-report`, `liquor-beer-par`, `vendor-invoice`, …).
4. For Toast Time Entries + Item Selection pairs, run:
   `node scripts/parse-toast-reports.mjs --labor … --sales … --out … [--anonymize]`
5. **Vendor invoices — prefer email:**
   - Target source: forwarded / auto-routed **email PDF/CSV** from Sysco, PFS, beer houses, Northern Lights, etc.
   - Tag `source_channel: email` when ingesting attachments from Gmail/Drive invoice folders.
   - Phone photos of paper invoices / stapled payout↔receipts are **as-is pain evidence** (owner 1–5 still doing human AP). Normalize them, but do not treat photo capture as the desired workflow — coach toward email intake.
   - Keep blurry/stained shots as capture evidence; do not reject solely for OCR failure.
6. Persist a snapshot under `fixtures/toast/` or venue folder; never commit raw card PANs / full account secrets.
7. Queue `report-teach-batch` for anything Kristen-sourced or unlabeled.

**Done when:** file has `report_id`, `venue_id` (or `needs_research`), `source_channel` when known, and normalized JSON.
