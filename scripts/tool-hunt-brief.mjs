#!/usr/bin/env node
/**
 * Generate Beyond the Hunt ops brief from ledger + findings (no Mem0/Context).
 * Usage: node scripts/tool-hunt-brief.mjs [--write]
 * --write → stack/tool-hunt-briefs/YYYY-MM-DD.md + bump ledger last_brief
 * Exit 0 always (soft). Never prints secrets.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const write = process.argv.includes("--write");
const today = new Date().toISOString().slice(0, 10);

const ledger = JSON.parse(readFileSync(join(root, "stack", "tooling-ledger.json"), "utf8"));
const findingsDir = join(root, "stack", "tool-hunt-findings");
const findings = readdirSync(findingsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(findingsDir, f), "utf8")))
  .filter((x) => x && x.verdict && x.lane !== "other");

const rank = { adopt: 0, pilot: 1, needs_auth: 2, watch: 3, skip: 4 };
findings.sort((a, b) => (rank[a.verdict] ?? 9) - (rank[b.verdict] ?? 9) || (a.priority ?? 9) - (b.priority ?? 9));

const feePause = (ledger.open_gaps || []).some((g) => /fee-catalog-pause/i.test(g.id || ""));
const isFeeDogfood = (f) =>
  /fee|saleslead|sales-lead|per-order|guest fee|commission|convenience fee/i.test(
    `${f.name || ""} ${f.summary || ""} ${f.finding_id || ""}`
  );

// When fee catalog is paused, TOP MOVES = auth/open_gaps first, not a wall of old fee adopts.
const needsAuth = findings.filter((f) => f.verdict === "needs_auth").slice(0, 6);
const watching = findings.filter((f) => f.verdict === "watch").slice(0, 8);
const adopts = findings
  .filter((f) => f.verdict === "adopt")
  .filter((f) => !(feePause && isFeeDogfood(f)))
  .slice(0, feePause ? 3 : 6);
const rivals = (ledger.competitors || [])
  .filter((c) => c.lane === "vertical_gtm")
  .slice(0, 8);

const topMoves = [];
for (const g of (ledger.open_gaps || []).filter((x) => (x.priority ?? 9) <= 1).slice(0, 4)) {
  topMoves.push({
    verdict: /auth|mem0|context/i.test(`${g.id} ${g.gap}`) ? "needs_auth" : "watch",
    name: g.id,
    summary: g.gap || g.action || "",
  });
}
for (const f of needsAuth) {
  if (topMoves.length >= 6) break;
  if (topMoves.some((m) => m.name === f.name)) continue;
  topMoves.push(f);
}
for (const f of adopts) {
  if (topMoves.length >= 6) break;
  topMoves.push(f);
}

const lines = [];
lines.push(`Beyond the Hunt — ${today} (vertical)`);
lines.push("");
lines.push("SCOPE: love→buy-now · pain→sales-lead · Cursor memory/skills/MCP");
lines.push("OUT: historical sales forecasting · labor forecasting");
if (feePause) {
  lines.push("PAUSE: fee KEEP catalog sufficient — no new fee dogfoods unless cite sharpens love→buy-now / Cursor stack");
}
lines.push("");
lines.push("TOP MOVES");
if (!topMoves.length) lines.push("1. (no priority moves yet)");
else topMoves.forEach((f, i) => lines.push(`${i + 1}. [${f.verdict}] ${f.name} — ${f.summary || f.gap || ""}`));
lines.push("");
lines.push("US vs VERTICAL");
lines.push("| Rival | Their edge | Our edge |");
lines.push("| --- | --- | --- |");
for (const r of rivals) {
  lines.push(`| ${r.name} | ${(r.edge || "").replace(/\|/g, "/")} | Never86 TikTok/IG buy-now + taught pain→sales |`);
}
lines.push("");
lines.push("NEEDS YOU (desktop / secrets)");
lines.push("- [ ] Auth Mem0 + Context — docs/DESKTOP-UNLOCKS.md (MEM0_API_KEY + CONTEXT_DEV_API_KEY)");
lines.push("- [ ] Sync Skills for Cloud Agents");
lines.push("- [ ] Cursor Automation + memories for tool-hunt-weekly");
for (const f of needsAuth) {
  lines.push(`- [ ] ${f.name}${f.operator_ask ? ` — ${f.operator_ask}` : ""}`);
}
lines.push("");
lines.push("WATCHING");
for (const f of watching) {
  lines.push(`- ${f.name} (p${f.priority ?? "?"})`);
}
lines.push("");
lines.push(`Ledger v${ledger.version} · last_scan ${ledger.last_scan} · see docs/TOOL-HUNT.md`);
lines.push(`Auth: run node scripts/check-auth-gaps.mjs / unlock-beyond-the-hunt.mjs`);

const brief = lines.join("\n") + "\n";
process.stdout.write(brief);

if (write) {
  const outDir = join(root, "stack", "tool-hunt-briefs");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${today}.md`);
  writeFileSync(outPath, brief);
  ledger.last_brief = today;
  writeFileSync(join(root, "stack", "tooling-ledger.json"), JSON.stringify(ledger, null, 2) + "\n");
  console.error(`tool-hunt-brief: wrote ${outPath}`);
}

process.exit(0);
