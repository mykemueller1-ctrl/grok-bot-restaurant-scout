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
