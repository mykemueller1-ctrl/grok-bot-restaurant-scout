#!/usr/bin/env node
/**
 * Validate love→buy-now dogfood fixtures (script-draft + catalog-sync).
 * Ensures PENDING_APPROVAL drafts pair with SANDBOX catalog payloads.
 * Exit 0 if ≥2 script drafts and matching catalog syncs are well-formed; else 1.
 * No network. No secrets.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir).sort();

const scripts = files.filter((f) => f.startsWith("script-draft-") && f.endsWith(".json"));
const catalogs = files.filter((f) => f.startsWith("catalog-sync-") && f.endsWith(".json"));

if (scripts.length < 2) {
  console.error(`validate-buy-now-dogfood: need ≥2 script-draft-*.json (has ${scripts.length})`);
  process.exit(1);
}
if (catalogs.length < 2) {
  console.error(`validate-buy-now-dogfood: need ≥2 catalog-sync-*.json (has ${catalogs.length})`);
  process.exit(1);
}

const report = { scripts: [], catalogs: [] };

for (const f of scripts) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.draft_id || !data.script?.hook_2s || !data.script?.cta) {
    console.error(`validate-buy-now-dogfood: ${f} missing draft_id/script.hook_2s/script.cta`);
    process.exit(1);
  }
  if (data.status !== "PENDING_APPROVAL") {
    console.error(`validate-buy-now-dogfood: ${f} status must be PENDING_APPROVAL`);
    process.exit(1);
  }
  if (!Array.isArray(data.never) || !data.never.some((n) => /forecast/i.test(String(n)))) {
    console.error(`validate-buy-now-dogfood: ${f} must forbid forecasting in never[]`);
    process.exit(1);
  }
  report.scripts.push({ file: f, lead: data.lead?.name || null, market: data.lead?.market || null });
}

for (const f of catalogs) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  if (!data.sync_id || !data.product?.title || !data.product?.anti_rent) {
    console.error(`validate-buy-now-dogfood: ${f} missing sync_id/product.title/anti_rent`);
    process.exit(1);
  }
  if (data.status !== "SANDBOX_PAYLOAD_ONLY") {
    console.error(`validate-buy-now-dogfood: ${f} status must be SANDBOX_PAYLOAD_ONLY`);
    process.exit(1);
  }
  if (!data.from_draft || !scripts.includes(data.from_draft.replace(/^fixtures\/tool-hunt\//, ""))) {
    console.error(`validate-buy-now-dogfood: ${f} from_draft must point at an existing script-draft`);
    process.exit(1);
  }
  report.catalogs.push({ file: f, brand: data.product?.brand || null, from: data.from_draft });
}

console.log(
  JSON.stringify(
    { ok: true, script_drafts: report.scripts.length, catalog_syncs: report.catalogs.length, report },
    null,
    2
  )
);
process.exit(0);
