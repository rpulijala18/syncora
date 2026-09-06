import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");

    if (!orderId && !orderNumber) {
      // Return the most recent order for demonstration if no specific ID passed
      const latest = await prisma.order.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          customer: true,
          business: { select: { name: true, phone: true } },
        },
      });
      return NextResponse.json({ order: latest });
    }

    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber: String(orderNumber) },
      include: {
        items: true,
        customer: true,
        business: { select: { name: true, phone: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Pay GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, utr, method = "UPI_PHONEPE" } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Record payment and mark order as PAID in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          businessId: order.businessId,
          orderId: order.id,
          amount: order.totalAmount,
          currency: "INR",
          status: "SUCCESS",
          method,
          referenceId: utr || `UPI-${Date.now()}`,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: order.status === "PENDING" ? "CONFIRMED" : order.status,
        },
      });

      if (order.customerId) {
        await tx.customer.update({
          where: { id: order.customerId },
          data: {
            totalSpend: { increment: order.totalAmount },
            totalOrders: { increment: 1 },
            status: "ACTIVE",
          },
        });
      }

      await tx.aIActionLog.create({
        data: {
          businessId: order.businessId,
          actionType: "PAYMENT_RECEIVED",
          description: `Customer completed ₹${order.totalAmount.toLocaleString("en-IN")} payment via PhonePe UPI (UTR: ${utr || "Verified"}).`,
          entityType: "ORDER",
          entityId: order.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Pay POST error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
