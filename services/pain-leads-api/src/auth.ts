import type { FastifyReply, FastifyRequest } from "fastify";

export function checkAuth(req: FastifyRequest, reply: FastifyReply, token?: string) {
  if (!token) return true;
  const header = req.headers.authorization ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (bearer !== token) {
    reply.code(401);
    return false;
  }
  return true;
}

export type McpBody = {
  tool: string;
  arguments?: Record<string, unknown>;
};

export function parseMcpBody(req: FastifyRequest): McpBody | null {
  const body = req.body as McpBody;
  if (!body?.tool) return null;
  return body;
}
