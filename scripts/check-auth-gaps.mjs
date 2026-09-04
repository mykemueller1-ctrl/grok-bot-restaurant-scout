#!/usr/bin/env node
/**
 * Report Beyond the Hunt auth gaps. Exit 0 always (soft); prints READY or BLOCKED.
 */
import { spawnSync } from "node:child_process";

const gaps = [];
let mem0Ok = false;
let contextOk = false;

if (!process.env.MEM0_API_KEY) {
  gaps.push("MEM0_API_KEY missing (or Mem0 MCP OAuth not visible here)");
} else {
  const smoke = spawnSync(process.execPath, ["scripts/mem0-smoke.mjs"], {
    env: process.env,
    encoding: "utf8",
  });
  if (smoke.status === 0) {
    mem0Ok = true;
  } else {
    gaps.push(`MEM0_API_KEY set but mem0-smoke failed: ${(smoke.stderr || smoke.stdout || "").trim()}`);
  }
}

if (!process.env.CONTEXT_DEV_API_KEY) {
  gaps.push(
    "CONTEXT_DEV_API_KEY missing — headless Context REST path (MCP Context is OAuth-desktop-only)"
  );
} else {
  const smoke = spawnSync(
    process.execPath,
    ["scripts/context-search.mjs", "Never86 restaurant social commerce"],
    { env: process.env, encoding: "utf8" }
  );
  if (smoke.status === 0) {
    contextOk = true;
  } else {
    gaps.push(
      `CONTEXT_DEV_API_KEY set but context-search failed: ${(smoke.stderr || smoke.stdout || "").trim()}`
    );
  }
}

console.log("check-auth-gaps:");
if (gaps.length === 0) {
  console.log(" - none");
  console.log("STATUS: READY");
} else {
  for (const g of gaps) console.log(` - ${g}`);
  console.log(
    `partial: mem0=${mem0Ok ? "ok" : "blocked"} context=${contextOk ? "ok" : "blocked"}`
  );
  console.log("Action: docs/DESKTOP-UNLOCKS.md");
  console.log("STATUS: BLOCKED_UNTIL_SECRETS_OR_DESKTOP");
}
process.exit(0);
