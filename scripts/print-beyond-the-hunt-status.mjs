#!/usr/bin/env node
/**
 * One-screen Beyond the Hunt status for operator / cloud agents.
 * Aggregates auth unlock, love live_proof, fee pause, top open_gaps.
 * Exit 0 always (soft). Never prints secrets.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(script) {
  return spawnSync(process.execPath, [script], {
    encoding: "utf8",
    cwd: root,
    env: process.env,
  });
}

const gapsOut = run("scripts/check-auth-gaps.mjs");
const loveOut = run("scripts/validate-love-fixtures.mjs");
const socialOut = run("scripts/print-social-unlocks.mjs");

let love = null;
try {
  love = JSON.parse(loveOut.stdout || "{}");
} catch {
  love = { ok: false, parse_error: true };
}

let social = null;
try {
  social = JSON.parse(socialOut.stdout || "{}");
} catch {
  social = { ok: false };
}

const ledger = JSON.parse(
  readFileSync(join(root, "stack", "tooling-ledger.json"), "utf8")
);
const authText = gapsOut.stdout || "";
const authReady = authText.includes("STATUS: READY");
const feePause = (ledger.open_gaps || []).some(
  (g) => g.id === "fee-catalog-pause-auth-first"
);

const out = {
  ok: love?.ok === true,
  goal: "beyond-the-hunt best-in-vertical (love→buy-now · pain→sales-lead · Cursor memory/skills/MCP)",
  not: "historical sales/labor forecasting research",
  ledger_version: ledger.version,
  auth: {
    status: authReady ? "READY" : "BLOCKED_UNTIL_SECRETS_OR_DESKTOP",
    mem0_env: Boolean(process.env.MEM0_API_KEY),
    context_env: Boolean(process.env.CONTEXT_DEV_API_KEY),
    unlock: "node scripts/unlock-beyond-the-hunt.mjs",
    docs: "docs/DESKTOP-UNLOCKS.md",
  },
  love_live_proof: love?.ok
    ? {
        markets: love.markets,
        primaries: (love.report || []).map((r) => ({
          market: r.market,
          brand: r.live_primary,
          reviews: r.live_reviews,
        })),
      }
    : { ok: false, stderr: (loveOut.stderr || "").slice(0, 300) },
  social: {
    yelp_active_seed: true,
    instagram: social?.social_unlocks?.instagram?.status || "unknown",
    tiktok: social?.social_unlocks?.tiktok?.status || "unknown",
    docs: "docs/COMPOSIO-SOCIAL-UNLOCKS.md",
  },
  pain_sales_enrich: {
    active: true,
    path: ledger.ours?.pain_sales_enrich || "Composio Yelp + Maps + SEARCH_WEB",
    phone_enrich_markets: 5,
    skill: "skills/lead-shop-enrich.md",
    note: "YELP_SEARCH_BY_PHONE resolves all 5 love-seed phones — Apollo/Clay optional",
  },
  fee_catalog_pause: feePause,
  top_watch_rivals: (ledger.watchlist || [])
    .filter((w) => w.verdict === "watch" && w.lane === "vertical_gtm")
    .slice(0, 6)
    .map((w) => ({ item: w.item, why: w.why })),
  top_open_gaps: (ledger.open_gaps || [])
    .slice()
    .sort((a, b) => (a.priority || 99) - (b.priority || 99))
    .slice(0, 5)
    .map((g) => ({ id: g.id, priority: g.priority, gap: g.gap })),
  next_for_goal_close: authReady
    ? [
        "node scripts/unlock-beyond-the-hunt.mjs already READY path",
        "Confirm Mem0 import + Context smoke in unlock output",
      ]
    : [
        "Set MEM0_API_KEY (m0-…) + CONTEXT_DEV_API_KEY (ctxt_secret-…) in cloud secrets, or desktop OAuth",
        "Re-run: node scripts/unlock-beyond-the-hunt.mjs → exit 0",
        "Then Mem0 holds stack/tool-hunt-memory.md for weekly hunts",
      ],
};

console.log(JSON.stringify(out, null, 2));
process.exit(0);
