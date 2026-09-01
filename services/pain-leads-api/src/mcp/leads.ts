import type { PrismaClient } from "@prisma/client";

export async function dispatchLeadTool(
  prisma: PrismaClient,
  tool: string,
  args: Record<string, unknown>
) {
  switch (tool) {
    case "save_pain_lead":
      return prisma.painLead.create({
        data: {
          painId: String(args.pain_id ?? args.painId ?? ""),
          vendorId: args.vendor_id ? String(args.vendor_id) : null,
          category: args.category ? String(args.category) : null,
          complaintSummary: String(args.complaint_summary ?? args.complaintSummary ?? ""),
          quotes: (args.quotes as string[]) ?? [],
          vendorsMentioned: (args.vendors_mentioned as string[]) ?? [],
          stackGuess: (args.stack_guess as string[]) ?? [],
          rawContext: args.raw_context ? String(args.raw_context) : null,
          status: String(args.status ?? "NEEDS_TEACH"),
          score: args.score != null ? Number(args.score) : null,
          identity: (args.identity as object) ?? undefined,
          venue: (args.venue as object) ?? undefined,
          sources: (args.sources as object) ?? undefined,
        },
      });
    case "list_pain_leads": {
      const painId = args.pain_id ? String(args.pain_id) : undefined;
      return prisma.painLead.findMany({
        ...(painId ? { where: { painId } } : {}),
        take: 50,
        orderBy: { createdAt: "desc" },
      });
    }
    case "save_teach_feedback":
      return prisma.teachFeedback.create({
        data: {
          painLeadId: String(args.pain_lead_id ?? ""),
          painId: args.pain_id ? String(args.pain_id) : null,
          label: String(args.label ?? ""),
          correctedPainId: args.corrected_pain_id ? String(args.corrected_pain_id) : null,
          notes: args.notes ? String(args.notes) : null,
          goodLooksLike: args.good_looks_like ? String(args.good_looks_like) : null,
        },
      });
    case "update_learned_bank": {
      const vendorId = String(args.vendor_id ?? "");
      const data = (args.data as object) ?? {};
      return prisma.vendorLearnedBank.upsert({
        where: { vendorId },
        create: {
          vendorId,
          painId: args.pain_id ? String(args.pain_id) : null,
          data,
          version: 1,
        },
        update: {
          data,
          version: { increment: 1 },
          painId: args.pain_id ? String(args.pain_id) : null,
        },
      });
    }
    case "get_learned_bank": {
      const vendorId = String(args.vendor_id ?? "");
      return prisma.vendorLearnedBank.findUnique({ where: { vendorId } });
    }
    case "save_sales_lead":
      return prisma.salesLead.create({
        data: {
          painLeadId: args.pain_lead_id ? String(args.pain_lead_id) : null,
          painId: String(args.pain_id ?? ""),
          vendorId: args.vendor_id ? String(args.vendor_id) : null,
          category: args.category ? String(args.category) : null,
          accountName: String(args.account_name ?? ""),
          complaintThesis: String(args.complaint_thesis ?? ""),
          whyNever86Now: String(args.why_never86_now ?? ""),
          vendorsToDisplace: (args.vendors_to_displace as string[]) ?? [],
          stackGuess: (args.stack_guess as string[]) ?? [],
          suggestedAngle: args.suggested_angle ? String(args.suggested_angle) : null,
          confidence: args.confidence != null ? Number(args.confidence) : null,
          status: String(args.status ?? "DRAFT"),
          contact: (args.contact as object) ?? undefined,
          sources: (args.sources as string[]) ?? [],
        },
      });
    case "list_sales_leads":
      return prisma.salesLead.findMany({ take: 50, orderBy: { createdAt: "desc" } });
    case "merge_leads":
    case "list_vendor_aliases":
    case "record_vendor_phrase":
    case "route_wrong_pain":
      return { ok: true, tool, note: "stub — extend in vendor-complaint-learn pass" };
    default:
      return { error: `unknown tool: ${tool}` };
  }
}

export const LEAD_TOOLS = [
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
