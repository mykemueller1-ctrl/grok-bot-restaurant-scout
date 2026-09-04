# Toast fixture notes

- `labor-sales-inventory.json` — parsed snapshot from operator uploads (labor names anonymized).
- Source report map: `docs/TOAST-REPORTS.md`.
- CTAP seats + front door + historical sales: `../ctap-portal/` (`docs/CTAP-SEATS.md`).
- Re-parse:

```bash
node scripts/parse-toast-reports.mjs \
  --labor /path/TimeEntries.csv \
  --sales /path/ItemSelectionDetails.csv \
  --out fixtures/toast/labor-sales-inventory.json \
  --anonymize
```

CSV headers expected:

- Labor: `Employee,Job Title,In Date,Out Date,Total Hours,Unpaid Break Time,Paid Break Time,Payable Hours`
- Sales: `Order #,Sent Date,Menu Item,Menu Group,Menu,Sales Category,Net Price,Qty,Void?`

## CTAP physical invoice photos (owner 1–5)

- Hand-labeled pack: `ctap-physical/normalized/weekly-invoice-photo-pack-2026-08.json`
- OCR batch: `ctap-physical/normalized/ocr-batch-2026-08.json`
- Re-OCR (needs `tesseract-ocr` + `pip install -r scripts/requirements-ocr.txt`):

```bash
python3 scripts/ocr-vendor-invoice.py /path/to/*.jpg \
  --venue community-pizza \
  --out fixtures/toast/ctap-physical/normalized/ocr-batch-2026-08.json
```

Do not commit raw multi‑MB JPGs — keep them in Drive / local assets; fixtures store normalized JSON only.
