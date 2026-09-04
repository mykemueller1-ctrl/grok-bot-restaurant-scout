/** KEEP channel-rank grader. Keep in sync with scripts/keep-channel-grader.mjs */
export type KeepChannelInput = {
  id: string;
  label: string;
  gmv: number;
  fee_pct: number;
};

export type KeepChannelRow = KeepChannelInput & {
  fee_dollars: number;
  keep_dollars: number;
  keep_pct: number;
};

export type KeepChannelGradeResult = {
  purpose: string;
  ranked: KeepChannelRow[];
  summary: {
    best_keep_channel: string | null;
    worst_keep_pct_channel: string | null;
    marketplace_fee_total: number;
    never86_wedge: "anti_marketplace_buy_now" | "love_to_buy_now" | "channel_rank_review";
    teach: string;
  };
};

const MARKETPLACE_IDS = new Set(["doordash", "uber_eats", "grubhub"]);

export function gradeKeepChannels(channels: KeepChannelInput[]): KeepChannelGradeResult {
  const cleaned = channels.filter((c) => Number(c.gmv) > 0);
  const ranked = cleaned
    .map((c) => {
      const gmv = Number(c.gmv) || 0;
      const fee_pct = Number(c.fee_pct) || 0;
      const fee = (gmv * fee_pct) / 100;
      const keep = gmv - fee;
      return {
        id: String(c.id),
        label: String(c.label || c.id),
        gmv,
        fee_pct,
        fee_dollars: Math.round(fee * 100) / 100,
        keep_dollars: Math.round(keep * 100) / 100,
        keep_pct: gmv ? Math.round((keep / gmv) * 10000) / 100 : 0,
      };
    })
    .sort((a, b) => b.keep_dollars - a.keep_dollars);

  const marketplace = ranked.filter((c) => MARKETPLACE_IDS.has(c.id));
  const marketplace_fee = marketplace.reduce((s, c) => s + c.fee_dollars, 0);
  const best = ranked[0] ?? null;
  const worst = ranked.length
    ? [...ranked].sort((a, b) => a.keep_pct - b.keep_pct)[0]
    : null;

  let never86_wedge: KeepChannelGradeResult["summary"]["never86_wedge"] = "channel_rank_review";
  if (marketplace_fee > 0) never86_wedge = "anti_marketplace_buy_now";
  else if (best?.id === "social_buy_now") never86_wedge = "love_to_buy_now";

  return {
    purpose: "Rank channels by KEEP$ after fees — pilot public grader wedge (not forecasting)",
    ranked,
    summary: {
      best_keep_channel: best?.id ?? null,
      worst_keep_pct_channel: worst?.id ?? null,
      marketplace_fee_total: Math.round(marketplace_fee * 100) / 100,
      never86_wedge,
      teach:
        "Biggest GMV channel may not be best KEEP. Shift social demand to Never86 buy-now; dual-run marketplaces for discovery only.",
    },
  };
}

/** Parse MCP/CLI-style channel bag into KeepChannelInput[] */
export function channelsFromArgs(args: Record<string, unknown>): KeepChannelInput[] {
  const num = (k: string, fallback = 0) => {
    const v = Number(args[k]);
    return Number.isFinite(v) ? v : fallback;
  };
  return [
    { id: "dine_in", label: "Dine-in", gmv: num("dinein"), fee_pct: num("dinein_fee_pct", 0) },
    { id: "takeout", label: "Takeout / first-party", gmv: num("takeout"), fee_pct: num("takeout_fee_pct", 0) },
    { id: "doordash", label: "DoorDash", gmv: num("doordash"), fee_pct: num("doordash_fee_pct", 25) },
    { id: "uber_eats", label: "Uber Eats", gmv: num("uber"), fee_pct: num("uber_fee_pct", 30) },
    { id: "grubhub", label: "Grubhub", gmv: num("grubhub"), fee_pct: num("grubhub_fee_pct", 30) },
    {
      id: "social_buy_now",
      label: "Never86 TikTok/IG buy-now",
      gmv: num("social_buy_now"),
      fee_pct: num("social_fee_pct", 0),
    },
  ].filter((c) => c.gmv > 0);
}
