import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET() {
  try {
    const { businessId } = await requireBusinessTenant();
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        teamMembers: true,
        subscriptions: { where: { status: "ACTIVE" }, take: 1 },
      },
    });

    return NextResponse.json({ business });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Business GET error:", error);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();

    const {
      name,
      type,
      country,
      currency,
      phone,
      email,
      address,
      plan,
      aiPersona,
      aiSystemRules,
    } = body;

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(type ? { type: type.trim() } : {}),
        ...(country ? { country: country.trim() } : {}),
        ...(currency ? { currency: currency.trim() } : {}),
        ...(phone !== undefined ? { phone: phone?.trim() || null } : {}),
        ...(email !== undefined ? { email: email?.trim() || null } : {}),
        ...(address !== undefined ? { address: address?.trim() || null } : {}),
        ...(plan ? { plan } : {}),
        ...(aiPersona !== undefined ? { aiPersona: aiPersona?.trim() } : {}),
        ...(aiSystemRules !== undefined ? { aiSystemRules: aiSystemRules?.trim() } : {}),
      },
    });

    return NextResponse.json({ business: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Business PUT error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
