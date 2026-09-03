import type { PrismaClient } from "@prisma/client";

export async function dispatchApprovalTool(
  prisma: PrismaClient,
  tool: string,
  args: Record<string, unknown>
) {
  switch (tool) {
    case "request_approval": {
      const row = await prisma.approvalRequest.create({
        data: {
          agentId: args.agent_id ? String(args.agent_id) : null,
          action: String(args.action ?? "outbound"),
          payload: (args.payload as object) ?? undefined,
          status: "PENDING",
        },
      });
      return {
        id: row.id,
        status: "PENDING",
        message: "Queued for owner review. Do not proceed until check_approval_status returns APPROVED.",
        owner_email: process.env.OWNER_EMAIL ?? null,
      };
    }
    case "check_approval_status": {
      const id = String(args.id ?? "");
      const row = await prisma.approvalRequest.findUnique({ where: { id } });
      if (!row) return { error: "not found", id };
      return { id: row.id, status: row.status, action: row.action };
    }
    default:
      return { error: `unknown tool: ${tool}` };
  }
}

export const APPROVAL_TOOLS = ["request_approval", "check_approval_status"];
