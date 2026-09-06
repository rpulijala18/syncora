import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET() {
  try {
    const { businessId } = await requireBusinessTenant();

    const [notifications, lowStockProducts] = await Promise.all([
      prisma.notification.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.product.findMany({
        where: {
          businessId,
          stock: { lte: 5 },
        },
        take: 3,
      }),
    ]);

    // Format any active stock alerts as dynamic notifications if not already present
    const dynamicAlerts = lowStockProducts.map((p) => ({
      id: `stock-${p.id}`,
      title: "Low Stock Alert",
      message: `${p.name} is down to ${p.stock} units!`,
      type: "WARNING",
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    const combined = [...dynamicAlerts, ...notifications];

    return NextResponse.json({
      notifications: combined,
      unreadCount: combined.filter((n) => !n.isRead).length,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();

    if (body.action === "mark_all_read") {
      await prisma.notification.updateMany({
        where: { businessId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (body.id && !body.id.startsWith("stock-")) {
      await prisma.notification.updateMany({
        where: { id: body.id, businessId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
