import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const search = searchParams.get("search") || "";

    const orders = await prisma.order.findMany({
      where: {
        businessId,
        ...(status && status !== "ALL" ? { status } : {}),
        ...(paymentStatus && paymentStatus !== "ALL" ? { paymentStatus } : {}),
        ...(search
          ? {
              OR: [
                { orderNumber: { contains: search } },
                { customer: { name: { contains: search } } },
                { customer: { phone: { contains: search } } },
              ],
            }
          : {}),
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();

    const {
      customerId,
      customerName,
      customerPhone,
      items,
      shippingAddress,
      paymentStatus = "PENDING",
      status = "CONFIRMED",
      notes,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
    }

    // Check Plan Limits (Free tier: max 50 orders)
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { _count: { select: { orders: true } } },
    });

    const currentOrdersCount = business?._count.orders || 0;
    if (business?.plan === "FREE" && currentOrdersCount >= 50) {
      return NextResponse.json(
        {
          error: "You have reached your 50 orders/month limit on the Free plan. Please upgrade to Starter or Business for unlimited orders.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // Execute atomic transaction: stock decrease + order creation + customer update
    const order = await prisma.$transaction(async (tx) => {
      // 1. Resolve Customer (must belong to this business)
      let resolvedCustomerId = customerId;
      if (resolvedCustomerId) {
        const cust = await tx.customer.findFirst({
          where: { id: resolvedCustomerId, businessId },
        });
        if (!cust) {
          throw new Error("Customer not found or belongs to another business");
        }
      } else if (customerName) {
        let existing = await tx.customer.findFirst({
          where: {
            businessId,
            OR: [
              customerPhone ? { phone: customerPhone } : { name: customerName },
              { name: customerName },
            ],
          },
        });
        if (!existing) {
          existing = await tx.customer.create({
            data: {
              businessId,
              name: customerName.trim(),
              phone: customerPhone?.trim() || "+91 00000 00000",
              status: "ACTIVE",
            },
          });
        }
        resolvedCustomerId = existing.id;
      }

      // 2. Fetch products and check stock (ensuring they belong to this business)
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, businessId },
        });

        if (!product) {
          throw new Error(`Product not found with id: ${item.productId}`);
        }

        const qty = parseInt(item.quantity, 10) || 1;
        if (product.stock < qty) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`);
        }

        const lineTotal = product.price * qty;
        totalAmount += lineTotal;

        // Decrease product inventory automatically!
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: qty },
          },
        });

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: qty,
          unitPrice: product.price,
          totalPrice: lineTotal,
        });
      }

      // 3. Create the Order
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          businessId,
          customerId: resolvedCustomerId,
          totalAmount,
          paymentStatus,
          status,
          shippingAddress: shippingAddress?.trim() || null,
          notes: notes?.trim() || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // 4. Update Customer stats
      if (resolvedCustomerId) {
        await tx.customer.update({
          where: { id: resolvedCustomerId },
          data: {
            totalOrders: { increment: 1 },
            totalSpend: { increment: totalAmount },
            lastInteraction: new Date(),
          },
        });
      }

      // 5. Create Payment record if Paid
      if (paymentStatus === "PAID") {
        await tx.payment.create({
          data: {
            businessId,
            orderId: newOrder.id,
            amount: totalAmount,
            status: "SUCCESS",
            method: "DIRECT",
          },
        });
      }

      // 6. Log AI Action
      await tx.aIActionLog.create({
        data: {
          businessId,
          actionType: "CREATE_ORDER",
          description: `Order #${orderNumber} placed for ₹${totalAmount.toLocaleString("en-IN")}. Inventory reduced.`,
          entityType: "ORDER",
          entityId: newOrder.id,
        },
      });

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { id, status, paymentStatus, shippingAddress, notes } = body;

    if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

    const existing = await prisma.order.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(shippingAddress !== undefined ? { shippingAddress: shippingAddress?.trim() || null } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
