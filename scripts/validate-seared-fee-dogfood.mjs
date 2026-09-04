#!/usr/bin/env node
/**
 * Validate Seared guest 5% ($1.99 min / $7.50 cap) → SalesLead dogfood fixtures.
 * Exit 0 if ≥5 pain-to-sales-seared-fee-*.json are well-formed; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.startsWith("pain-to-sales-seared-fee-") && f.endsWith(".json"))
  .sort();

if (files.length < 5) {
  console.error(`validate-seared-fee-dogfood: need ≥5 pain-to-sales-seared-fee-*.json (has ${files.length})`);
  process.exit(1);
}

const report = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.dogfood_id || !data.signals?.first_party_pct_fee || !data.sales_lead_draft) {
    console.error(
      `validate-seared-fee-dogfood: ${f} missing dogfood_id/signals.first_party_pct_fee/sales_lead_draft`
    );
    process.exit(1);
  }
  const lead = data.sales_lead_draft;
  if (!lead.account_name || !lead.complaint_thesis || lead.status !== "DRAFT") {
    console.error(`validate-seared-fee-dogfood: ${f} sales_lead_draft needs account_name/complaint_thesis/status=DRAFT`);
    process.exit(1);
  }
  if (!/seared|5%|\$1\.99|7\.50/i.test(lead.complaint_thesis)) {
    console.error(`validate-seared-fee-dogfood: ${f} complaint_thesis must teach Seared guest 5%/$1.99/$7.50`);
    process.exit(1);
  }
  if (!/tiktok shop|6\s*%|shop referral|social_shop/i.test(lead.complaint_thesis)) {
    console.error(`validate-seared-fee-dogfood: ${f} complaint_thesis must contrast Shop ~6% buy-now`);
    process.exit(1);
  }
  if (!/marketplace|doordash|15|25|30/i.test(lead.complaint_thesis)) {
    console.error(`validate-seared-fee-dogfood: ${f} complaint_thesis must contrast Marketplace rent`);
    process.exit(1);
  }
  const forbidBlob = JSON.stringify([data.notes, lead.notes, data.purpose, data.never].filter(Boolean));
  if (!/forecast/i.test(forbidBlob)) {
    console.error(`validate-seared-fee-dogfood: ${f} must explicitly forbid forecasting in notes/purpose`);
    process.exit(1);
  }
  report.push({
    file: f,
    account: lead.account_name,
    market: lead.market || null,
    signal: "seared_guest_5pct_199_750",
  });
}

console.log(JSON.stringify({ ok: true, seared_fee_dogfoods: report.length, report }, null, 2));
process.exit(0);
