#!/usr/bin/env node
/**
 * Validate KEEP channel-grader → SalesLead dogfood fixtures.
 * Exit 0 if ≥1 pain-to-sales-keep-grader-*.json is well-formed; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.startsWith("pain-to-sales-keep-grader-") && f.endsWith(".json"))
  .sort();

if (files.length < 2) {
  console.error(`validate-keep-grader-dogfood: need ≥2 pain-to-sales-keep-grader-*.json (has ${files.length})`);
  process.exit(1);
}

const report = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.dogfood_id || !data.grader || !data.sales_lead_draft) {
    console.error(`validate-keep-grader-dogfood: ${f} missing dogfood_id/grader/sales_lead_draft`);
    process.exit(1);
  }
  if (data.grader.expected_wedge !== "anti_marketplace_buy_now") {
    console.error(`validate-keep-grader-dogfood: ${f} grader.expected_wedge must be anti_marketplace_buy_now`);
    process.exit(1);
  }
  if (data.grader.mcp_tool !== "keep_channel_grade") {
    console.error(`validate-keep-grader-dogfood: ${f} grader.mcp_tool must be keep_channel_grade`);
    process.exit(1);
  }
  const lead = data.sales_lead_draft;
  if (!lead.account_name || !lead.complaint_thesis || lead.status !== "DRAFT") {
    console.error(`validate-keep-grader-dogfood: ${f} sales_lead_draft needs account_name/complaint_thesis/status=DRAFT`);
    process.exit(1);
  }
  if (!/KEEP|keep|fee|commission|marketplace/i.test(lead.complaint_thesis)) {
    console.error(`validate-keep-grader-dogfood: ${f} complaint_thesis must reference KEEP/fee language`);
    process.exit(1);
  }
  const forbidBlob = JSON.stringify([data.notes, lead.notes, data.never, data.purpose].filter(Boolean));
  if (!/forecast/i.test(forbidBlob)) {
    console.error(`validate-keep-grader-dogfood: ${f} must explicitly forbid forecasting in notes/purpose`);
    process.exit(1);
  }
  report.push({
    file: f,
    account: lead.account_name,
    market: lead.market || null,
    wedge: data.grader.expected_wedge,
  });
}

console.log(JSON.stringify({ ok: true, keep_grader_dogfoods: report.length, report }, null, 2));
process.exit(0);
