#!/usr/bin/env node
/**
 * One-shot Beyond the Hunt unlock after Myke sets secrets / desktop OAuth.
 * Runs: auth gaps → (if READY) mem0-import + context-search smoke.
 * Exit: 0 if READY and smokes ok; 2 if still blocked; 1 if READY but a smoke failed.
 * Never prints secret values.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function run(script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: process.env,
  });
}

console.log("unlock-beyond-the-hunt: start");
console.log("scope: love→buy-now + pain→sales-lead — NOT forecasting");

const gaps = run("scripts/check-auth-gaps.mjs");
process.stdout.write(gaps.stdout || "");
if (gaps.stderr) process.stderr.write(gaps.stderr);

const out = gaps.stdout || "";
if (!out.includes("STATUS: READY")) {
  console.log("unlock-beyond-the-hunt: still blocked — see docs/DESKTOP-UNLOCKS.md");
  process.exit(2);
}

const mem0 = run("scripts/mem0-import-tool-hunt-memory.mjs");
process.stdout.write(mem0.stdout || "");
if (mem0.stderr) process.stderr.write(mem0.stderr);
if (mem0.status !== 0) {
  console.error("unlock-beyond-the-hunt: mem0-import failed");
  process.exit(1);
}

const ctx = run("scripts/context-search.mjs", [
  "Never86 restaurant social commerce buy-now",
]);
process.stdout.write(ctx.stdout || "");
if (ctx.stderr) process.stderr.write(ctx.stderr);
if (ctx.status !== 0) {
  console.error("unlock-beyond-the-hunt: context-search failed");
  process.exit(1);
}

console.log("unlock-beyond-the-hunt: READY — Mem0 memory imported + Context search ok");
console.log("next: continue weekly skills in routines/tool-hunt-weekly.json");
process.exit(0);
