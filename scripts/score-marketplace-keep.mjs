#!/usr/bin/env node
/**
 * Score marketplace KEEP / commission-quit language in a pain snippet.
 * Usage: node scripts/score-marketplace-keep.mjs "snippet text…"
 * Exit 0 always; prints JSON { score, signals[] }. No network. No secrets.
 */
const text = process.argv.slice(2).join(" ").trim().toLowerCase();
if (!text) {
  console.error(
    'score-marketplace-keep: pass a snippet, e.g. node scripts/score-marketplace-keep.mjs "rank channels by what you KEEP"'
  );
  process.exit(2);
}

const rules = [
  { re: /\bkeep\b/, signal: "keep_language", w: 25 },
  { re: /commission/, signal: "commission", w: 20 },
  { re: /\b(15|20|25|30)\s*%|\b\d{1,2}(?:\.\d+)?\s*%\s*(commission|cost|fee)?/, signal: "commission_pct", w: 20 },
  { re: /doordash|uber\s*eats|grubhub|marketplace/, signal: "marketplace_named", w: 15 },
  { re: /quit|quitt?ing|ditch|leaving|drop(ped)?/, signal: "quit_switch", w: 20 },
  { re: /fee|fees|rent|cut from/, signal: "fee_rent", w: 15 },
  { re: /first[\s-]?party|direct order|own(ed)? (the )?customer/, signal: "first_party", w: 15 },
  { re: /restaurant owner|operator|gm\b/, signal: "operator_voice", w: 10 },
  // Statement math: headline commission ≠ take-home (Never86 anti-rent teach signal)
  { re: /effective cost|left with|lives on|what (is|you'?re? )left|statement:/, signal: "effective_cost_math", w: 20 },
  // POS lock-in (Toast / BentoBox→Clover) — stack pain for sales forms, not forecasting
  { re: /\btoast\b.*(fee|fees|lock|terminat)|leaving toast|toast pos|bentobox.*(clover|fee|\$0\.99)|clover pos.*(only|required)|must (be|adopt) clover/, signal: "pos_fee_lockin", w: 15 },
  // Delivery-menu padding / consumer markup backlash (operator + guest pain)
  { re: /pad(ded)?|menu markup|inflat(ed|e) menu|markup (on|to offset)/, signal: "menu_markup_pain", w: 15 },
  // First-party OS KEEP peers (Deonde/OPA!/SWIPEBY language)
  { re: /own your ordering|commission[\s-]?free|100%\s*of\s*(the\s*)?revenue|keep more profit/, signal: "own_ordering_keep", w: 15 },
  // Dual-run: keep marketplace for discovery, own channel for KEEP guests
  { re: /dual[\s-]?run|run both|marketplaces? for (new|discovery)|discovery.*(direct|first[\s-]?party)/, signal: "dual_run_marketplace", w: 15 },
  // Website/OS per-order platform fees (BentoBox $0.99/order, UpMenu $1.90 overage)
  { re: /\$\d+(?:\.\d{2})?\s*(per[\s-]?order|\/\s*order)|per[\s-]?order (fee|charge|service fee|overage)|online order service fee/, signal: "per_order_platform_fee", w: 15 },
  // First-party OS still takes a % (Owner Flex 5% restaurant fee / guest order support fee)
  { re: /5%\s*(restaurant|per[\s-]?order|platform|order support)|restaurant fee per order|order support fee|owner\.com.*5%|\$249.*5%/, signal: "first_party_pct_fee", w: 15 },
  // Marketplace vendor's own 0% direct channel (DoorDash OO / Uber Webshop / Grubhub Direct)
  { re: /doordash online ordering|uber\s*webshop|grubhub\s*direct|0%\s*commission on direct|online ordering.*(0%|zero)\s*commission|(0%|zero)\s*commission.*(direct|own (site|website|channel)|webshop)|drive on-demand|grubhub\s*connect/, signal: "marketplace_direct_zero", w: 15 },
];

const signals = [];
let score = 0;
for (const r of rules) {
  if (r.re.test(text)) {
    signals.push(r.signal);
    score += r.w;
  }
}
score = Math.min(100, score);

console.log(JSON.stringify({ score, signals, never86_wedge: score >= 50 ? "anti_marketplace_buy_now" : "weak_or_consumer_only" }));
process.exit(0);
