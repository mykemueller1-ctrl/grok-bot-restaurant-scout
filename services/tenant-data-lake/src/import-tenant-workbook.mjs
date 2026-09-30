#!/usr/bin/env node
/**
 * Import one or more Toast/vendor-invoice Excel workbooks into a tenant's
 * schema in Neon Postgres, tagging every row with its source email, file
 * name, and import timestamp.
 *
 * Usage:
 *   node src/import-tenant-workbook.mjs \
 *     --operator kristin-grill \
 *     --email ktmaduna@gmail.com \
 *     --subject "Toast Reports" \
 *     --file /path/to/ToastReports-2026-09-01.xlsx \
 *     [--email-date 2026-09-01] \
 *     [--database-url "$DATABASE_URL"] \
 *     [--dry-run]
 *
 * Requires DATABASE_URL (Neon connection string) unless --dry-run is set,
 * in which case the workbook is parsed and a summary is printed without
 * connecting to Postgres — useful for previewing an import before it runs.
 */
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { parseArgs } from "node:util";
import ExcelJS from "exceljs";
import pg from "pg";
import { parseWorkbook } from "./parse-workbook.mjs";

const { values } = parseArgs({
  options: {
    operator: { type: "string", default: "kristin-grill" },
    email: { type: "string" },
    subject: { type: "string" },
    "email-date": { type: "string" },
    file: { type: "string", multiple: true },
    "database-url": { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (!values.email || !values.file || values.file.length === 0) {
  console.error(
    "Required: --email <sender> --file <path.xlsx> [--file <path2.xlsx> ...] " +
      "[--operator kristin-grill] [--subject \"Toast Reports\"] [--email-date YYYY-MM-DD] [--dry-run]",
  );
  process.exit(1);
}

const schema = `tenant_${values.operator.replace(/-/g, "_")}`;
const databaseUrl = values["database-url"] || process.env.DATABASE_URL;
// pg.Client() falls back to PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT when no
// connection string is supplied, so only require one of the two explicitly.
const hasPgEnv = Boolean(process.env.PGHOST || process.env.PGDATABASE);

if (!values["dry-run"] && !databaseUrl && !hasPgEnv) {
  console.error(
    "A database connection is required unless --dry-run is set: pass --database-url, " +
      "set DATABASE_URL, or set PGHOST/PGUSER/PGPASSWORD/PGDATABASE.",
  );
  process.exit(1);
}

async function loadWorkbook(path) {
  const wb = new ExcelJS.Workbook();
  const buf = await readFile(path);
  await wb.xlsx.load(buf);
  return wb;
}

async function importFile(client, path) {
  const fileName = basename(path);
  const workbook = await loadWorkbook(path);
  const parsed = parseWorkbook(workbook);
  const importedAt = new Date();

  const summary = {
    file: fileName,
    sheets: parsed.sheets,
    counts: {
      daily_sales: parsed.daily_sales.length,
      labor_hours: parsed.labor_hours.length,
      menu_items: parsed.menu_items.length,
      vendors: parsed.vendors.length,
      invoices: parsed.invoices.length,
    },
  };

  if (values["dry-run"]) {
    return summary;
  }

  const sourceFileRes = await client.query(
    `INSERT INTO ${schema}.source_files
       (operator_id, source_email, email_subject, email_date, file_name, file_type, row_count, imported_at, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (operator_id, source_email, file_name, sheet_name)
       DO UPDATE SET imported_at = EXCLUDED.imported_at, row_count = EXCLUDED.row_count
     RETURNING id`,
    [
      values.operator,
      values.email,
      values.subject || null,
      values["email-date"] || null,
      fileName,
      "xlsx",
      parsed.daily_sales.length +
        parsed.labor_hours.length +
        parsed.menu_items.length +
        parsed.vendors.length +
        parsed.invoices.length,
      importedAt,
      parsed.sheets.map((s) => `${s.name} (${s.kind}, ${s.row_count} rows)`).join("; "),
    ],
  );
  const sourceFileId = sourceFileRes.rows[0].id;

  for (const row of parsed.daily_sales) {
    await client.query(
      `INSERT INTO ${schema}.daily_sales
         (operator_id, business_date, net_sales, gross_sales, tax, tips, discounts, refunds,
          guest_count, check_count, source_file_id, source_email, file_name, imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        values.operator,
        row.business_date,
        row.net_sales,
        row.gross_sales,
        row.tax,
        row.tips,
        row.discounts,
        row.refunds,
        row.guest_count,
        row.check_count,
        sourceFileId,
        values.email,
        fileName,
        importedAt,
      ],
    );
  }

  for (const row of parsed.labor_hours) {
    await client.query(
      `INSERT INTO ${schema}.labor_hours
         (operator_id, business_date, employee_name, job_title, in_at, out_at,
          regular_hours, overtime_hours, payable_hours, labor_cost,
          source_file_id, source_email, file_name, imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        values.operator,
        row.business_date,
        row.employee_name,
        row.job_title,
        row.in_at,
        row.out_at,
        row.regular_hours,
        row.overtime_hours,
        row.payable_hours,
        row.labor_cost,
        sourceFileId,
        values.email,
        fileName,
        importedAt,
      ],
    );
  }

  for (const row of parsed.menu_items) {
    await client.query(
      `INSERT INTO ${schema}.menu_items
         (operator_id, business_date, menu_item, menu_group, menu_name, sales_category,
          qty_sold, net_sales, gross_sales, voided, void_reason,
          source_file_id, source_email, file_name, imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        values.operator,
        row.business_date,
        row.menu_item,
        row.menu_group,
        row.menu_name,
        row.sales_category,
        row.qty_sold,
        row.net_sales,
        row.gross_sales,
        row.voided,
        row.void_reason,
        sourceFileId,
        values.email,
        fileName,
        importedAt,
      ],
    );
  }

  const vendorIdByName = new Map();
  for (const row of parsed.vendors) {
    const res = await client.query(
      `INSERT INTO ${schema}.vendors
         (operator_id, vendor_name, category, contact_email, contact_phone,
          source_file_id, source_email, file_name, imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (operator_id, vendor_name)
         DO UPDATE SET category = COALESCE(EXCLUDED.category, ${schema}.vendors.category),
                        contact_email = COALESCE(EXCLUDED.contact_email, ${schema}.vendors.contact_email),
                        contact_phone = COALESCE(EXCLUDED.contact_phone, ${schema}.vendors.contact_phone)
       RETURNING id, vendor_name`,
      [
        values.operator,
        row.vendor_name,
        row.category,
        row.contact_email,
        row.contact_phone,
        sourceFileId,
        values.email,
        fileName,
        importedAt,
      ],
    );
    vendorIdByName.set(res.rows[0].vendor_name, res.rows[0].id);
  }

  for (const row of parsed.invoices) {
    const vendorId = vendorIdByName.get(row.vendor_name) ?? null;
    const lineItems = row.line_item
      ? JSON.stringify([{ description: row.line_item, amount: row.line_item_amount }])
      : null;
    await client.query(
      `INSERT INTO ${schema}.invoices
         (operator_id, vendor_id, vendor_name, invoice_number, week_label, invoice_date, due_date,
          amount_total, amount_paid, status, line_items,
          source_file_id, source_email, file_name, imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        values.operator,
        vendorId,
        row.vendor_name,
        row.invoice_number,
        row.week_label,
        row.invoice_date,
        row.due_date,
        row.amount_total,
        row.amount_paid,
        row.status,
        lineItems,
        sourceFileId,
        values.email,
        fileName,
        importedAt,
      ],
    );
  }

  return summary;
}

const summaries = [];
if (values["dry-run"]) {
  for (const file of values.file) {
    summaries.push(await importFile(null, resolve(file)));
  }
} else {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    for (const file of values.file) {
      summaries.push(await importFile(client, resolve(file)));
    }
  } finally {
    await client.end();
  }
}

console.log(JSON.stringify({ operator: values.operator, dry_run: values["dry-run"], imports: summaries }, null, 2));
