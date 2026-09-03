const TOKEN = process.env.MCP_API_TOKEN || "";

function store() {
  if (!globalThis.__n86) {
    globalThis.__n86 = { painLeads: [], salesLeads: [], teach: [], banks: {}, approvals: [] };
  }
  return globalThis.__n86;
}

function auth(req) {
  if (!TOKEN) return true;
  const h = req.headers.authorization || "";
  const b = h.startsWith("Bearer ") ? h.slice(7) : "";
  return b === TOKEN;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => {
      try {
        resolve(d ? JSON.parse(d) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function dispatch(tool, args) {
  const db = store();
  const id = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  switch (tool) {
    case "save_pain_lead": {
      const row = { id: id(), ...args, createdAt: new Date().toISOString() };
      db.painLeads.unshift(row);
      return row;
    }
    case "list_pain_leads":
      return db.painLeads.slice(0, 50);
    case "save_teach_feedback": {
      const row = { id: id(), ...args, createdAt: new Date().toISOString() };
      db.teach.unshift(row);
      return row;
    }
    case "update_learned_bank": {
      const vendorId = String(args.vendor_id || "");
      db.banks[vendorId] = {
        vendorId,
        data: args.data || {},
        version: (db.banks[vendorId]?.version || 0) + 1,
      };
      return db.banks[vendorId];
    }
    case "get_learned_bank":
      return db.banks[String(args.vendor_id || "")] || null;
    case "save_sales_lead": {
      const row = { id: id(), ...args, createdAt: new Date().toISOString() };
      db.salesLeads.unshift(row);
      return row;
    }
    case "list_sales_leads":
      return db.salesLeads.slice(0, 50);
    case "request_approval": {
      const row = {
        id: id(),
        status: "PENDING",
        action: args.action || "outbound",
        payload: args.payload,
        createdAt: new Date().toISOString(),
      };
      db.approvals.unshift(row);
      return { id: row.id, status: "PENDING", message: "Queued for owner review" };
    }
    case "check_approval_status":
      return db.approvals.find((a) => a.id === args.id) || { error: "not found" };
    case "search_tiktok":
    case "search_reddit":
    case "search_facebook_groups":
    case "search_x":
    case "search_forums":
      return { ok: true, tool, mode: "browser_takeover", query: args.query || args.q || "" };
    default:
      return { ok: true, tool, note: "stub" };
  }
}

module.exports = async (req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.method === "GET") {
    res.end(JSON.stringify({ ok: true, transport: "http", invoke: "POST with { tool, arguments }" }));
    return;
  }
  if (!auth(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "unauthorized" }));
    return;
  }
  try {
    const body = await readBody(req);
    if (!body.tool) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "tool required" }));
      return;
    }
    res.end(JSON.stringify(dispatch(body.tool, body.arguments || {})));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(e) }));
  }
};
