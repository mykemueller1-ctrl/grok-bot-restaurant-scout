#!/usr/bin/env node
/**
 * Parse Toast Schedule & Labor (Time Entries) + Item Selection (product mix → SKUs)
 * into one LaborSalesInventorySnapshot.
 *
 * Usage:
 *   node scripts/parse-toast-reports.mjs --labor TimeEntries.csv --sales ItemSelectionDetails.csv [--out out.json]
 */
import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    labor: { type: "string" },
    sales: { type: "string" },
    out: { type: "string", default: "fixtures/toast/labor-sales-inventory.json" },
    anonymize: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (!values.labor || !values.sales) {
  console.error(
    "Required: --labor <TimeEntries.csv> --sales <ItemSelectionDetails.csv> [--out path] [--anonymize]",
  );
  process.exit(1);
}

/** Minimal CSV parser that respects quoted fields. */
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

async function readCsv(path) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  let headers = null;
  const rows = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (!headers) {
      headers = cols.map((h) => h.trim());
      continue;
    }
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function num(v) {
  const n = Number.parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function truthy(v) {
  return String(v).toLowerCase() === "true" || String(v) === "1";
}

function isPlaceholderItem(name) {
  const n = String(name || "").trim();
  if (!n) return true;
  if (/^\*+$/.test(n)) return true;
  if (/^course\s*line$/i.test(n)) return true;
  return false;
}

function anonymizeEmployee(name, map) {
  if (map.has(name)) return map.get(name);
  const label = `Team Member ${String(map.size + 1).padStart(2, "0")}`;
  map.set(name, label);
  return label;
}

function rollBucket(store, key, qty, net) {
  if (!store[key]) store[key] = { qty: 0, net_sales: 0, sku_count: 0 };
  store[key].qty += qty;
  store[key].net_sales += net;
}

const laborRows = await readCsv(resolve(values.labor));
const salesRows = await readCsv(resolve(values.sales));
const anonMap = new Map();

const entries = laborRows.map((r) => {
  const employee = values.anonymize
    ? anonymizeEmployee(r["Employee"] || r.employee || "", anonMap)
    : r["Employee"] || r.employee || "";
  return {
    employee,
    job_title: r["Job Title"] || r.job_title || "",
    in_at: r["In Date"] || r.in_at || "",
    out_at: r["Out Date"] || r.out_at || "",
    total_hours: num(r["Total Hours"]),
    unpaid_break_hours: num(r["Unpaid Break Time"]),
    paid_break_hours: num(r["Paid Break Time"]),
    payable_hours: num(r["Payable Hours"]),
  };
});

const byJob = {};
const byEmployee = {};
for (const e of entries) {
  if (!byJob[e.job_title]) {
    byJob[e.job_title] = { payable_hours: 0, punches: 0, people: [] };
  }
  byJob[e.job_title].payable_hours += e.payable_hours;
  byJob[e.job_title].punches += 1;
  if (!byJob[e.job_title].people.includes(e.employee)) {
    byJob[e.job_title].people.push(e.employee);
  }

  if (!byEmployee[e.employee]) {
    byEmployee[e.employee] = { payable_hours: 0, jobs: [] };
  }
  byEmployee[e.employee].payable_hours += e.payable_hours;
  if (!byEmployee[e.employee].jobs.includes(e.job_title)) {
    byEmployee[e.employee].jobs.push(e.job_title);
  }
}

const skuMap = new Map();
const bySalesCategory = {};
const byMenu = {};
const byMenuGroup = {};
let salesStart = null;
let salesEnd = null;

for (const r of salesRows) {
  const menuItem = r["Menu Item"] || r.menu_item || "";
  const voided = truthy(r["Void?"] || r.void);
  const placeholder = isPlaceholderItem(menuItem);
  const qty = num(r.Qty ?? r.qty);
  const net = num(r["Net Price"] ?? r.net_sales); // Toast line net is already qty-inclusive
  const sent = r["Sent Date"] || r.sent_at || "";
  if (sent) {
    if (!salesStart || sent < salesStart) salesStart = sent;
    if (!salesEnd || sent > salesEnd) salesEnd = sent;
  }
  if (voided || placeholder || qty === 0) continue;

  const salesCategory = r["Sales Category"] || r.sales_category || "";
  const menu = r.Menu || r.menu || "";
  const menuGroup = r["Menu Group"] || r.menu_group || "";
  const key = [salesCategory, menu, menuGroup, menuItem].join("\u0001");

  if (!skuMap.has(key)) {
    skuMap.set(key, {
      sku: menuItem,
      menu_group: menuGroup,
      menu,
      sales_category: salesCategory,
      qty: 0,
      net_sales: 0,
      inventory_depletion_qty: 0,
    });
  }
  const sku = skuMap.get(key);
  sku.qty += qty;
  sku.net_sales += net;
  sku.inventory_depletion_qty += qty;

  rollBucket(bySalesCategory, salesCategory || "(none)", qty, net);
  rollBucket(byMenu, menu || "(none)", qty, net);
  rollBucket(byMenuGroup, menuGroup || "(none)", qty, net);
}

for (const bucket of [bySalesCategory, byMenu, byMenuGroup]) {
  for (const k of Object.keys(bucket)) {
    bucket[k].net_sales = round2(bucket[k].net_sales);
    bucket[k].qty = round2(bucket[k].qty);
  }
}

const skus = [...skuMap.values()]
  .map((s) => ({
    ...s,
    qty: round2(s.qty),
    net_sales: round2(s.net_sales),
    inventory_depletion_qty: round2(s.inventory_depletion_qty),
  }))
  .sort((a, b) => b.net_sales - a.net_sales);

for (const s of skus) {
  if (bySalesCategory[s.sales_category || "(none)"]) {
    bySalesCategory[s.sales_category || "(none)"].sku_count += 1;
  }
  if (byMenu[s.menu || "(none)"]) byMenu[s.menu || "(none)"].sku_count += 1;
  if (byMenuGroup[s.menu_group || "(none)"]) {
    byMenuGroup[s.menu_group || "(none)"].sku_count += 1;
  }
}

const payableHours = round2(entries.reduce((s, e) => s + e.payable_hours, 0));
const netSales = round2(skus.reduce((s, x) => s + x.net_sales, 0));
const unitsSold = round2(skus.reduce((s, x) => s + x.qty, 0));

const laborDate = inferLaborDate(entries);
const periodNote =
  laborDate && salesStart && !String(salesStart).startsWith(laborDate.split(" ")[0])
    ? "Labor window and sales window differ — sales_per_labor_hour is directional only until ranges align."
    : null;

const snapshot = {
  period: {
    labor_date: laborDate,
    sales_start: salesStart,
    sales_end: salesEnd,
    source_labor_file: basename(values.labor),
    source_sales_file: basename(values.sales),
    note: periodNote,
  },
  labor: {
    entries,
    by_job: byJob,
    by_employee: byEmployee,
  },
  product_mix: {
    skus,
    by_sales_category: bySalesCategory,
    by_menu: byMenu,
    by_menu_group: byMenuGroup,
  },
  totals: {
    payable_hours: payableHours,
    labor_people: Object.keys(byEmployee).length,
    labor_punches: entries.length,
    sku_count: skus.length,
    units_sold: unitsSold,
    net_sales: netSales,
    sales_per_labor_hour: payableHours > 0 ? round2(netSales / payableHours) : null,
  },
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function inferLaborDate(list) {
  const first = list[0]?.in_at || "";
  const m = first.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})/);
  return m ? m[1] : null;
}

const outPath = resolve(values.out);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      out: outPath,
      totals: snapshot.totals,
      top_skus: skus.slice(0, 8).map((s) => ({
        sku: s.sku,
        path: `${s.sales_category}/${s.menu}/${s.menu_group}`,
        qty: s.qty,
        net_sales: s.net_sales,
      })),
      labor_jobs: Object.fromEntries(
        Object.entries(byJob).map(([k, v]) => [k, round2(v.payable_hours)]),
      ),
    },
    null,
    2,
  ),
);
