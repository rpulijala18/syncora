import { prisma } from "../db";

export interface SalesAgentResponse {
  reply: string;
  actionTaken?: "CHECKED_STOCK" | "RECOMMENDED_PRODUCT" | "CREATED_ORDER" | "CAPTURED_LEAD" | "SENT_PAYMENT_LINK";
  orderDetails?: {
    orderNumber: string;
    totalAmount: number;
    productName: string;
  };
}

export async function processSalesConversation(
  businessId: string,
  userMessage: string,
  customerName: string = "Customer",
  customerPhone?: string
): Promise<SalesAgentResponse> {
  const normalizedMsg = userMessage.toLowerCase().trim();

  // 1. Fetch business and active product catalog strictly for this tenant
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      products: {
        where: { status: "ACTIVE" },
      },
    },
  });

  const products = business?.products || [];

  // If the store has no products listed yet
  if (products.length === 0) {
    return {
      reply: `Hello! 👋 Welcome to ${business?.name || "our store"}. Our online catalog is currently being loaded. Please leave your contact details or check back shortly!`,
      actionTaken: "RECOMMENDED_PRODUCT",
    };
  }

  // Check if customer wants to confirm/buy an order
  const isOrderIntent =
    normalizedMsg.includes("create order") ||
    normalizedMsg.includes("i want to buy") ||
    normalizedMsg.includes("buy this") ||
    normalizedMsg.includes("yes please") ||
    normalizedMsg.includes("i need size") ||
    (normalizedMsg === "yes" && !normalizedMsg.includes("no"));

  // Match against actual products in this tenant's catalog
  let matchedProduct = products.find((p) => {
    const pName = p.name.toLowerCase();
    const nameWords = pName.split(" ");
    return (
      normalizedMsg.includes(pName) ||
      nameWords.some((w) => w.length >= 3 && normalizedMsg.includes(w))
    );
  });

  // Check if customer asks for payment / QR scanner
  const isPayIntent =
    normalizedMsg.includes("pay") ||
    normalizedMsg.includes("qr") ||
    normalizedMsg.includes("scanner") ||
    normalizedMsg.includes("upi") ||
    normalizedMsg.includes("payment");

  if (isPayIntent && !isOrderIntent) {
    return {
      reply: `You can pay securely using our PhonePe UPI Scanner! 📲\n\n🔗 Open Payment Portal: http://localhost:3000/pay\n\nSupports PhonePe, Google Pay, Paytm, CRED, and BHIM.\n\nOnce paid, please reply with your 12-digit UTR reference number so our team can immediately verify and dispatch your order!`,
      actionTaken: "SENT_PAYMENT_LINK",
    };
  }

  // Handle Order Placement Intent
  if (isOrderIntent) {
    const targetProduct = matchedProduct || products[0];
    if (targetProduct && targetProduct.stock > 0) {
      // Find or create customer strictly for this tenant
      let customer = await prisma.customer.findFirst({
        where: {
          businessId,
          OR: [
            customerPhone ? { phone: customerPhone } : { name: customerName },
            { name: customerName },
          ],
        },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            businessId,
            name: customerName,
            phone: customerPhone || "+91 00000 00000",
            status: "NEW",
            tags: JSON.stringify(["WhatsApp Inbound", "AI Converted"]),
          },
        });
      }

      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const order = await prisma.$transaction(async (tx) => {
        // Decrease stock
        await tx.product.update({
          where: { id: targetProduct.id },
          data: {
            stock: { decrement: 1 },
          },
        });

        // Create order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            businessId,
            customerId: customer.id,
            totalAmount: targetProduct.price,
            paymentStatus: "PENDING",
            status: "CONFIRMED",
            shippingAddress: "Confirmed via WhatsApp chat",
            notes: "Automated AI Sales Agent order checkout.",
            items: {
              create: [
                {
                  productId: targetProduct.id,
                  productName: targetProduct.name,
                  sku: targetProduct.sku,
                  quantity: 1,
                  unitPrice: targetProduct.price,
                  totalPrice: targetProduct.price,
                },
              ],
            },
          },
        });

        // Update customer total spend
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpend: { increment: targetProduct.price },
            lastInteraction: new Date(),
          },
        });

        // Log AI action
        await tx.aIActionLog.create({
          data: {
            businessId,
            actionType: "CREATE_ORDER",
            description: `AI Assistant placed order #${orderNumber} for ${targetProduct.name} (${business?.currency || "INR"} ${targetProduct.price.toLocaleString()}) for ${customerName}`,
            entityType: "ORDER",
            entityId: newOrder.id,
          },
        });

        return newOrder;
      });

      const curr = business?.currency === "USD" ? "$" : "₹";
      return {
        reply: `🎉 Done! I've placed order #${order.orderNumber} for ${curr}${targetProduct.price.toLocaleString()}!\n\n🛍️ Item: 1x ${targetProduct.name}\n\n📲 Pay with PhonePe / UPI: http://localhost:3000/pay/${order.id}\n(Scan our PhonePe QR code to pay with PhonePe, GPay, Paytm, or BHIM)\n\nOnce paid, please reply with your 12-digit UPI UTR number so our team can immediately verify and dispatch your delivery!`,
        actionTaken: "CREATED_ORDER",
        orderDetails: {
          orderNumber: order.orderNumber,
          totalAmount: targetProduct.price,
          productName: targetProduct.name,
        },
      };
    } else if (targetProduct && targetProduct.stock <= 0) {
      return {
        reply: `I'm sorry, "${targetProduct.name}" is currently out of stock. Would you like to be notified when it arrives?`,
        actionTaken: "CHECKED_STOCK",
      };
    }
  }

  // Handle Catalog & Stock Queries for matched product
  if (matchedProduct) {
    const curr = business?.currency === "USD" ? "$" : "₹";
    if (matchedProduct.stock > 0) {
      return {
        reply: `Yes! We have "${matchedProduct.name}" available in stock (${matchedProduct.stock} units left).\n\n💰 Price: ${curr}${matchedProduct.price.toLocaleString()}${matchedProduct.discountPrice ? ` (Special price from ${curr}${matchedProduct.discountPrice})` : ""}\n\n${matchedProduct.description ? `${matchedProduct.description}\n\n` : ""}Would you like me to reserve one or create your order for delivery?`,
        actionTaken: "CHECKED_STOCK",
      };
    } else {
      return {
        reply: `Sorry, "${matchedProduct.name}" is currently out of stock. We expect more inventory soon. Can I take your contact to notify you as soon as it's back?`,
        actionTaken: "CHECKED_STOCK",
      };
    }
  }

  // Handle General Greetings & recommendations from tenant's real catalog
  if (normalizedMsg.includes("hello") || normalizedMsg.includes("hi") || normalizedMsg.includes("hey")) {
    const curr = business?.currency === "USD" ? "$" : "₹";
    const featured = products
      .slice(0, 3)
      .map((p) => `• ${p.name} — ${curr}${p.price.toLocaleString()}`)
      .join("\n");

    return {
      reply: `Hi there! 👋 Welcome to ${business?.name || "our store"}. I am your AI sales assistant.\n\nOur current featured items:\n${featured}\n\nWhat can I help you find today?`,
      actionTaken: "RECOMMENDED_PRODUCT",
    };
  }

  // Fallback with real catalog items
  const curr = business?.currency === "USD" ? "$" : "₹";
  const productList = products.map((p) => `${p.name} (${curr}${p.price.toLocaleString()})`).slice(0, 4).join(", ");
  return {
    reply: `I can help you with that! We currently have ${productList} in our store catalog. Let me know which item you're interested in, and I can check stock or place your order right away!`,
    actionTaken: "RECOMMENDED_PRODUCT",
  };
}
