import assert from "node:assert/strict";
import { test } from "node:test";
import ExcelJS from "exceljs";
import { parseWorkbook } from "../src/parse-workbook.mjs";

async function buildSampleWorkbook() {
  const wb = new ExcelJS.Workbook();

  const labor = wb.addWorksheet("Time Entries");
  labor.addRow(["Employee", "Job Title", "In Date", "Out Date", "Payable Hours"]);
  labor.addRow(["Jamie Lee", "Server", "9/1/2026 10:00", "9/1/2026 18:00", 8]);
  labor.addRow(["Sam Rivera", "Cook", "9/1/2026 09:00", "9/1/2026 17:30", 8.5]);

  const sales = wb.addWorksheet("Item Selection Details");
  sales.addRow([
    "Sent Date",
    "Menu Item",
    "Menu Group",
    "Menu",
    "Sales Category",
    "Qty",
    "Net Price",
    "Void?",
  ]);
  sales.addRow(["9/1/2026", "Cheeseburger", "Entrees", "Dinner", "Food", 12, 143.88, "false"]);
  sales.addRow(["9/1/2026", "Draft Beer", "Draft", "Beer", "Liquor", 20, 100, "false"]);
  sales.addRow(["9/1/2026", "Void Item", "Entrees", "Dinner", "Food", 1, 10, "true"]);

  const invoices = wb.addWorksheet("Invoices");
  invoices.addRow(["Vendor", "Invoice #", "Week", "Invoice Date", "Due Date", "Amount", "Status"]);
  invoices.addRow(["Sysco", "INV-1001", "Week 10", "9/2/2026", "9/16/2026", 1875.42, "unpaid"]);

  return wb;
}

test("parseWorkbook extracts labor, sales, and invoice sheets", async () => {
  const wb = await buildSampleWorkbook();
  const parsed = parseWorkbook(wb);

  assert.equal(parsed.labor_hours.length, 2);
  assert.equal(parsed.labor_hours[0].employee_name, "Jamie Lee");
  assert.equal(parsed.labor_hours[0].job_title, "Server");
  assert.equal(parsed.labor_hours[0].payable_hours, 8);

  // Void row should be excluded from menu_items totals used for daily_sales,
  // but still recorded as a voided menu_items row for audit purposes.
  assert.equal(parsed.menu_items.length, 3);
  const voidRow = parsed.menu_items.find((r) => r.menu_item === "Void Item");
  assert.equal(voidRow.voided, true);

  assert.equal(parsed.daily_sales.length, 1);
  assert.equal(parsed.daily_sales[0].business_date, "2026-09-01");
  assert.equal(parsed.daily_sales[0].net_sales, 243.88);

  assert.equal(parsed.vendors.length, 1);
  assert.equal(parsed.vendors[0].vendor_name, "Sysco");

  assert.equal(parsed.invoices.length, 1);
  assert.equal(parsed.invoices[0].invoice_number, "INV-1001");
  assert.equal(parsed.invoices[0].week_label, "Week 10");
  assert.equal(parsed.invoices[0].amount_total, 1875.42);

  const kinds = Object.fromEntries(parsed.sheets.map((s) => [s.name, s.kind]));
  assert.equal(kinds["Time Entries"], "labor");
  assert.equal(kinds["Item Selection Details"], "sales");
  assert.equal(kinds["Invoices"], "invoice");
});

test("parseWorkbook ignores sheets with no recognizable columns", async () => {
  const wb = new ExcelJS.Workbook();
  const notes = wb.addWorksheet("Notes");
  notes.addRow(["Random", "Columns"]);
  notes.addRow(["foo", "bar"]);

  const parsed = parseWorkbook(wb);
  assert.equal(parsed.sheets.length, 1);
  assert.equal(parsed.sheets[0].kind, "unrecognized");
  assert.equal(parsed.daily_sales.length, 0);
  assert.equal(parsed.labor_hours.length, 0);
});
