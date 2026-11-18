# @never86/tenant-data-lake

Tenant-scoped Neon Postgres data lake importer. First tenant: Kristin Aduna
(`ktmaduna@gmail.com`, `operator_id = kristin-grill`, The New American Grill).

Full docs: [`docs/TENANT-DATA-LAKE.md`](../../docs/TENANT-DATA-LAKE.md).

```bash
npm install

# Apply the schema migration to Neon
DATABASE_URL="postgresql://..." npm run migrate:kristin-grill

# Preview a workbook without writing anything
node src/import-tenant-workbook.mjs --email ktmaduna@gmail.com \
  --file fixtures/sample-toast-reports-2026-09-01.xlsx --dry-run

# Import for real
node src/import-tenant-workbook.mjs \
  --operator kristin-grill --email ktmaduna@gmail.com --subject "Toast Reports" \
  --email-date 2026-09-01 --file /path/to/ToastReports.xlsx --database-url "$DATABASE_URL"

npm test
```
