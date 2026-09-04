#!/usr/bin/env node
/**
 * Validate social_shop_fee → SalesLead dogfood fixtures.
 * Exit 0 if ≥1 pain-to-sales-social-shop-*.json is well-formed; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.startsWith("pain-to-sales-social-shop-") && f.endsWith(".json"))
  .sort();

if (files.length < 5) {
  console.error(`validate-social-shop-dogfood: need ≥5 pain-to-sales-social-shop-*.json (has ${files.length})`);
  process.exit(1);
}

const report = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.dogfood_id || !data.signals?.social_shop_fee || !data.sales_lead_draft) {
    console.error(`validate-social-shop-dogfood: ${f} missing dogfood_id/signals.social_shop_fee/sales_lead_draft`);
    process.exit(1);
  }
  const lead = data.sales_lead_draft;
  if (!lead.account_name || !lead.complaint_thesis || lead.status !== "DRAFT") {
    console.error(`validate-social-shop-dogfood: ${f} sales_lead_draft needs account_name/complaint_thesis/status=DRAFT`);
    process.exit(1);
  }
  if (!/tiktok shop|6\s*%|shop referral|social_shop/i.test(lead.complaint_thesis)) {
    console.error(`validate-social-shop-dogfood: ${f} complaint_thesis must teach Shop ~6% / social_shop language`);
    process.exit(1);
  }
  if (!/marketplace|doordash|15|25|30/i.test(lead.complaint_thesis)) {
    console.error(`validate-social-shop-dogfood: ${f} complaint_thesis must contrast Marketplace rent`);
    process.exit(1);
  }
  const forbidBlob = JSON.stringify([data.notes, lead.notes, data.purpose, data.never].filter(Boolean));
  if (!/forecast/i.test(forbidBlob)) {
    console.error(`validate-social-shop-dogfood: ${f} must explicitly forbid forecasting in notes/purpose`);
    process.exit(1);
  }
  report.push({
    file: f,
    account: lead.account_name,
    market: lead.market || null,
    signal: "social_shop_fee",
  });
}

console.log(JSON.stringify({ ok: true, social_shop_dogfoods: report.length, report }, null, 2));
process.exit(0);
