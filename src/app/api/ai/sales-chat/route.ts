import { NextRequest, NextResponse } from "next/server";
import { requireBusinessTenant } from "@/lib/auth";
import { processSalesConversation } from "@/lib/ai/sales-agent";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { message, customerName = "Test Buyer", customerPhone = "+91 98000 12345" } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await processSalesConversation(
      businessId,
      message,
      customerName,
      customerPhone
    );

    return NextResponse.json(response);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("AI Sales Chat error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
