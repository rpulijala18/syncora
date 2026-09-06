import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BizPilot AI database...");

  // Clean existing data
  await prisma.aIActionLog.deleteMany();
  await prisma.followUpOpportunity.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  // 1. Create Business
  const business = await prisma.business.create({
    data: {
      id: "biz_urbanstyle_01",
      name: "Urban Style Store",
      type: "Fashion & Footwear Retail",
      currency: "INR",
      phone: "+91 98765 43210",
      email: "hello@urbanstylestore.in",
      address: "104, Commercial Street, Bengaluru, Karnataka 560001",
      plan: "BUSINESS",
      aiPersona: "Savvy, helpful sales associate who specializes in styling advice, checking sizes, and closing orders quickly.",
      aiSystemRules:
        "1. Always check live inventory before answering size availability.\n2. Recommend matching products when appropriate.\n3. Offer draft order creation for quick checkout.\n4. Keep WhatsApp tone polite, modern, and concise with emoji highlights.",
    },
  });

  // 2. Create Merchant User
  const user = await prisma.user.create({
    data: {
      email: "owner@urbanstyle.com",
      passwordHash: "demo_password_hash",
      name: "Rohan Kapoor",
      role: "OWNER",
      businessId: business.id,
    },
  });

  // 3. Create Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        businessId: business.id,
        name: "Rohan Kapoor",
        email: "owner@urbanstyle.com",
        role: "OWNER",
        status: "ACTIVE",
      },
      {
        businessId: business.id,
        name: "Aakash Mehta",
        email: "aakash@urbanstyle.com",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        businessId: business.id,
        name: "Divya Nair",
        email: "divya@urbanstyle.com",
        role: "MEMBER",
        status: "ACTIVE",
      },
    ],
  });

  // 4. Create Products
  const p1 = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Black Runner Shoes",
      sku: "RUN-BLK-09",
      category: "Footwear",
      price: 2499,
      discountPrice: 2199,
      stock: 18,
      lowStockThreshold: 5,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      description: "High-performance lightweight running shoes available in sizes 8, 9, and 10 with responsive cushioning and breathable mesh.",
      status: "ACTIVE",
    },
  });

  const p2 = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Classic White Sneakers",
      sku: "SNK-WHT-01",
      category: "Footwear",
      price: 1999,
      discountPrice: 1799,
      stock: 24,
      lowStockThreshold: 6,
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
      description: "Minimalist sneakers crafted from premium vegan leather. Easy to clean, matches everything from denim to chinos.",
      status: "ACTIVE",
    },
  });

  const p3 = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Blue Denim Jacket",
      sku: "JKT-BLU-02",
      category: "Apparel",
      price: 3299,
      discountPrice: 2899,
      stock: 3, // LOW STOCK! Below threshold 6
      lowStockThreshold: 6,
      imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      description: "Vintage wash heavy-duty trucker jacket with brass hardware and comfortable relaxed fit.",
      status: "ACTIVE",
    },
  });

  const p4 = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Premium Cotton Hoodie",
      sku: "HD-BLK-04",
      category: "Apparel",
      price: 1899,
      discountPrice: 1599,
      stock: 12,
      lowStockThreshold: 5,
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
      description: "Ultra-cozy 380 GSM combed fleece hoodie with double-lined hood and sturdy metal eyelets.",
      status: "ACTIVE",
    },
  });

  const p5 = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Casual Crewneck T-Shirt",
      sku: "TEE-NVY-05",
      category: "Apparel",
      price: 799,
      discountPrice: 649,
      stock: 38,
      lowStockThreshold: 10,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      description: "Pre-shrunk 100% bio-washed organic cotton basic t-shirt in deep midnight navy.",
      status: "ACTIVE",
    },
  });

  // 5. Create Customers
  const c1 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Rahul Sharma",
      phone: "+91 98201 12345",
      email: "rahul.sharma@example.com",
      company: "Innovate Labs",
      tags: JSON.stringify(["VIP", "Footwear", "Size-9"]),
      status: "ACTIVE",
      totalOrders: 3,
      totalSpend: 7497,
      notes: "Loyal customer. Usually buys size 9 shoes. Inquired about black runners recently.",
    },
  });

  const c2 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Priya Reddy",
      phone: "+91 98450 67890",
      email: "priya.reddy@example.com",
      company: "Studio Pixel",
      tags: JSON.stringify(["VIP", "Apparel", "High-Spender"]),
      status: "VIP",
      totalOrders: 4,
      totalSpend: 11296,
      notes: "Prefers premium denim and hoodies. Fast responder on WhatsApp.",
    },
  });

  const c3 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Arjun Kumar",
      phone: "+91 97112 34567",
      email: "arjun.k@example.com",
      company: "Freelance",
      tags: JSON.stringify(["New", "WhatsApp Inbound"]),
      status: "NEW",
      totalOrders: 1,
      totalSpend: 2499,
      notes: "First order placed automatically through AI WhatsApp sales agent.",
    },
  });

  const c4 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Sneha Rao",
      phone: "+91 99001 23456",
      email: "sneha.rao@example.com",
      company: "Apex Media",
      tags: JSON.stringify(["Returning", "Casuals"]),
      status: "RETURNING",
      totalOrders: 2,
      totalSpend: 4298,
      notes: "Requested fast Bangalore courier delivery.",
    },
  });

  const c5 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Kiran Patel",
      phone: "+91 98980 98765",
      email: "kiran.patel@example.com",
      company: "Patel Logistics",
      tags: JSON.stringify(["Lead", "College Student"]),
      status: "LEAD",
      totalOrders: 0,
      totalSpend: 0,
      notes: "Looking for college sneaker deals. Ready to buy upon discount.",
    },
  });

  // 6. Create Orders
  await prisma.order.create({
    data: {
      orderNumber: "ORD-1082",
      businessId: business.id,
      customerId: c1.id,
      totalAmount: 2499,
      paymentStatus: "PAID",
      status: "DELIVERED",
      shippingAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      items: {
        create: [
          {
            productId: p1.id,
            productName: p1.name,
            sku: p1.sku,
            quantity: 1,
            unitPrice: p1.price,
            totalPrice: p1.price,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1083",
      businessId: business.id,
      customerId: c2.id,
      totalAmount: 3698,
      paymentStatus: "PAID",
      status: "PROCESSING",
      shippingAddress: "Villa 18, Palm Meadows, Whitefield, Bengaluru 560066",
      items: {
        create: [
          {
            productId: p3.id,
            productName: p3.name,
            sku: p3.sku,
            quantity: 1,
            unitPrice: p3.price,
            totalPrice: p3.price,
          },
          {
            productId: p5.id,
            productName: p5.name,
            sku: p5.sku,
            quantity: 1,
            unitPrice: 399,
            totalPrice: 399,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1084",
      businessId: business.id,
      customerId: c3.id,
      totalAmount: 2499,
      paymentStatus: "PAID",
      status: "SHIPPED",
      shippingAddress: "22, 5th Cross, Indiranagar, Bengaluru 560038",
      items: {
        create: [
          {
            productId: p1.id,
            productName: p1.name,
            sku: p1.sku,
            quantity: 1,
            unitPrice: p1.price,
            totalPrice: p1.price,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1085",
      businessId: business.id,
      customerId: c4.id,
      totalAmount: 1999,
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      shippingAddress: "Tower B, Salarpuria Sattva, Koramangala, Bengaluru 560095",
      items: {
        create: [
          {
            productId: p2.id,
            productName: p2.name,
            sku: p2.sku,
            quantity: 1,
            unitPrice: p2.price,
            totalPrice: p2.price,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-1086",
      businessId: business.id,
      customerId: c1.id,
      totalAmount: 1899,
      paymentStatus: "PENDING",
      status: "PENDING",
      shippingAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      items: {
        create: [
          {
            productId: p4.id,
            productName: p4.name,
            sku: p4.sku,
            quantity: 1,
            unitPrice: p4.price,
            totalPrice: p4.price,
          },
        ],
      },
    },
  });

  // 7. Create Conversations & Messages
  const conv1 = await prisma.conversation.create({
    data: {
      businessId: business.id,
      customerId: c1.id,
      customerName: c1.name,
      customerPhone: c1.phone,
      mode: "AI_MODE",
      unreadCount: 0,
      lastMessage: "Done! I've created your draft order #ORD-1082 for ₹2,499.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        sender: "CUSTOMER",
        content: "Do you have black shoes in size 9?",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        conversationId: conv1.id,
        sender: "AI",
        content: "Yes! We currently have Black Runner Shoes available in sizes 8, 9, and 10. The price is ₹2,499 (special discount from ₹2,799).",
        timestamp: new Date(Date.now() - 1000 * 60 * 19),
      },
      {
        conversationId: conv1.id,
        sender: "CUSTOMER",
        content: "Great, I need size 9. Please create the order.",
        timestamp: new Date(Date.now() - 1000 * 60 * 17),
      },
      {
        conversationId: conv1.id,
        sender: "AI",
        content: "Done! I've created your order #ORD-1082 for ₹2,499. Would you like me to send your payment link or deliver with Cash on Delivery?",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      businessId: business.id,
      customerId: c5.id,
      customerName: c5.name,
      customerPhone: c5.phone,
      mode: "AI_MODE",
      unreadCount: 1,
      lastMessage: "Do you offer any student discount on Classic White Sneakers?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 45),
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        sender: "CUSTOMER",
        content: "Hello! Looking for clean white sneakers for daily college wear.",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
      },
      {
        conversationId: conv2.id,
        sender: "AI",
        content: "Hello Kiran! Our Classic White Sneakers (₹1,999) are our top pick for college—water-resistant vegan leather and all-day cushioned sole.",
        timestamp: new Date(Date.now() - 1000 * 60 * 48),
      },
      {
        conversationId: conv2.id,
        sender: "CUSTOMER",
        content: "Do you offer any student discount on Classic White Sneakers?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
    ],
  });

  const conv3 = await prisma.conversation.create({
    data: {
      businessId: business.id,
      customerId: c4.id,
      customerName: c4.name,
      customerPhone: c4.phone,
      mode: "HUMAN_MODE",
      unreadCount: 0,
      lastMessage: "Yes Sneha, express delivery is dispatched and will arrive by tomorrow 2 PM!",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 120),
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv3.id,
        sender: "CUSTOMER",
        content: "Can you guarantee delivery to Koramangala before Friday?",
        timestamp: new Date(Date.now() - 1000 * 60 * 130),
      },
      {
        conversationId: conv3.id,
        sender: "HUMAN",
        content: "Yes Sneha, express delivery is dispatched and will arrive by tomorrow 2 PM!",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
      },
    ],
  });

  // 8. Create Leads
  await prisma.lead.createMany({
    data: [
      {
        businessId: business.id,
        name: "Vikram Malhotra",
        phone: "+91 99887 76655",
        source: "WhatsApp",
        interestedProduct: "Black Runner Shoes",
        stage: "INTERESTED",
        value: 2499,
        notes: "Inquired about size 10. Sent catalog link.",
      },
      {
        businessId: business.id,
        name: "Ananya Deshmukh",
        phone: "+91 98770 12344",
        source: "Instagram",
        interestedProduct: "Blue Denim Jacket",
        stage: "NEGOTIATION",
        value: 3299,
        notes: "Offered free shipping code. Awaiting confirmation.",
      },
      {
        businessId: business.id,
        name: "Rohan Varma",
        phone: "+91 97654 32190",
        source: "Website",
        interestedProduct: "Premium Cotton Hoodie",
        stage: "CONTACTED",
        value: 1899,
        notes: "Filled lead inquiry form on product landing page.",
      },
      {
        businessId: business.id,
        name: "Kiran Patel",
        phone: "+91 98980 98765",
        source: "WhatsApp",
        interestedProduct: "Classic White Sneakers",
        stage: "NEW",
        value: 1999,
        notes: "WhatsApp inbound conversation active with AI assistant.",
      },
      {
        businessId: business.id,
        name: "Sameer Joshi",
        phone: "+91 99123 45678",
        source: "Referral",
        interestedProduct: "Corporate Bulk T-Shirts",
        stage: "WON",
        value: 12500,
        notes: "Bulk team order closed successfully.",
      },
    ],
  });

  // 9. Create Follow-Up Opportunities
  await prisma.followUpOpportunity.createMany({
    data: [
      {
        businessId: business.id,
        customerId: c1.id,
        customerName: "Rahul Sharma",
        customerPhone: "+91 98201 12345",
        potentialValue: 2499,
        reason: "Customer asked about shoes 3 days ago but hasn't finalized size 9 order.",
        suggestedMessage:
          "Hi Rahul! Just checking if you'd still like the Black Runner Shoes in size 9. We currently have them in stock and can dispatch today!",
        status: "PENDING",
      },
      {
        businessId: business.id,
        customerName: "Ananya Deshmukh",
        customerPhone: "+91 98770 12344",
        potentialValue: 3299,
        reason: "Viewed Blue Denim Jacket. Only 3 units remain in stock.",
        suggestedMessage:
          "Hi Ananya! Notice you were looking at the Blue Denim Jacket. We are down to our last 3 units in stock! Would you like us to hold one for you?",
        status: "PENDING",
      },
    ],
  });

  // 10. AI Action Logs
  await prisma.aIActionLog.createMany({
    data: [
      {
        businessId: business.id,
        actionType: "AUTO_REPLY",
        description: "AI answered product sizing and stock inquiry for Rahul Sharma (+91 98201 12345)",
        entityType: "PRODUCT",
        entityId: p1.id,
      },
      {
        businessId: business.id,
        actionType: "CREATE_ORDER",
        description: "AI drafted order #ORD-1082 for ₹2,499 via WhatsApp conversation",
        entityType: "ORDER",
      },
      {
        businessId: business.id,
        actionType: "LOW_STOCK_ALERT",
        description: "Inventory alert: Blue Denim Jacket dropped to 3 units (threshold: 6)",
        entityType: "PRODUCT",
        entityId: p3.id,
      },
      {
        businessId: business.id,
        actionType: "FOLLOW_UP_TRIGGERED",
        description: "AI generated follow-up opportunity for Rahul Sharma (Black Runner Shoes)",
        entityType: "CUSTOMER",
        entityId: c1.id,
      },
    ],
  });

  console.log("Database seeded successfully with Urban Style Store demo data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
