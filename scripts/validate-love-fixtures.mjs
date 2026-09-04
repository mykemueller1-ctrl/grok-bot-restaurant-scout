#!/usr/bin/env node
/**
 * Validate love-brand calibration fixtures (Chicago / Austin / Miami / Nashville / Denver).
 * Ensures morning-scan seeds stay multi-market without Instagram auth.
 * Exit 0 if each *-love-brands.json has ≥3 brands; else 1.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.endsWith("-love-brands.json"))
  .sort();

const required = [
  "chicago-love-brands.json",
  "austin-love-brands.json",
  "miami-love-brands.json",
  "nashville-love-brands.json",
  "denver-love-brands.json",
];
for (const r of required) {
  if (!files.includes(r)) {
    console.error(`validate-love-fixtures: missing ${r}`);
    process.exit(1);
  }
}

const report = [];
for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const brands = Array.isArray(data.brands) ? data.brands : [];
  const market = data.market || f;
  if (brands.length < 3) {
    console.error(`validate-love-fixtures: ${f} needs ≥3 brands (has ${brands.length})`);
    process.exit(1);
  }
  for (const b of brands) {
    if (!b.name || !b.yelp_alias) {
      console.error(`validate-love-fixtures: ${f} brand missing name/yelp_alias`);
      process.exit(1);
    }
  }
  if (!data.live_proof || typeof data.live_proof !== "string") {
    console.error(`validate-love-fixtures: ${f} missing live_proof string (Composio Yelp verify)`);
    process.exit(1);
  }
  const primary = brands.find((b) => b.live_yelp);
  if (!primary?.live_yelp?.review_count || !primary.live_yelp.verified_at) {
    console.error(`validate-love-fixtures: ${f} needs ≥1 brand with live_yelp.review_count + verified_at`);
    process.exit(1);
  }
  if (!primary.buy_now_path?.verified_at || !Array.isArray(primary.buy_now_path.rails) || !primary.buy_now_path.rails.length) {
    console.error(`validate-love-fixtures: ${f} live primary needs buy_now_path.verified_at + rails[]`);
    process.exit(1);
  }
  report.push({
    file: f,
    market,
    brands: brands.length,
    live_primary: primary.name,
    live_reviews: primary.live_yelp.review_count,
    buy_now_rails: primary.buy_now_path.rails,
  });
}

console.log(JSON.stringify({ ok: true, markets: report.length, report }, null, 2));
process.exit(0);
