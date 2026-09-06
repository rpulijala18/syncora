import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();

    const {
      businessName,
      businessType,
      country,
      currency,
      productName,
      productPrice,
      productStock,
      aiName,
      aiPersona,
      aiSystemRules,
    } = body;

    await prisma.$transaction(async (tx) => {
      // 1. Update Business Details
      await tx.business.update({
        where: { id: businessId },
        data: {
          name: businessName?.trim() || "My Store",
          type: businessType || "Retail & E-commerce",
          country: country || "India",
          currency: currency || "INR",
          onboardingCompleted: true,
          aiPersona: aiPersona?.trim() || `${aiName || "Aria"} is a dedicated sales advisor who recommends products and helps customers buy.`,
          aiSystemRules: aiSystemRules?.trim() || "1. Check stock before confirming.\n2. Be polite and concise.\n3. Offer draft order creation for quick checkout.",
        },
      });

      // 2. Add first product if provided
      if (productName?.trim() && productPrice) {
        await tx.product.create({
          data: {
            businessId,
            name: productName.trim(),
            sku: `SKU-${Date.now().toString().slice(-4)}`,
            category: "General",
            price: parseFloat(productPrice) || 0,
            stock: parseInt(productStock, 10) || 0,
            lowStockThreshold: 5,
            status: "ACTIVE",
          },
        });
      }

      // 3. Log initial AI action
      await tx.aIActionLog.create({
        data: {
          businessId,
          actionType: "WORKSPACE_INITIALIZED",
          description: `Store workspace "${businessName || "My Store"}" configured and ready.`,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
