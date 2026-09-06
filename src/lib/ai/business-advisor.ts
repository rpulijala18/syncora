import { prisma } from "../db";

export interface AdvisorAnswer {
  question: string;
  answer: string;
  metricHighlight?: string;
  dataPoints?: Array<{ label: string; value: string | number }>;
  suggestedAction?: string;
}

export async function askBusinessAdvisor(businessId: string, question: string): Promise<AdvisorAnswer> {
  const q = question.toLowerCase();

  // 1. Fetch live tenant metrics
  const [business, orders, products, customers, leads] = await Promise.all([
    prisma.business.findUnique({ where: { id: businessId } }),
    prisma.order.findMany({
      where: { businessId },
      include: { items: true, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { businessId },
    }),
    prisma.customer.findMany({
      where: { businessId },
      orderBy: { totalSpend: "desc" },
    }),
    prisma.lead.findMany({
      where: { businessId },
    }),
  ]);

  const curr = business?.currency === "USD" ? "$" : "₹";
  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const unpaidOrders = orders.filter((o) => o.paymentStatus === "PENDING");
  const lowStockItems = products.filter((p) => p.stock <= p.lowStockThreshold);

  // Calculate top-selling products by order item quantity
  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const o of orders) {
    for (const item of o.items) {
      if (!productSalesMap[item.productName]) {
        productSalesMap[item.productName] = { name: item.productName, units: 0, revenue: 0 };
      }
      productSalesMap[item.productName].units += item.quantity;
      productSalesMap[item.productName].revenue += item.totalPrice;
    }
  }
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.units - a.units);

  // Question: Best selling product
  if (q.includes("best") || q.includes("top") || q.includes("most")) {
    if (topProducts.length === 0) {
      return {
        question,
        answer: `You haven't recorded any product sales yet. As soon as orders are placed or closed via WhatsApp, your top-performing products will be ranked here.`,
        metricHighlight: "0 sales recorded",
        suggestedAction: "Add products to your catalog and share your WhatsApp link to drive your first order.",
      };
    }
    const best = topProducts[0];
    return {
      question,
      answer: `${best.name} is your #1 best-selling product! It has generated ${best.units} units sold totaling ${curr}${best.revenue.toLocaleString()} in sales.`,
      metricHighlight: `${best.name} (${best.units} units)`,
      dataPoints: topProducts.slice(0, 3).map((p) => ({
        label: p.name,
        value: `${p.units} units (${curr}${p.revenue.toLocaleString()})`,
      })),
      suggestedAction: `Consider featuring ${best.name} in your next WhatsApp broadcast campaign.`,
    };
  }

  // Question: Revenue / How much did I sell
  if (q.includes("how much") || q.includes("revenue") || q.includes("sell") || q.includes("sales")) {
    if (totalOrdersCount === 0) {
      return {
        question,
        answer: `Your store currently has ${curr}0 recorded sales across 0 orders. Ready to get started? Create your first test order or share your catalog on WhatsApp!`,
        metricHighlight: `${curr}0`,
        suggestedAction: "Create your first order or add your first customer to CRM.",
      };
    }

    return {
      question,
      answer: `Your total recorded revenue is ${curr}${totalRevenue.toLocaleString()} across ${totalOrdersCount} orders. You currently have ${unpaidOrders.length} pending/unpaid orders totaling ${curr}${unpaidOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}.`,
      metricHighlight: `${curr}${totalRevenue.toLocaleString()}`,
      dataPoints: [
        { label: "Total Revenue", value: `${curr}${totalRevenue.toLocaleString()}` },
        { label: "Total Orders", value: totalOrdersCount },
        {
          label: "Average Order Value",
          value: `${curr}${totalOrdersCount ? Math.round(totalRevenue / totalOrdersCount).toLocaleString() : 0}`,
        },
      ],
      suggestedAction: unpaidOrders.length > 0 ? "Send payment reminders for pending orders." : "Great job keeping payments settled!",
    };
  }

  // Question: Low stock
  if (q.includes("low") || q.includes("stock") || q.includes("inventory")) {
    if (products.length === 0) {
      return {
        question,
        answer: "You haven't added any products to your catalog yet.",
        metricHighlight: "0 products",
        suggestedAction: "Go to Products page to add items and set stock thresholds.",
      };
    }

    if (lowStockItems.length > 0) {
      const itemsList = lowStockItems.map((p) => `${p.name}: ${p.stock} units left (threshold: ${p.lowStockThreshold})`).join("; ");
      return {
        question,
        answer: `You have ${lowStockItems.length} product(s) running low on inventory: ${itemsList}. Reordering is recommended to prevent order cancellations.`,
        metricHighlight: `${lowStockItems.length} low-stock alerts`,
        dataPoints: lowStockItems.map((p) => ({ label: p.name, value: `${p.stock} units left` })),
        suggestedAction: "Restock low-stock products from the Products page.",
      };
    } else {
      return {
        question,
        answer: "All your catalog items have healthy stock levels above their safety thresholds.",
        metricHighlight: "All stock healthy",
      };
    }
  }

  // Question: Unpaid orders
  if (q.includes("unpaid") || q.includes("pending payment") || q.includes("due")) {
    const unpaidTotal = unpaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    if (unpaidOrders.length === 0) {
      return {
        question,
        answer: "You have 0 unpaid orders. All existing orders are fully paid!",
        metricHighlight: `${curr}0 Pending`,
      };
    }

    return {
      question,
      answer: `You have ${unpaidOrders.length} unpaid orders totaling ${curr}${unpaidTotal.toLocaleString()}.`,
      metricHighlight: `${curr}${unpaidTotal.toLocaleString()} Pending`,
      dataPoints: unpaidOrders.slice(0, 3).map((o) => ({
        label: `${o.orderNumber} (${o.customer?.name || "Customer"})`,
        value: `${curr}${o.totalAmount.toLocaleString()}`,
      })),
      suggestedAction: "Send WhatsApp payment link to pending customers.",
    };
  }

  // Question: Customers
  if (q.includes("customer") || q.includes("vip") || q.includes("who")) {
    if (customers.length === 0) {
      return {
        question,
        answer: "You don't have any customers in your CRM yet. Customers are added automatically when orders or inquiries come in.",
        metricHighlight: "0 Customers",
        suggestedAction: "Add your first customer in the Customer CRM module.",
      };
    }

    const topCustomer = customers[0];
    return {
      question,
      answer: `You have ${customers.length} registered customers. Your top customer by spend is ${topCustomer.name} with ${curr}${topCustomer.totalSpend.toLocaleString()} across ${topCustomer.totalOrders} orders.`,
      metricHighlight: `${topCustomer.name} (${curr}${topCustomer.totalSpend.toLocaleString()})`,
      dataPoints: customers.slice(0, 3).map((c) => ({
        label: c.name,
        value: `${curr}${c.totalSpend.toLocaleString()} (${c.totalOrders} orders)`,
      })),
    };
  }

  // Default snapshot
  return {
    question,
    answer: `Here is a snapshot of your store:\n• Total Revenue: ${curr}${totalRevenue.toLocaleString()}\n• Total Orders: ${totalOrdersCount}\n• Active Customers: ${customers.length}\n• Catalog Products: ${products.length}\n• Low Stock Alerts: ${lowStockItems.length}\n\nAsk me anything specific about your store's sales, inventory, or orders!`,
    metricHighlight: `${curr}${totalRevenue.toLocaleString()} Revenue`,
  };
}
