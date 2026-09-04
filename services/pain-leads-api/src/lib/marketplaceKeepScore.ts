/** Marketplace KEEP / commission-quit scorer for pain stubs. Keep in sync with scripts/score-marketplace-keep.mjs */
export type MarketplaceKeepResult = {
  score: number;
  signals: string[];
  never86_wedge: "anti_marketplace_buy_now" | "weak_or_consumer_only";
};

const RULES: { re: RegExp; signal: string; w: number }[] = [
  { re: /\bkeep\b/i, signal: "keep_language", w: 25 },
  { re: /commission/i, signal: "commission", w: 20 },
  { re: /\b(15|20|25|30)\s*%|\b\d{1,2}(?:\.\d+)?\s*%\s*(commission|cost|fee)?/i, signal: "commission_pct", w: 20 },
  { re: /doordash|uber\s*eats|grubhub|marketplace/i, signal: "marketplace_named", w: 15 },
  { re: /quit|quitt?ing|ditch|leaving|drop(ped)?/i, signal: "quit_switch", w: 20 },
  { re: /fee|fees|rent|cut from/i, signal: "fee_rent", w: 15 },
  { re: /first[\s-]?party|direct order|own(ed)? (the )?customer/i, signal: "first_party", w: 15 },
  { re: /restaurant owner|operator|gm\b/i, signal: "operator_voice", w: 10 },
  // Statement math: headline commission ≠ take-home (Never86 anti-rent teach signal)
  { re: /effective cost|left with|lives on|what (is|you'?re? )left|statement:/i, signal: "effective_cost_math", w: 20 },
  // POS lock-in (Toast / BentoBox→Clover) — stack pain for sales forms, not forecasting
  { re: /\btoast\b.*(fee|fees|lock|terminat)|leaving toast|toast pos|bentobox.*(clover|fee|\$0\.99)|clover pos.*(only|required)|must (be|adopt) clover/i, signal: "pos_fee_lockin", w: 15 },
  // Delivery-menu padding / consumer markup backlash (operator + guest pain)
  { re: /pad(ded)?|menu markup|inflat(ed|e) menu|markup (on|to offset)/i, signal: "menu_markup_pain", w: 15 },
  // First-party OS KEEP peers (Deonde/OPA!/SWIPEBY language)
  { re: /own your ordering|commission[\s-]?free|100%\s*of\s*(the\s*)?revenue|keep more profit/i, signal: "own_ordering_keep", w: 15 },
  // Dual-run: keep marketplace for discovery, own channel for KEEP guests
  { re: /dual[\s-]?run|run both|marketplaces? for (new|discovery)|discovery.*(direct|first[\s-]?party)/i, signal: "dual_run_marketplace", w: 15 },
  // Website/OS per-order platform fees (BentoBox $0.99/order, UpMenu $1.90 overage) — not marketplace % but still KEEP leak
  { re: /\$\d+(?:\.\d{2})?\s*(per[\s-]?(?:fulfilled\s+)?order|\/\s*order)|per[\s-]?(?:fulfilled\s+)?order (fee|charge|service fee|overage)|online order service fee/i, signal: "per_order_platform_fee", w: 15 },
  // First-party OS still takes a % (Owner Flex 5% / IG checkout 5% / Flipdish ~2–7% direct commission)
  { re: /5%\s*(restaurant|per[\s-]?order|platform|order support|selling|checkout)|2\s*[–\-]\s*7%\s*(per[\s-]?order\s*)?(commission|fee)|restaurant fee per order|order support fee|owner\.com.*5%|\$249.*5%|\$0\.40\s*(per[\s-]?order|minimum)|flipdish.*(2|5|7)\s*%/i, signal: "first_party_pct_fee", w: 15 },
  // Marketplace vendor's own 0% direct channel (DoorDash OO / Uber Webshop / Grubhub Direct)
  { re: /doordash online ordering|uber\s*webshop|grubhub\s*direct|0%\s*commission on direct|online ordering.*(0%|zero)\s*commission|(0%|zero)\s*commission.*(direct|own (site|website|channel)|webshop)|drive on-demand|grubhub\s*connect/i, signal: "marketplace_direct_zero", w: 15 },
  // Social shop take-rate vs marketplace rent (TikTok Shop ~6% US; watch Oct 2026 ~8%)
  { re: /tiktok shop.*(6|8)\s*%|(6|8)\s*%\s*(referral|unified|commission|platform)|shop referral fee|unified referral/i, signal: "social_shop_fee", w: 15 },
  // Guest-paid OO tech fees (DevourNow $2.99 / $1+% diner fees under 0% commission claims)
  { re: /customers? pay|guests? pay|diner[- ]paid|guest[- ]paid|tech fee|service fee.*(customer|guest|diner)|(customer|guest|diner).*(tech|service|platform) fee/i, signal: "guest_paid_platform_fee", w: 15 },
];

export function scoreMarketplaceKeep(snippet: string): MarketplaceKeepResult {
  const text = String(snippet ?? "").trim();
  const signals: string[] = [];
  let score = 0;
  for (const r of RULES) {
    if (r.re.test(text)) {
      signals.push(r.signal);
      score += r.w;
    }
  }
  score = Math.min(100, score);
  return {
    score,
    signals,
    never86_wedge: score >= 50 ? "anti_marketplace_buy_now" : "weak_or_consumer_only",
  };
}
