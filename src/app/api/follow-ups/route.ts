import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET() {
  try {
    const { businessId } = await requireBusinessTenant();
    const opportunities = await prisma.followUpOpportunity.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ opportunities });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Follow-ups GET error:", error);
    return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { id, action, customMessage } = body;

    const opp = await prisma.followUpOpportunity.findFirst({
      where: { id, businessId },
    });

    if (!opp) return NextResponse.json({ error: "Opportunity not found or access denied" }, { status: 404 });

    if (action === "SEND") {
      let conv = await prisma.conversation.findFirst({
        where: { businessId, customerPhone: opp.customerPhone },
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            businessId,
            customerName: opp.customerName,
            customerPhone: opp.customerPhone,
            mode: "AI_MODE",
          },
        });
      }

      const msgContent = customMessage || opp.suggestedMessage;

      await prisma.message.create({
        data: {
          conversationId: conv.id,
          sender: "AI",
          content: msgContent,
          timestamp: new Date(),
        },
      });

      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          lastMessage: msgContent,
          lastMessageAt: new Date(),
        },
      });

      const updated = await prisma.followUpOpportunity.update({
        where: { id },
        data: { status: "SENT" },
      });

      await prisma.aIActionLog.create({
        data: {
          businessId,
          actionType: "FOLLOW_UP_TRIGGERED",
          description: `AI WhatsApp follow-up dispatched to ${opp.customerName} (${opp.customerPhone})`,
          entityType: "CUSTOMER",
        },
      });

      return NextResponse.json({ success: true, opportunity: updated });
    } else if (action === "DISMISS") {
      const updated = await prisma.followUpOpportunity.update({
        where: { id },
        data: { status: "DISMISSED" },
      });
      return NextResponse.json({ success: true, opportunity: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Follow-up action error:", error);
    return NextResponse.json({ error: "Failed to process follow-up action" }, { status: 500 });
  }
}
