#!/usr/bin/env node
/**
 * Validate KEEP grader thin web UI exists and stays in sync with CLI constants.
 * Exit 0 if fixtures/tool-hunt/keep-grader/index.html is well-formed; else 1.
 * No network. No secrets. Not forecasting.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "fixtures", "tool-hunt", "keep-grader", "index.html");

if (!existsSync(htmlPath)) {
  console.error("validate-keep-grader-ui: missing fixtures/tool-hunt/keep-grader/index.html");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const checks = [
  [/Never86/, "brand Never86"],
  [/DEFAULT_SOCIAL_FEE_PCT\s*=\s*6/, "Shop ~6% default"],
  [/MARKETPLACE_IDS/, "marketplace id set"],
  [/anti_marketplace_buy_now/, "wedge anti_marketplace_buy_now"],
  [/love_to_buy_now/, "wedge love_to_buy_now"],
  [/keep-channel-grader\.mjs/, "CLI parity note"],
  [/not forecasting/i, "forbids forecasting"],
  [/Girl\s*&amp;\s*The Goat preset|Girl &amp; The Goat preset/, "G&TG preset"],
];

for (const [re, label] of checks) {
  if (!re.test(html)) {
    console.error(`validate-keep-grader-ui: missing ${label}`);
    process.exit(1);
  }
}

// CLI parity: Girl & The Goat sample → marketplace_fee_total 3640
const cli = spawnSync(
  process.execPath,
  [
    "scripts/keep-channel-grader.mjs",
    "--dinein",
    "16000",
    "--takeout",
    "5500",
    "--doordash",
    "10000",
    "--doordash_fee_pct",
    "25",
    "--uber",
    "3800",
    "--uber_fee_pct",
    "30",
    "--social_buy_now",
    "3000",
    "--social_fee_pct",
    "6",
  ],
  { encoding: "utf8", cwd: root }
);
if (cli.status !== 0) {
  console.error("validate-keep-grader-ui: CLI grader failed", cli.stderr || cli.stdout);
  process.exit(1);
}
const out = JSON.parse(cli.stdout);
if (out.summary?.marketplace_fee_total !== 3640) {
  console.error(
    `validate-keep-grader-ui: expected marketplace_fee_total 3640, got ${out.summary?.marketplace_fee_total}`
  );
  process.exit(1);
}
if (out.summary?.never86_wedge !== "anti_marketplace_buy_now") {
  console.error(`validate-keep-grader-ui: unexpected wedge ${out.summary?.never86_wedge}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      keep_grader_ui: 1,
      path: "fixtures/tool-hunt/keep-grader/index.html",
      marketplace_fee_total: out.summary.marketplace_fee_total,
      wedge: out.summary.never86_wedge,
    },
    null,
    2
  )
);
process.exit(0);
