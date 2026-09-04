#!/usr/bin/env node
/**
 * Validate 1 Stop Order Free 2% / Pro 1% guest convenience fee → SalesLead dogfood fixtures.
 * Exit 0 if ≥5 pain-to-sales-onestoporder-fee-*.json are well-formed; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.startsWith("pain-to-sales-onestoporder-fee-") && f.endsWith(".json"))
  .sort();

if (files.length < 5) {
  console.error(`validate-onestoporder-fee-dogfood: need ≥5 pain-to-sales-onestoporder-fee-*.json (has ${files.length})`);
  process.exit(1);
}

const report = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.dogfood_id || !data.signals?.first_party_pct_fee || !data.signals?.guest_paid_tech_fee || !data.sales_lead_draft) {
    console.error(
      `validate-onestoporder-fee-dogfood: ${f} missing dogfood_id/signals.first_party_pct_fee/guest_paid_tech_fee/sales_lead_draft`
    );
    process.exit(1);
  }
  const lead = data.sales_lead_draft;
  if (!lead.account_name || !lead.complaint_thesis || lead.status !== "DRAFT") {
    console.error(`validate-onestoporder-fee-dogfood: ${f} sales_lead_draft needs account_name/complaint_thesis/status=DRAFT`);
    process.exit(1);
  }
  if (!/1 stop|onestop|2%|1%|convenience/i.test(lead.complaint_thesis)) {
    console.error(`validate-onestoporder-fee-dogfood: ${f} complaint_thesis must teach 1 Stop Order 1–2% guest fee`);
    process.exit(1);
  }
  if (!/tiktok shop|6\s*%|shop referral|social_shop/i.test(lead.complaint_thesis)) {
    console.error(`validate-onestoporder-fee-dogfood: ${f} complaint_thesis must contrast Shop ~6% buy-now`);
    process.exit(1);
  }
  if (!/marketplace|doordash|15|25|30/i.test(lead.complaint_thesis)) {
    console.error(`validate-onestoporder-fee-dogfood: ${f} complaint_thesis must contrast Marketplace rent`);
    process.exit(1);
  }
  const forbidBlob = JSON.stringify([data.notes, lead.notes, data.purpose, data.never].filter(Boolean));
  if (!/forecast/i.test(forbidBlob)) {
    console.error(`validate-onestoporder-fee-dogfood: ${f} must explicitly forbid forecasting in notes/purpose`);
    process.exit(1);
  }
  report.push({
    file: f,
    account: lead.account_name,
    market: lead.market || null,
    signal: "onestoporder_2pct_guest_fee",
  });
}

console.log(JSON.stringify({ ok: true, onestoporder_fee_dogfoods: report.length, report }, null, 2));
process.exit(0);
