import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";
import { processSalesConversation } from "@/lib/ai/sales-agent";

export async function GET(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    const conversations = await prisma.conversation.findMany({
      where: { businessId },
      include: {
        customer: {
          include: {
            orders: {
              where: { businessId },
              orderBy: { createdAt: "desc" },
              take: 3,
            },
          },
        },
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    let activeConversation = null;
    if (conversationId) {
      activeConversation = conversations.find((c) => c.id === conversationId) || null;
    } else if (conversations.length > 0) {
      activeConversation = conversations[0];
    }

    return NextResponse.json({
      conversations,
      activeConversation,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Inbox GET error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { conversationId, content, sender = "HUMAN" } = body;

    if (!conversationId || !content) {
      return NextResponse.json({ error: "Conversation ID and content required" }, { status: 400 });
    }

    const conv = await prisma.conversation.findFirst({
      where: { id: conversationId, businessId },
      include: { customer: true },
    });

    if (!conv) {
      return NextResponse.json({ error: "Conversation not found or access denied" }, { status: 404 });
    }

    // Save human/merchant message
    const message = await prisma.message.create({
      data: {
        conversationId,
        sender,
        content: content.trim(),
        timestamp: new Date(),
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content.trim(),
        lastMessageAt: new Date(),
      },
    });

    // If sender was CUSTOMER and conversation is in AI_MODE, trigger AI auto-reply
    let aiResponse = null;
    if (sender === "CUSTOMER" && conv.mode === "AI_MODE") {
      aiResponse = await processSalesConversation(
        businessId,
        content,
        conv.customerName,
        conv.customerPhone
      );

      await prisma.message.create({
        data: {
          conversationId,
          sender: "AI",
          content: aiResponse.reply,
          timestamp: new Date(Date.now() + 1000),
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: aiResponse.reply,
          lastMessageAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message, aiResponse });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Inbox POST error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { conversationId, mode, unreadCount } = body;

    const existing = await prisma.conversation.findFirst({
      where: { id: conversationId, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Conversation not found or access denied" }, { status: 404 });
    }

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(mode ? { mode } : {}),
        ...(unreadCount !== undefined ? { unreadCount } : {}),
      },
    });

    return NextResponse.json({ conversation: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Inbox PUT error:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
