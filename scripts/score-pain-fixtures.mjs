#!/usr/bin/env node
/**
 * Batch-score fixtures/tool-hunt/pain-scan-*.json snippets with KEEP scorer.
 * Ensures Active pain dogfood stays anti_marketplace_buy_now-capable.
 * Exit 0 if ≥1 hit scores anti_marketplace_buy_now; else 1.
 * No network. No secrets.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fixtures", "tool-hunt");
const files = readdirSync(dir)
  .filter((f) => f.startsWith("pain-scan-") && f.endsWith(".json"))
  .sort();

if (!files.length) {
  console.error("score-pain-fixtures: no pain-scan-*.json found");
  process.exit(1);
}

let strong = 0;
const rows = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const hits = Array.isArray(data.hits) ? data.hits : [];
  for (const h of hits) {
    const snippet = String(h.snippet || "").trim();
    if (!snippet) continue;
    const r = spawnSync(process.execPath, [join(root, "scripts", "score-marketplace-keep.mjs"), snippet], {
      encoding: "utf8",
    });
    let parsed;
    try {
      parsed = JSON.parse((r.stdout || "").trim());
    } catch {
      console.error(`score-pain-fixtures: bad scorer output for ${f}`);
      process.exit(1);
    }
    const ok = parsed.never86_wedge === "anti_marketplace_buy_now";
    if (ok) strong += 1;
    rows.push({
      file: f,
      pain_id: h.pain_id || null,
      score: parsed.score,
      wedge: parsed.never86_wedge,
      signals: parsed.signals,
    });
  }
}

console.log(JSON.stringify({ files: files.length, hits_scored: rows.length, strong_keep: strong, rows }, null, 2));

if (strong < 4) {
  console.error("score-pain-fixtures: need ≥4 anti_marketplace_buy_now hits across pain-scan fixtures");
  process.exit(1);
}
process.exit(0);
