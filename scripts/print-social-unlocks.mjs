#!/usr/bin/env node
/**
 * Print Composio social unlock checklist + love-fixture Active path.
 * No network. No secrets. Exit 0 if love fixtures validate; else 1.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const doc = "docs/COMPOSIO-SOCIAL-UNLOCKS.md";

const love = spawnSync(process.execPath, ["scripts/validate-love-fixtures.mjs"], {
  encoding: "utf8",
  cwd: root,
});
if (love.status !== 0) {
  console.error("print-social-unlocks: love fixtures failed");
  process.stderr.write(love.stderr || love.stdout || "");
  process.exit(1);
}

let loveReport = {};
try {
  loveReport = JSON.parse(love.stdout);
} catch {
  loveReport = { raw: (love.stdout || "").slice(0, 200) };
}

const out = {
  ok: true,
  social_unlocks: {
    docs: existsSync(join(root, doc)) ? doc : null,
    active_public_seed: "Yelp love fixtures + Composio web search (no IG/TikTok required)",
    love_fixtures: loveReport,
    instagram: {
      status: "needs_connect",
      dashboard: "https://dashboard.composio.dev/~/org/connect/apps/instagram?open=true",
      note: "Business/Creator only; ask cloud agent for fresh ~10min Composio link",
    },
    tiktok: {
      status: "needs_auth_config_then_connect",
      dashboard: "https://dashboard.composio.dev/~/org/connect/apps/tiktok?open=true",
      note: "Org auth-config often required before Connect; read-only for morning-scan",
    },
    morning_scan: "skills/morning-scan.md",
    fee_catalog_pause: true,
    still_need_for_goal: [
      "MEM0_API_KEY or Mem0 MCP OAuth",
      "CONTEXT_DEV_API_KEY or Context MCP OAuth",
      "node scripts/unlock-beyond-the-hunt.mjs → READY",
    ],
  },
};

console.log(JSON.stringify(out, null, 2));
process.exit(0);
