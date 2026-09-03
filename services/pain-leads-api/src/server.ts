import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { checkAuth, parseMcpBody } from "./auth.js";
import { APPROVAL_TOOLS, dispatchApprovalTool } from "./mcp/approvals.js";
import { dispatchLeadTool, LEAD_TOOLS } from "./mcp/leads.js";
import { dispatchSourceTool, SOURCE_TOOLS } from "./mcp/sources.js";

const prisma = new PrismaClient();
const token = process.env.MCP_API_TOKEN;
const app = Fastify({ logger: true });

app.get("/health", async () => ({
  ok: true,
  service: "never86-pain-leads-api",
  ts: Date.now(),
}));

app.get("/mcp", async () => ({
  ok: true,
  transport: "http",
  invoke: "POST /mcp/{leads|sources|approvals} with { tool, arguments }",
  endpoints: {
    leads: LEAD_TOOLS,
    sources: SOURCE_TOOLS,
    approvals: APPROVAL_TOOLS,
  },
}));

function mcpPost(path: string, dispatch: (tool: string, args: Record<string, unknown>) => Promise<unknown>) {
  app.post(path, async (req, reply) => {
    if (!checkAuth(req, reply, token)) return { error: "unauthorized" };
    const body = parseMcpBody(req);
    if (!body) {
      reply.code(400);
      return { error: "tool required" };
    }
    return dispatch(body.tool, body.arguments ?? {});
  });
}

mcpPost("/mcp/leads", (tool, args) => dispatchLeadTool(prisma, tool, args));
mcpPost("/mcp/sources", (tool, args) => dispatchSourceTool(tool, args));
mcpPost("/mcp/approvals", (tool, args) => dispatchApprovalTool(prisma, tool, args));

/** Legacy single /mcp path — routes lead tools only (commerce-engine compat). */
app.post("/mcp", async (req, reply) => {
  if (!checkAuth(req, reply, token)) return { error: "unauthorized" };
  const body = parseMcpBody(req);
  if (!body) {
    reply.code(400);
    return { error: "tool required" };
  }
  return dispatchLeadTool(prisma, body.tool, body.arguments ?? {});
});

const port = Number(process.env.PORT ?? 10000);
const host = "0.0.0.0";

app
  .listen({ port, host })
  .then(() => app.log.info(`Never86 pain-leads API on ${host}:${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
