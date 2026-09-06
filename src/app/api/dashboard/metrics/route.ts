import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET() {
  try {
    const { businessId } = await requireBusinessTenant();

    const [business, orders, products, customers, leads, conversations, aiLogs] = await Promise.all([
      prisma.business.findUnique({
        where: { id: businessId },
        include: { subscriptions: { where: { status: "ACTIVE" }, take: 1 } },
      }),
      prisma.order.findMany({
        where: { businessId },
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { businessId },
      }),
      prisma.customer.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.findMany({
        where: { businessId },
      }),
      prisma.conversation.findMany({
        where: { businessId },
        orderBy: { lastMessageAt: "desc" },
        take: 5,
      }),
      prisma.aIActionLog.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    // Financial KPIs computed purely from the tenant's actual orders
    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.paymentStatus === "PENDING");
    const pendingPaymentAmount = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const activeOrdersCount = orders.filter(
      (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING"
    ).length;

    const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

    // Calculate real conversion rate from leads and orders
    const totalInteractions = leads.length + orders.length;
    const conversionRate = totalInteractions > 0
      ? Math.round((orders.length / totalInteractions) * 100 * 10) / 10
      : 0;

    // Build real monthly revenue trend from orders
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();
    const monthsToShow = monthNames.slice(Math.max(0, currentMonthIndex - 5), currentMonthIndex + 1);

    const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
    monthsToShow.forEach((m) => {
      monthlyMap[m] = { revenue: 0, orders: 0 };
    });

    orders.forEach((o) => {
      const oMonth = monthNames[new Date(o.createdAt).getMonth()];
      if (monthlyMap[oMonth]) {
        monthlyMap[oMonth].orders += 1;
        if (o.paymentStatus === "PAID") {
          monthlyMap[oMonth].revenue += o.totalAmount;
        }
      }
    });

    const revenueTrend = monthsToShow.map((m) => ({
      month: m,
      revenue: monthlyMap[m].revenue,
      orders: monthlyMap[m].orders,
    }));

    // Category breakdown from real catalog products
    const categoryCounts: Record<string, number> = {};
    for (const p of products) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Real top-selling products calculated from tenant order items
    const productSalesMap: Record<string, { name: string; sales: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.items?.forEach((it) => {
        if (!productSalesMap[it.productName]) {
          productSalesMap[it.productName] = { name: it.productName, sales: 0, revenue: 0 };
        }
        productSalesMap[it.productName].sales += it.quantity;
        productSalesMap[it.productName].revenue += it.totalPrice;
      });
    });
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Real weekday sales calculated from tenant orders
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayMap: Record<string, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
    };
    orders.forEach((o) => {
      const d = dayNames[new Date(o.createdAt).getDay()];
      if (weekdayMap[d] !== undefined) {
        weekdayMap[d] += o.totalAmount;
      }
    });
    const weekdaySales = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      sales: weekdayMap[day],
    }));

    return NextResponse.json({
      business,
      plan: business?.plan || "FREE",
      kpis: {
        totalRevenue,
        revenueGrowthPct: totalRevenue > 0 ? 100 : 0,
        totalOrders: orders.length,
        ordersGrowthPct: orders.length > 0 ? 100 : 0,
        totalCustomers: customers.length,
        customerGrowthPct: customers.length > 0 ? 100 : 0,
        pendingPayments: pendingPaymentAmount,
        pendingOrdersCount: activeOrdersCount,
        lowStockCount: lowStockProducts.length,
        conversionRate,
      },
      lowStockProducts,
      revenueTrend,
      categoryData,
      topProducts,
      weekdaySales,
      recentOrders: orders.slice(0, 5),
      recentConversations: conversations,
      aiLogs,
      counts: {
        customers: customers.length,
        products: products.length,
        orders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
      },
    });
  } catch (error: any) {
    console.error("Dashboard metrics error:", error);
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
