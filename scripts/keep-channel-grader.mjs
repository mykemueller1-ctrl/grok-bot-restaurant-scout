#!/usr/bin/env node
/**
 * Never86 KEEP channel-rank grader (pilot).
 * Rank sales channels by what the restaurant KEEPS after fees — not GMV.
 * Usage:
 *   node scripts/keep-channel-grader.mjs --dinein 10000 --takeout 5000 \\
 *     --doordash 8000 --doordash_fee_pct 25 --uber 3000 --uber_fee_pct 30 \\
 *     --social_buy_now 2000 --social_fee_pct 0
 * Exit 0 always (prints JSON). No network. No secrets. Not forecasting.
 */
function arg(name, fallback = 0) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = Number(process.argv[i + 1]);
  return Number.isFinite(v) ? v : fallback;
}

const channels = [
  { id: "dine_in", label: "Dine-in", gmv: arg("dinein"), fee_pct: arg("dinein_fee_pct", 0) },
  { id: "takeout", label: "Takeout / first-party", gmv: arg("takeout"), fee_pct: arg("takeout_fee_pct", 0) },
  { id: "doordash", label: "DoorDash", gmv: arg("doordash"), fee_pct: arg("doordash_fee_pct", 25) },
  { id: "uber_eats", label: "Uber Eats", gmv: arg("uber"), fee_pct: arg("uber_fee_pct", 30) },
  { id: "grubhub", label: "Grubhub", gmv: arg("grubhub"), fee_pct: arg("grubhub_fee_pct", 30) },
  {
    id: "social_buy_now",
    label: "Never86 TikTok/IG buy-now",
    gmv: arg("social_buy_now"),
    fee_pct: arg("social_fee_pct", 0),
  },
].filter((c) => c.gmv > 0);

if (!channels.length) {
  console.error(
    "keep-channel-grader: pass at least one channel GMV, e.g. --dinein 10000 --doordash 8000 --doordash_fee_pct 25"
  );
  process.exit(2);
}

const ranked = channels
  .map((c) => {
    const fee = (c.gmv * c.fee_pct) / 100;
    const keep = c.gmv - fee;
    const keep_pct = c.gmv ? (keep / c.gmv) * 100 : 0;
    return {
      ...c,
      fee_dollars: Math.round(fee * 100) / 100,
      keep_dollars: Math.round(keep * 100) / 100,
      keep_pct: Math.round(keep_pct * 100) / 100,
    };
  })
  .sort((a, b) => b.keep_dollars - a.keep_dollars);

const marketplace = ranked.filter((c) => ["doordash", "uber_eats", "grubhub"].includes(c.id));
const marketplace_fee = marketplace.reduce((s, c) => s + c.fee_dollars, 0);
const best = ranked[0];
const worst = [...ranked].sort((a, b) => a.keep_pct - b.keep_pct)[0];

const never86_wedge =
  marketplace_fee > 0
    ? "anti_marketplace_buy_now"
    : best?.id === "social_buy_now"
      ? "love_to_buy_now"
      : "channel_rank_review";

console.log(
  JSON.stringify(
    {
      purpose: "Rank channels by KEEP$ after fees — pilot public grader wedge (not forecasting)",
      ranked,
      summary: {
        best_keep_channel: best?.id || null,
        worst_keep_pct_channel: worst?.id || null,
        marketplace_fee_total: Math.round(marketplace_fee * 100) / 100,
        never86_wedge,
        teach:
          "Biggest GMV channel may not be best KEEP. Shift social demand to Never86 buy-now; dual-run marketplaces for discovery only.",
      },
    },
    null,
    2
  )
);
process.exit(0);
