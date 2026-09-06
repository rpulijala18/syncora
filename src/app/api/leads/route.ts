import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET() {
  try {
    const { businessId } = await requireBusinessTenant();
    const leads = await prisma.lead.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { name, phone, email, source, interestedProduct, stage, value, notes, nextFollowUp } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Lead name and phone are required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        businessId,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        source: source || "WhatsApp",
        interestedProduct: interestedProduct?.trim() || null,
        stage: stage || "NEW",
        value: parseFloat(value) || 0,
        notes: notes?.trim() || null,
        nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Lead POST error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { id, stage, value, notes, nextFollowUp } = body;

    if (!id) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

    const existing = await prisma.lead.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lead not found or access denied" }, { status: 404 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(stage ? { stage } : {}),
        ...(value !== undefined ? { value: parseFloat(value) } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
        ...(nextFollowUp !== undefined ? { nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null } : {}),
      },
    });

    return NextResponse.json({ lead });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Lead PUT error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
