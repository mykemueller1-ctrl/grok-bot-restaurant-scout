#!/usr/bin/env node
/**
 * Validate stack/tooling-ledger.json + optional findings against ToolFinding schema shape.
 * Used by CI and by Beyond the Hunt agents before brief.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ledgerPath = join(root, "stack", "tooling-ledger.json");
const findingsDir = join(root, "stack", "tool-hunt-findings");
const agentPath = join(root, "agent", "tool-hunt", "beyond-the-hunt.json");
const routinePath = join(root, "routines", "tool-hunt-weekly.json");

const LANES = new Set([
  "cursor_agents",
  "memory",
  "skills_knowledge",
  "mcp_connectors",
  "competitor_stacks",
  "vertical_gtm",
  "orchestration",
  "other",
]);
const VERDICTS = new Set(["adopt", "pilot", "watch", "skip", "needs_auth"]);

function fail(msg) {
  console.error(`validate-tooling-ledger: ${msg}`);
  process.exit(1);
}

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`cannot parse ${path}: ${e.message}`);
  }
}

if (!existsSync(ledgerPath)) fail("missing stack/tooling-ledger.json");
if (!existsSync(agentPath)) fail("missing agent/tool-hunt/beyond-the-hunt.json");
if (!existsSync(routinePath)) fail("missing routines/tool-hunt-weekly.json");

const ledger = loadJson(ledgerPath);
for (const key of ["version", "purpose", "last_scan", "ours", "competitors", "watchlist", "open_gaps"]) {
  if (!(key in ledger)) fail(`ledger missing ${key}`);
}
if (!ledger.ours?.ide_agents?.primary) fail("ledger.ours.ide_agents.primary required");
if (!Array.isArray(ledger.competitors) || ledger.competitors.length < 1) {
  fail("ledger.competitors must be a non-empty array");
}
if (!Array.isArray(ledger.open_gaps)) fail("ledger.open_gaps must be an array");

for (const c of ledger.competitors) {
  if (!c.name || !c.stack || !c.updated) fail(`competitor row incomplete: ${JSON.stringify(c)}`);
}

for (const w of ledger.watchlist || []) {
  if (w.verdict && !VERDICTS.has(w.verdict)) fail(`bad watchlist verdict: ${w.verdict}`);
  if (w.lane && !LANES.has(w.lane)) fail(`bad watchlist lane: ${w.lane}`);
}

if (existsSync(findingsDir)) {
  for (const file of readdirSync(findingsDir).filter((f) => f.endsWith(".json"))) {
    const f = loadJson(join(findingsDir, file));
    for (const req of ["finding_id", "lane", "name", "verdict", "summary", "researched_at"]) {
      if (!f[req]) fail(`${file} missing ${req}`);
    }
    if (!LANES.has(f.lane)) fail(`${file} bad lane ${f.lane}`);
    if (!VERDICTS.has(f.verdict)) fail(`${file} bad verdict ${f.verdict}`);
  }
}

const routine = loadJson(routinePath);
if (routine.name !== "tool-hunt-weekly") fail("routine name mismatch");
const skills = (routine.steps || []).map((s) => s.skill).filter(Boolean);
for (const skill of [
  "tool-frontier-scan",
  "vertical-rival-watch",
  "memory-skills-audit",
  "stack-vs-competitors",
  "tool-hunt-brief",
]) {
  if (!skills.includes(skill)) fail(`routine missing skill ${skill}`);
  const skillPath = join(root, "skills", `${skill}.md`);
  if (!existsSync(skillPath)) fail(`missing skills/${skill}.md`);
}

console.log("validate-tooling-ledger: ok");
