/** Marketplace KEEP / commission-quit scorer for pain stubs. Keep in sync with scripts/score-marketplace-keep.mjs */
export type MarketplaceKeepResult = {
  score: number;
  signals: string[];
  never86_wedge: "anti_marketplace_buy_now" | "weak_or_consumer_only";
};

const RULES: { re: RegExp; signal: string; w: number }[] = [
  { re: /\bkeep\b/i, signal: "keep_language", w: 25 },
  { re: /commission/i, signal: "commission", w: 20 },
  { re: /\b(15|20|25|30)\s*%|\b\d{2}\s*%\s*commission/i, signal: "commission_pct", w: 20 },
  { re: /doordash|uber\s*eats|grubhub|marketplace/i, signal: "marketplace_named", w: 15 },
  { re: /quit|quitt?ing|ditch|leaving|drop(ped)?/i, signal: "quit_switch", w: 20 },
  { re: /fee|fees|rent|cut from/i, signal: "fee_rent", w: 15 },
  { re: /first[\s-]?party|direct order|own(ed)? (the )?customer/i, signal: "first_party", w: 15 },
  { re: /restaurant owner|operator|gm\b/i, signal: "operator_voice", w: 10 },
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
