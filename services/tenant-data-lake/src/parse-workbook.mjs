/**
 * Parse a Toast (or vendor invoice) Excel workbook into tenant data-lake rows.
 *
 * Toast xlsx exports vary by report type, so sheets are classified by header
 * shape rather than by name: a "Time Entries" style sheet becomes labor_hours,
 * an "Item Selection Details" / product-mix style sheet becomes menu_items +
 * daily_sales roll-ups, and an invoice-style sheet (Vendor / Invoice # / Amount)
 * becomes vendors + invoices.
 *
 * Pure/no I/O beyond the ExcelJS workbook object so it can be unit tested with
 * an in-memory workbook.
 */

/** Normalize a header cell into a lowercase, punctuation-free key. */
function headerKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cellValue(cell) {
  if (cell == null) return "";
  if (typeof cell === "object") {
    if (cell.result !== undefined) return cell.result;
    if (cell.text !== undefined) return cell.text;
    if (cell instanceof Date) return cell;
  }
  return cell;
}

function num(v) {
  if (v == null || v === "") return null;
  if (v instanceof Date) return null;
  const n = Number.parseFloat(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function str(v) {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v).trim();
}

function toDateOnly(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) {
    const [, mo, d, y] = m;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const iso = s.match(/^\d{4}-\d{2}-\d{2}/);
  return iso ? iso[0] : null;
}

function truthy(v) {
  const s = String(v ?? "").toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

/** Read a worksheet into an array of {header: value} row objects. */
function sheetToRows(worksheet) {
  const rows = [];
  let headers = null;
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    const values = row.values.slice(1).map(cellValue);
    if (!headers) {
      headers = values.map(headerKey);
      return;
    }
    const record = {};
    headers.forEach((h, i) => {
      if (h) record[h] = values[i];
    });
    if (Object.values(record).some((v) => v !== undefined && v !== "" && v !== null)) {
      rows.push(record);
    }
  });
  return headers ? rows : [];
}

const LABOR_HEADERS = ["employee", "job_title", "in_date", "out_date", "payable_hours"];
const SALES_HEADERS = ["menu_item", "qty", "net_price"];
const INVOICE_HEADERS = ["vendor", "invoice", "amount"];

function headerScore(record, wantedPrefixes) {
  const keys = Object.keys(record);
  return wantedPrefixes.reduce(
    (score, prefix) => score + (keys.some((k) => k.includes(prefix)) ? 1 : 0),
    0,
  );
}

function findKey(record, ...candidates) {
  const keys = Object.keys(record);
  for (const candidate of candidates) {
    const exact = keys.find((k) => k === candidate);
    if (exact) return exact;
  }
  for (const candidate of candidates) {
    const partial = keys.find((k) => k.includes(candidate));
    if (partial) return partial;
  }
  return null;
}

function get(record, ...candidates) {
  const key = findKey(record, ...candidates);
  return key ? record[key] : undefined;
}

function parseLaborSheet(rows) {
  const laborHours = [];
  for (const r of rows) {
    const employee = str(get(r, "employee", "employee_name", "name"));
    if (!employee) continue;
    const inAt = get(r, "in_date", "in_time", "clock_in");
    const outAt = get(r, "out_date", "out_time", "clock_out");
    laborHours.push({
      business_date: toDateOnly(inAt),
      employee_name: employee,
      job_title: str(get(r, "job_title", "job", "role")),
      in_at: inAt ? str(inAt) : null,
      out_at: outAt ? str(outAt) : null,
      regular_hours: num(get(r, "regular_hours")),
      overtime_hours: num(get(r, "overtime_hours", "overtime")),
      payable_hours: num(get(r, "payable_hours", "total_hours")),
      labor_cost: num(get(r, "labor_cost", "total_pay", "gross_pay")),
    });
  }
  return laborHours;
}

function isPlaceholderItem(name) {
  const n = str(name);
  if (!n) return true;
  if (/^\*+$/.test(n)) return true;
  if (/^course\s*line$/i.test(n)) return true;
  return false;
}

function parseSalesSheet(rows) {
  const menuItems = [];
  const byDate = new Map();
  for (const r of rows) {
    const menuItem = str(get(r, "menu_item", "item", "sku"));
    if (isPlaceholderItem(menuItem)) continue;
    const voided = truthy(get(r, "void", "voided"));
    const qty = num(get(r, "qty", "quantity")) ?? 0;
    const net = num(get(r, "net_price", "net_sales", "net_amount")) ?? 0;
    const gross = num(get(r, "gross_price", "gross_sales", "gross_amount"));
    const businessDate = toDateOnly(get(r, "sent_date", "order_date", "business_date", "date"));

    menuItems.push({
      business_date: businessDate,
      menu_item: menuItem,
      menu_group: str(get(r, "menu_group")),
      menu_name: str(get(r, "menu")),
      sales_category: str(get(r, "sales_category", "category")),
      qty_sold: qty,
      net_sales: net,
      gross_sales: gross,
      voided,
      void_reason: voided ? str(get(r, "void_reason", "reason")) || null : null,
    });

    if (!voided && businessDate) {
      const bucket = byDate.get(businessDate) ?? { net_sales: 0, gross_sales: 0, qty: 0 };
      bucket.net_sales += net;
      bucket.gross_sales += gross ?? 0;
      bucket.qty += qty;
      byDate.set(businessDate, bucket);
    }
  }

  const dailySales = [...byDate.entries()].map(([business_date, totals]) => ({
    business_date,
    net_sales: Math.round(totals.net_sales * 100) / 100,
    gross_sales: totals.gross_sales ? Math.round(totals.gross_sales * 100) / 100 : null,
    tax: null,
    tips: null,
    discounts: null,
    refunds: null,
    guest_count: null,
    check_count: null,
  }));

  return { menuItems, dailySales };
}

function parseInvoiceSheet(rows) {
  const vendorsByName = new Map();
  const invoices = [];
  for (const r of rows) {
    const vendorName = str(get(r, "vendor", "vendor_name", "supplier"));
    if (!vendorName) continue;
    if (!vendorsByName.has(vendorName)) {
      vendorsByName.set(vendorName, {
        vendor_name: vendorName,
        category: str(get(r, "category")) || null,
        contact_email: str(get(r, "contact_email", "email")) || null,
        contact_phone: str(get(r, "contact_phone", "phone")) || null,
      });
    }
    const lineItemDesc = get(r, "line_item", "description", "item");
    invoices.push({
      vendor_name: vendorName,
      invoice_number: str(get(r, "invoice_number", "invoice", "invoice_no")) || null,
      week_label: str(get(r, "week", "week_label")) || null,
      invoice_date: toDateOnly(get(r, "invoice_date", "date")),
      due_date: toDateOnly(get(r, "due_date")),
      amount_total: num(get(r, "amount", "amount_total", "total")),
      amount_paid: num(get(r, "amount_paid", "paid")),
      status: str(get(r, "status")) || "unpaid",
      line_item: lineItemDesc ? str(lineItemDesc) : null,
      line_item_amount: num(get(r, "amount", "line_amount")),
    });
  }
  return { vendors: [...vendorsByName.values()], invoices };
}

/**
 * Parse an ExcelJS workbook into normalized tenant data-lake rows.
 * @param {import('exceljs').Workbook} workbook
 * @returns {{
 *   daily_sales: object[], labor_hours: object[], menu_items: object[],
 *   vendors: object[], invoices: object[], sheets: {name: string, kind: string, row_count: number}[]
 * }}
 */
export function parseWorkbook(workbook) {
  const result = {
    daily_sales: [],
    labor_hours: [],
    menu_items: [],
    vendors: [],
    invoices: [],
    sheets: [],
  };

  for (const worksheet of workbook.worksheets) {
    const rows = sheetToRows(worksheet);
    if (rows.length === 0) continue;

    const scores = {
      labor: headerScore(rows[0], LABOR_HEADERS),
      sales: headerScore(rows[0], SALES_HEADERS),
      invoice: headerScore(rows[0], INVOICE_HEADERS),
    };
    const kind = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const [kindName, kindScore] = kind;
    if (kindScore === 0) {
      result.sheets.push({ name: worksheet.name, kind: "unrecognized", row_count: rows.length });
      continue;
    }

    if (kindName === "labor") {
      result.labor_hours.push(...parseLaborSheet(rows));
    } else if (kindName === "sales") {
      const { menuItems, dailySales } = parseSalesSheet(rows);
      result.menu_items.push(...menuItems);
      result.daily_sales.push(...dailySales);
    } else if (kindName === "invoice") {
      const { vendors, invoices } = parseInvoiceSheet(rows);
      result.vendors.push(...vendors);
      result.invoices.push(...invoices);
    }

    result.sheets.push({ name: worksheet.name, kind: kindName, row_count: rows.length });
  }

  return result;
}
