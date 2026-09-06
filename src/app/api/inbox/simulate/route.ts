import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";
import { processSalesConversation } from "@/lib/ai/sales-agent";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const {
      customerName = "Prospective Buyer",
      customerPhone = "+91 98000 12345",
      messageText = "Hello! Do you have items in stock?",
    } = body;

    // Find or create conversation for this tenant
    let conversation = await prisma.conversation.findFirst({
      where: {
        businessId,
        customerPhone,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          businessId,
          customerName,
          customerPhone,
          mode: "AI_MODE",
          unreadCount: 1,
          lastMessage: messageText,
        },
      });
    }

    // 1. Create inbound message
    const customerMsg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "CUSTOMER",
        content: messageText,
        timestamp: new Date(),
      },
    });

    // 2. Process AI Sales Agent response using strictly this tenant's products
    let aiMsg = null;
    let aiResult = null;
    if (conversation.mode === "AI_MODE") {
      aiResult = await processSalesConversation(
        businessId,
        messageText,
        customerName,
        customerPhone
      );

      aiMsg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          sender: "AI",
          content: aiResult.reply,
          timestamp: new Date(Date.now() + 800),
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessage: aiResult.reply,
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      customerMessage: customerMsg,
      aiMessage: aiMsg,
      aiResult,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Inbox simulate error:", error);
    return NextResponse.json({ error: "Failed to simulate message" }, { status: 500 });
  }
}
