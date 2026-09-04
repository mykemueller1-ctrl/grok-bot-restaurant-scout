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
  { re: /(?:\$|€)\d+(?:\.\d{2})?(?:\s+(?!per\b)\w+){0,3}\s*(per[\s-]?(?:fulfilled\s+)?order|per[\s-]?delivery|\/\s*order)|per[\s-]?(?:fulfilled\s+)?order (fee|charge|service fee|overage|commission)|per[\s-]?delivery (fee|charge)|flat \$\d+(?:\.\d{2})?\s*(?:\+|fee)|online order service fee|(?:\$|€)\d+(?:\.\d{2})?\s+commission fee|flat rate \+ percentage|€0\.50|€0\.45|0\.45\s*€|38\s*cents|\$0\.38|19\s*cents/i, signal: "per_order_platform_fee", w: 15 },
  // First-party OS still takes a % (Owner Flex 5% / IG checkout 5% / Flipdish ~2–7% direct commission)
  { re: /5%\s*(restaurant|per[\s-]?order|platform|order support|selling|checkout|charged on|fee|transaction)|7\.5%\s*(support local|of the subtotal|fee|guest|diner)?|2\s*[–\-]\s*7%\s*(per[\s-]?order\s*)?(commission|fee)|2\.99%\s*(service|online|ordering|platform|consumer)?|2\.5%\s*(order\s*)?processing|2\.5%\s*\+\s*\$0\.29|2%\s*\+\s*(?:€|EUR\s*)?0[,.]45|2%\s*\+\s*0[,.]45\s*€|1\.9%\s*(service|fee)?|capped at \$2(?:\.00)?|max \$2(?:\.00)?|restaurant fee per order|order support fee|owner\.com.*5%|\$249.*5%|\$0\.40\s*(per[\s-]?order|minimum)|\$1\.99\s*minimum|hard cap of \$7\.50|cap of \$7\.50|flipdish.*(2|5|7)\s*%|online ordering service fee|support local fee|order with google fee|2%\s*\(charged to customer\)|1%\s*\(charged to customer\)|5%\s*convenience fee|8%\s*(monthly\s*)?(commission|fee)|15\.5%\s*(marketing|fee|discovery)?|3\.9%\s*per\s*order|2\.9%\s*per\s*order|marketing fee.*15\.5|order better network|8%\s*(online\s*)?(ordering\s*)?fee|online ordering fee|2%\s*convenience fee|1%\s*convenience fee|convenience fee per order|3%\s*on all orders|3%\s*platform commission|platform commission:\s*3%|5%\s*on all orders|5%\s*(fee\s+)?per\s+catering|catering\s+orders?\s+will\s+be\s+charged\s+a\s+5%|5%\s*(rate|commission|fee)\s*(through|on|per)?\s*(your\s+)?(own\s+)?(branded\s+)?(direct\s+)?catering/i, signal: "first_party_pct_fee", w: 15 },
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
