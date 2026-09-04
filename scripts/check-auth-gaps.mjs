#!/usr/bin/env node
/**
 * Report Beyond the Hunt auth gaps. Exit 0 always (soft); prints READY or BLOCKED.
 * Used by weekly hunt before research. Does not print secret values.
 */
import { spawnSync } from "node:child_process";

const gaps = [];

if (!process.env.MEM0_API_KEY) {
  gaps.push("MEM0_API_KEY missing (or Mem0 MCP OAuth not visible to this process)");
} else {
  const smoke = spawnSync(process.execPath, ["scripts/mem0-smoke.mjs"], {
    env: process.env,
    encoding: "utf8",
  });
  if (smoke.status !== 0) {
    gaps.push(`MEM0_API_KEY set but mem0-smoke failed: ${(smoke.stderr || smoke.stdout || "").trim()}`);
  }
}

gaps.push(
  "Context.dev MCP requires desktop OAuth — verify in Cursor Settings → Tools & MCP (this script cannot see OAuth tokens)"
);

console.log("check-auth-gaps:");
for (const g of gaps) console.log(` - ${g}`);
console.log(
  "Action: docs/DESKTOP-UNLOCKS.md — Mem0 OAuth or MEM0_API_KEY; Context desktop OAuth only."
);
console.log("STATUS: BLOCKED_UNTIL_DESKTOP_OR_SECRET");
process.exit(0);
