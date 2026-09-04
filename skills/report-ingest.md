# Skill: Report Ingest

**Used by:** `never86-report-ops` parents, subs, venue scouts.  
**Trigger:** new CSV / Excel / PDF / Google Sheet dropped (upload, Drive, or Gmail attachment).

**Goal:** Classify the file into the right report sub-agent and normalize it.

1. Match filename + headers against `agent/report-ops/catalog.json` `file_globs` and known schemas.
2. Detect venue hints: Grill, Taco Bamba / Taco Bomb, Community Pizza / CTAP.
3. Route to sub-agent (`time-entries`, `item-selection`, `z-report`, `liquor-beer-par`, …).
4. For Toast Time Entries + Item Selection pairs, run:
   `node scripts/parse-toast-reports.mjs --labor … --sales … --out … [--anonymize]`
5. Persist a snapshot under `fixtures/toast/` or venue folder; never commit raw PII without `--anonymize`.
6. Queue `report-teach-batch` for anything Kristen-sourced or unlabeled.

**Done when:** file has `report_id`, `venue_id` (or `needs_research`), and normalized JSON.
