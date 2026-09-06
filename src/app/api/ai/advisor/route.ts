import { NextRequest, NextResponse } from "next/server";
import { requireBusinessTenant } from "@/lib/auth";
import { askBusinessAdvisor } from "@/lib/ai/business-advisor";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const answer = await askBusinessAdvisor(businessId, question);
    return NextResponse.json(answer);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Advisor error:", error);
    return NextResponse.json({ error: "Failed to query advisor" }, { status: 500 });
  }
}
