#!/usr/bin/env node
/**
 * Headless Beyond the Hunt weekly gate (no Mem0/Context required).
 * Runs auth soft-check + ledger validate; prints Active research path.
 * Exit: 0 always (soft). STATUS line: READY | BLOCKED_UNTIL_SECRETS_OR_DESKTOP | LEDGER_INVALID
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function run(cmd, args) {
  return spawnSync(cmd, args, { encoding: "utf8", env: process.env });
}

console.log("tool-hunt-week: Beyond the Hunt gate");
console.log("scope: love→buy-now + pain→sales-lead + Cursor memory/skills — NOT forecasting");

const auth = run(process.execPath, ["scripts/check-auth-gaps.mjs"]);
process.stdout.write(auth.stdout || "");
if (auth.stderr) process.stderr.write(auth.stderr);

const ledger = run(process.execPath, ["scripts/validate-tooling-ledger.mjs"]);
process.stdout.write(ledger.stdout || "");
if (ledger.stderr) process.stderr.write(ledger.stderr);

let ledgerOk = (ledger.status === 0);
const authOut = auth.stdout || "";
const authReady = authOut.includes("STATUS: READY");

try {
  const mem = readFileSync("stack/tool-hunt-memory.md", "utf8");
  const last = mem.trim().split("\n").filter((l) => l.startsWith("### ")).slice(-1)[0];
  console.log(`memory_tail: ${last || "(empty)"}`);
} catch {
  console.log("memory_tail: (missing stack/tool-hunt-memory.md)");
}

console.log("active_research: COMPOSIO_SEARCH_WEB + COMPOSIO_SEARCH_TAVILY + COMPOSIO_SEARCH_NEWS (Bright Data still 401)");
console.log("active_pain: X.search_posts_all + fixtures/tool-hunt/pain-scan-*.json");
console.log("active_love: Yelp + Maps — fixtures/tool-hunt/*-love-brands.json");
console.log("active_buy_now: fixtures/tool-hunt/script-draft-franklin-buy-now.json + catalog-sync-franklin-sandbox.json");
console.log("active_keep_scorer: scripts/score-marketplace-keep.mjs + scripts/score-pain-fixtures.mjs");
console.log("next: skills in routines/tool-hunt-weekly.json → write ToolFinding JSON → update ledger");
if (authReady) {
  console.log("mem0_next: node scripts/unlock-beyond-the-hunt.mjs");
}

if (!ledgerOk) {
  console.log("STATUS: LEDGER_INVALID");
} else if (authReady) {
  console.log("STATUS: READY");
} else {
  console.log("STATUS: BLOCKED_UNTIL_SECRETS_OR_DESKTOP");
}
process.exit(0);
