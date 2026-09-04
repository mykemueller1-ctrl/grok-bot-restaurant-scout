/** Complaint source tools — agents use Grok Bot browser + social-trends for live search. */
import { scoreMarketplaceKeep } from "../lib/marketplaceKeepScore.js";
import { channelsFromArgs, gradeKeepChannels } from "../lib/keepChannelGrade.js";

export async function dispatchSourceTool(tool: string, args: Record<string, unknown>) {
  switch (tool) {
    case "search_tiktok":
    case "search_reddit":
    case "search_facebook_groups":
    case "search_x":
    case "search_forums":
      return {
        ok: true,
        tool,
        mode: "browser_takeover",
        query: args.query ?? args.q ?? "",
        hint: "Use Agent Computer browser takeover + seed_queries from agent JSON. Persist hits via lead-shop save_pain_lead.",
        platforms: {
          search_tiktok: "https://www.tiktok.com/search?q=",
          search_reddit: "https://www.reddit.com/search/?q=",
          search_facebook_groups: "https://www.facebook.com/search/groups/?q=",
          search_x: "https://x.com/search?q=",
          search_forums: "https://www.google.com/search?q=site:reddit.com+OR+site:ttforum.com+",
        }[tool],
      };
    case "get_thread_context":
      return {
        ok: true,
        tool,
        note: "Scrape visible thread via browser; attach raw_context on save_pain_lead",
        url: args.url ?? null,
      };
    case "get_profile_public":
      return {
        ok: true,
        tool,
        note: "Public profile only — no login bypass",
        handle: args.handle ?? null,
      };
    case "score_marketplace_keep": {
      const snippet = String(args.snippet ?? args.text ?? args.query ?? "");
      if (!snippet.trim()) {
        return { error: "snippet required", tool };
      }
      return { ok: true, tool, ...scoreMarketplaceKeep(snippet) };
    }
    case "keep_channel_grade": {
      const channels = Array.isArray(args.channels)
        ? (args.channels as { id: string; label?: string; gmv: number; fee_pct: number }[]).map((c) => ({
            id: String(c.id),
            label: String(c.label ?? c.id),
            gmv: Number(c.gmv) || 0,
            fee_pct: Number(c.fee_pct) || 0,
          }))
        : channelsFromArgs(args);
      if (!channels.length) {
        return {
          error: "pass channel GMVs (dinein/takeout/doordash/uber/grubhub/social_buy_now) or channels[]",
          tool,
        };
      }
      return { ok: true, tool, ...gradeKeepChannels(channels) };
    }
    default:
      return { error: `unknown tool: ${tool}` };
  }
}

export const SOURCE_TOOLS = [
  "search_tiktok",
  "search_reddit",
  "search_facebook_groups",
  "search_x",
  "search_forums",
  "get_thread_context",
  "get_profile_public",
  "score_marketplace_keep",
  "keep_channel_grade",
];
