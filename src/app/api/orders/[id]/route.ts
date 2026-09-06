import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, businessId },
      include: {
        customer: true,
        items: true,
        business: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
