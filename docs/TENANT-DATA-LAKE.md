# Tenant data lake — Neon Postgres

First real tenant: **Kristin Aduna** (`ktmaduna@gmail.com`), operator of **The New American Grill**
(the same venue as `fixtures/portals/grill` / `docs/TOAST-REPORTS.md`). `operator_id = kristin-grill`.

Code lives in `services/tenant-data-lake/` and is independent of `services/pain-leads-api`
(the Grok Bot leads product) and `services/portal-gateway` (the venue portal UI/auth). This
service does **not** deploy to Vercel and does **not** touch the portal UI or its auth flow —
it only writes rows into Kristin's own Postgres schema.

## Why a data lake, and why per-tenant schemas

Every operator we onboard emails or hands over raw Toast POS exports (Time Entries, Item
Selection Details / product mix) and vendor invoices. This service turns those Excel
attachments into structured rows in Neon Postgres, with **every row tagged back to the exact
email + file it came from** so numbers are always auditable.

Each tenant gets its **own Postgres schema** (`tenant_<operator_id, dashes → underscores>`), not
just a shared table filtered by `operator_id`. That's a hard isolation boundary: a bug in one
tenant's query can't leak into another tenant's rows, and a tenant's schema can be dropped or
exported independently. `operator_id` is still stored on every row as a belt-and-suspenders check
and for any future cross-tenant reporting views.

## Schema (`tenant_kristin_grill`)

Migration: [`services/tenant-data-lake/migrations/0001_kristin_grill.sql`](../services/tenant-data-lake/migrations/0001_kristin_grill.sql).

| Table | Grain | Notes |
| --- | --- | --- |
| `source_files` | one row per ingested attachment | `source_email`, `email_subject`, `email_date`, `file_name`, `sheet_name`, `row_count`, `imported_at` |
| `daily_sales` | one row per business date | rolled up from non-voided `menu_items` rows on import |
| `labor_hours` | one row per Toast Time Entries punch | employee, job title, in/out, payable hours, labor cost |
| `menu_items` | one row per Item Selection Details line | qty, net/gross sales, `voided` + `void_reason` kept for audit |
| `vendors` | one row per vendor name (unique per tenant) | de-duped on import via `ON CONFLICT` |
| `invoices` | one row per invoice | `vendor_id` FK, `week_label` (e.g. "Week 10"), `line_items` JSONB |

Every table (except `source_files`, `daily_sales` which has no single vendor/email owner beyond
the file it rolled up from) carries `operator_id`, `source_email`, `file_name`, and `imported_at`
so you can always answer "which email/file did this number come from, and when did we load it".

Apply the migration against Neon:

```bash
cd services/tenant-data-lake
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require" \
  npm run migrate:kristin-grill
```

## Importing Toast + invoice attachments

1. Download the Excel (`.xlsx`/`.xls`) attachments from Kristin's Gmail threads by hand (this
   repo has no Gmail connector wired up — there's no MCP tool here that can browse a Gmail
   inbox on its own; see "Known gap" below).
2. Run the importer once per file, tagging it with the sender email, subject, and email date:

   ```bash
   cd services/tenant-data-lake
   npm install

   node src/import-tenant-workbook.mjs \
     --operator kristin-grill \
     --email ktmaduna@gmail.com \
     --subject "Toast Reports" \
     --email-date 2026-09-01 \
     --file /path/to/ToastReports-2026-09-01.xlsx \
     --database-url "$DATABASE_URL"

   node src/import-tenant-workbook.mjs \
     --operator kristin-grill \
     --email ktmaduna@gmail.com \
     --subject "Invoice for Week 10" \
     --email-date 2026-09-04 \
     --file /path/to/Invoice-Week-10.xlsx \
     --database-url "$DATABASE_URL"
   ```

   Add `--dry-run` (no `DATABASE_URL` needed) to preview parsed row counts before writing
   anything.

The importer (`services/tenant-data-lake/src/parse-workbook.mjs`) classifies each worksheet by
its header row rather than its sheet name, since Toast/vendor export sheet names vary:

- Headers like `Employee` / `Job Title` / `In Date` / `Payable Hours` → `labor_hours`
- Headers like `Menu Item` / `Qty` / `Net Price` → `menu_items` (+ `daily_sales` roll-up)
- Headers like `Vendor` / `Invoice #` / `Amount` → `vendors` + `invoices`

Two tiny fixture workbooks (`services/tenant-data-lake/fixtures/*.xlsx`) exercise all three
shapes end-to-end — see `services/tenant-data-lake/test/parse-workbook.test.mjs`.

## Example queries

```sql
-- Net sales by day
SELECT business_date, net_sales
FROM tenant_kristin_grill.daily_sales
ORDER BY business_date;

-- Labor $ vs sales for a given day (sales_per_labor_hour style rollup)
SELECT d.business_date,
       d.net_sales,
       SUM(l.payable_hours) AS payable_hours,
       ROUND(d.net_sales / NULLIF(SUM(l.payable_hours), 0), 2) AS net_sales_per_labor_hour
FROM tenant_kristin_grill.daily_sales d
JOIN tenant_kristin_grill.labor_hours l ON l.business_date = d.business_date
GROUP BY d.business_date, d.net_sales
ORDER BY d.business_date;

-- Top menu items by net sales, excluding voids
SELECT menu_item, SUM(qty_sold) AS qty, SUM(net_sales) AS net_sales
FROM tenant_kristin_grill.menu_items
WHERE NOT voided
GROUP BY menu_item
ORDER BY net_sales DESC
LIMIT 10;

-- Open invoices by vendor
SELECT v.vendor_name, i.invoice_number, i.week_label, i.due_date, i.amount_total
FROM tenant_kristin_grill.invoices i
JOIN tenant_kristin_grill.vendors v ON v.id = i.vendor_id
WHERE i.status <> 'paid'
ORDER BY i.due_date;

-- Trace a row back to its source email/file
SELECT * FROM tenant_kristin_grill.source_files ORDER BY imported_at DESC;
```

## Adding a future tenant

1. Copy `services/tenant-data-lake/migrations/0001_kristin_grill.sql` to a new migration file
   (e.g. `0002_<operator_id>.sql`) and replace every `tenant_kristin_grill` schema reference and
   `DEFAULT 'kristin-grill'` with the new tenant's schema name / `operator_id`.
2. Apply it against Neon: `psql "$DATABASE_URL" -f services/tenant-data-lake/migrations/000N_<operator_id>.sql`.
3. Run the importer with `--operator <new-operator-id>` — the schema name is derived
   automatically (`tenant_<operator_id with dashes replaced by underscores>`).
4. No product code, portal UI, or auth flow needs to change; this is intentionally decoupled
   from `services/portal-gateway`.

## Known gap: Gmail retrieval is manual for now

Locating and downloading the actual attachments from Kristin's "Toast Reports" (2026-09-01) and
"Invoice for Week 10" (2026-09-04) Gmail threads requires a Gmail connector/credentials that are
not present in this repo or wired into the coding agent's sandbox — there is no Gmail MCP tool
here to browse a live inbox. Until a Gmail connector is wired (mirroring the `mcp/*.json`
connector pattern already used for the commerce engine, lead shop, and social sources), download
attachments by hand and run the importer above. `docs/TOAST-REPORTS.md` already calls this out as
the "holy grail inbox" to connect next.

## Deploy scope

This service is **not** part of `render.yaml` or the Cloudflare Workers deploy in
`scripts/cloudflare-deploy.sh`, and it is **not** deployed to Vercel. It is a standalone
migration + CLI importer meant to be run against Neon from a trusted shell (operator machine or
a future scheduled job) with `DATABASE_URL` set.
