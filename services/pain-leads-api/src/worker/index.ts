/**
 * Cloudflare Worker entry — Never86 pain-leads MCP API on D1.
 * Same routes as the Fastify/Render service: /health, /mcp, /mcp/leads|sources|approvals
 */
export interface Env {
  DB: D1Database;
  MCP_API_TOKEN?: string;
  OWNER_EMAIL?: string;
}

type McpBody = { tool?: string; arguments?: Record<string, unknown> };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function nowIso(): string {
  return new Date().toISOString();
}

function id(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function asJsonArray(v: unknown): string {
  return JSON.stringify(Array.isArray(v) ? v : []);
}

function asJsonObj(v: unknown): string | null {
  if (v == null) return null;
  return JSON.stringify(v);
}

function checkAuth(req: Request, env: Env): boolean {
  if (!env.MCP_API_TOKEN) return true;
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  return bearer === env.MCP_API_TOKEN;
}

async function parseBody(req: Request): Promise<McpBody | null> {
  try {
    const body = (await req.json()) as McpBody;
    if (!body?.tool) return null;
    return body;
  } catch {
    return null;
  }
}

const LEAD_TOOLS = [
  "save_pain_lead",
  "list_pain_leads",
  "save_teach_feedback",
  "update_learned_bank",
  "get_learned_bank",
  "save_sales_lead",
  "merge_leads",
  "list_sales_leads",
  "list_vendor_aliases",
  "record_vendor_phrase",
  "route_wrong_pain",
];

const SOURCE_TOOLS = [
  "search_tiktok",
  "search_reddit",
  "search_facebook_groups",
  "search_x",
  "search_forums",
  "get_thread_context",
  "get_profile_public",
];

const APPROVAL_TOOLS = ["request_approval", "check_approval_status"];

async function dispatchLead(db: D1Database, tool: string, args: Record<string, unknown>) {
  const ts = nowIso();
  switch (tool) {
    case "save_pain_lead": {
      const rowId = id();
      await db
        .prepare(
          `INSERT INTO PainLead (id,painId,vendorId,category,complaintSummary,quotes,vendorsMentioned,stackGuess,rawContext,status,score,identity,venue,sources,createdAt,updatedAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        )
        .bind(
          rowId,
          String(args.pain_id ?? args.painId ?? ""),
          args.vendor_id ? String(args.vendor_id) : null,
          args.category ? String(args.category) : null,
          String(args.complaint_summary ?? args.complaintSummary ?? ""),
          asJsonArray(args.quotes),
          asJsonArray(args.vendors_mentioned),
          asJsonArray(args.stack_guess),
          args.raw_context ? String(args.raw_context) : null,
          String(args.status ?? "NEEDS_TEACH"),
          args.score != null ? Number(args.score) : null,
          asJsonObj(args.identity),
          asJsonObj(args.venue),
          asJsonObj(args.sources),
          ts,
          ts
        )
        .run();
      return db.prepare(`SELECT * FROM PainLead WHERE id = ?`).bind(rowId).first();
    }
    case "list_pain_leads": {
      if (args.pain_id) {
        return db
          .prepare(`SELECT * FROM PainLead WHERE painId = ? ORDER BY createdAt DESC LIMIT 50`)
          .bind(String(args.pain_id))
          .all()
          .then((r) => r.results);
      }
      return db
        .prepare(`SELECT * FROM PainLead ORDER BY createdAt DESC LIMIT 50`)
        .all()
        .then((r) => r.results);
    }
    case "save_teach_feedback": {
      const rowId = id();
      await db
        .prepare(
          `INSERT INTO TeachFeedback (id,painLeadId,painId,label,correctedPainId,notes,goodLooksLike,createdAt)
           VALUES (?,?,?,?,?,?,?,?)`
        )
        .bind(
          rowId,
          String(args.pain_lead_id ?? ""),
          args.pain_id ? String(args.pain_id) : null,
          String(args.label ?? ""),
          args.corrected_pain_id ? String(args.corrected_pain_id) : null,
          args.notes ? String(args.notes) : null,
          args.good_looks_like ? String(args.good_looks_like) : null,
          ts
        )
        .run();
      return db.prepare(`SELECT * FROM TeachFeedback WHERE id = ?`).bind(rowId).first();
    }
    case "update_learned_bank": {
      const vendorId = String(args.vendor_id ?? "");
      const data = asJsonObj(args.data ?? {}) ?? "{}";
      const existing = await db
        .prepare(`SELECT id, version FROM VendorLearnedBank WHERE vendorId = ?`)
        .bind(vendorId)
        .first<{ id: string; version: number }>();
      if (existing) {
        await db
          .prepare(
            `UPDATE VendorLearnedBank SET data = ?, version = ?, painId = ?, updatedAt = ? WHERE vendorId = ?`
          )
          .bind(data, existing.version + 1, args.pain_id ? String(args.pain_id) : null, ts, vendorId)
          .run();
      } else {
        await db
          .prepare(
            `INSERT INTO VendorLearnedBank (id,vendorId,painId,data,version,updatedAt) VALUES (?,?,?,?,?,?)`
          )
          .bind(id(), vendorId, args.pain_id ? String(args.pain_id) : null, data, 1, ts)
          .run();
      }
      return db.prepare(`SELECT * FROM VendorLearnedBank WHERE vendorId = ?`).bind(vendorId).first();
    }
    case "get_learned_bank": {
      const vendorId = String(args.vendor_id ?? "");
      return db.prepare(`SELECT * FROM VendorLearnedBank WHERE vendorId = ?`).bind(vendorId).first();
    }
    case "save_sales_lead": {
      const rowId = id();
      await db
        .prepare(
          `INSERT INTO SalesLead (id,painLeadId,painId,vendorId,category,accountName,complaintThesis,whyNever86Now,vendorsToDisplace,stackGuess,suggestedAngle,confidence,status,contact,sources,createdAt,updatedAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        )
        .bind(
          rowId,
          args.pain_lead_id ? String(args.pain_lead_id) : null,
          String(args.pain_id ?? ""),
          args.vendor_id ? String(args.vendor_id) : null,
          args.category ? String(args.category) : null,
          String(args.account_name ?? ""),
          String(args.complaint_thesis ?? ""),
          String(args.why_never86_now ?? ""),
          asJsonArray(args.vendors_to_displace),
          asJsonArray(args.stack_guess),
          args.suggested_angle ? String(args.suggested_angle) : null,
          args.confidence != null ? Number(args.confidence) : null,
          String(args.status ?? "DRAFT"),
          asJsonObj(args.contact),
          asJsonArray(args.sources),
          ts,
          ts
        )
        .run();
      return db.prepare(`SELECT * FROM SalesLead WHERE id = ?`).bind(rowId).first();
    }
    case "list_sales_leads":
      return db
        .prepare(`SELECT * FROM SalesLead ORDER BY createdAt DESC LIMIT 50`)
        .all()
        .then((r) => r.results);
    case "merge_leads":
    case "list_vendor_aliases":
    case "record_vendor_phrase":
    case "route_wrong_pain":
      return { ok: true, tool, note: "stub — extend in vendor-complaint-learn pass" };
    default:
      return { error: `unknown tool: ${tool}` };
  }
}

async function dispatchSource(tool: string, args: Record<string, unknown>) {
  const platforms: Record<string, string> = {
    search_tiktok: "https://www.tiktok.com/search?q=",
    search_reddit: "https://www.reddit.com/search/?q=",
    search_facebook_groups: "https://www.facebook.com/search/groups/?q=",
    search_x: "https://x.com/search?q=",
    search_forums: "https://www.google.com/search?q=site:reddit.com+OR+site:ttforum.com+",
  };
  if (platforms[tool]) {
    return {
      ok: true,
      tool,
      mode: "browser_takeover",
      query: args.query ?? args.q ?? "",
      hint: "Use Agent Computer browser takeover + seed_queries from agent JSON. Persist hits via lead-shop save_pain_lead.",
      platforms: platforms[tool],
    };
  }
  if (tool === "get_thread_context") {
    return { ok: true, tool, note: "Scrape visible thread via browser; attach raw_context on save_pain_lead", url: args.url ?? null };
  }
  if (tool === "get_profile_public") {
    return { ok: true, tool, note: "Public profile only — no login bypass", handle: args.handle ?? null };
  }
  return { error: `unknown tool: ${tool}` };
}

async function dispatchApproval(db: D1Database, env: Env, tool: string, args: Record<string, unknown>) {
  const ts = nowIso();
  if (tool === "request_approval") {
    const rowId = id();
    await db
      .prepare(
        `INSERT INTO ApprovalRequest (id,agentId,action,payload,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)`
      )
      .bind(
        rowId,
        args.agent_id ? String(args.agent_id) : null,
        String(args.action ?? "outbound"),
        asJsonObj(args.payload),
        "PENDING",
        ts,
        ts
      )
      .run();
    return {
      id: rowId,
      status: "PENDING",
      message: "Queued for owner review. Do not proceed until check_approval_status returns APPROVED.",
      owner_email: env.OWNER_EMAIL ?? null,
    };
  }
  if (tool === "check_approval_status") {
    const rowId = String(args.id ?? "");
    const row = await db.prepare(`SELECT * FROM ApprovalRequest WHERE id = ?`).bind(rowId).first();
    if (!row) return { error: "not found", id: rowId };
    return { id: row.id, status: row.status, action: row.action };
  }
  return { error: `unknown tool: ${tool}` };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    if (req.method === "GET" && path === "/health") {
      return json({ ok: true, service: "never86-pain-leads-api", host: "cloudflare", ts: Date.now() });
    }

    if (req.method === "GET" && path === "/mcp") {
      return json({
        ok: true,
        transport: "http",
        invoke: "POST /mcp/{leads|sources|approvals} with { tool, arguments }",
        endpoints: { leads: LEAD_TOOLS, sources: SOURCE_TOOLS, approvals: APPROVAL_TOOLS },
      });
    }

    if (req.method === "POST" && (path === "/mcp" || path === "/mcp/leads" || path === "/mcp/sources" || path === "/mcp/approvals")) {
      if (!checkAuth(req, env)) return json({ error: "unauthorized" }, 401);
      const body = await parseBody(req);
      if (!body?.tool) return json({ error: "tool required" }, 400);
      const args = body.arguments ?? {};
      try {
        if (path === "/mcp/sources") return json(await dispatchSource(body.tool, args));
        if (path === "/mcp/approvals") return json(await dispatchApproval(env.DB, env, body.tool, args));
        // /mcp and /mcp/leads → lead tools
        return json(await dispatchLead(env.DB, body.tool, args));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return json({ error: "internal", message }, 500);
      }
    }

    return json({ error: "not found", path }, 404);
  },
};
