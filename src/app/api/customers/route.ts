import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const customers = await prisma.customer.findMany({
      where: {
        businessId,
        ...(status && status !== "ALL" ? { status } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
                { company: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Customers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { name, phone, email, company, tags, status, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Customer name and phone number are required" }, { status: 400 });
    }

    // Check Plan Limits
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { _count: { select: { customers: true } } },
    });

    const currentCount = business?._count.customers || 0;
    const plan = business?.plan || "FREE";

    if (plan === "FREE" && currentCount >= 50) {
      return NextResponse.json(
        {
          error: "You have reached your 50 customer limit on the Free plan. Please upgrade to Starter or Business for higher quotas.",
          limitReached: true,
        },
        { status: 403 }
      );
    } else if (plan === "STARTER" && currentCount >= 500) {
      return NextResponse.json(
        {
          error: "You have reached your 500 customer limit on the Starter plan. Please upgrade to Business for unlimited customers.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        businessId,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        company: company?.trim() || null,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags || "[]",
        status: status || "NEW",
        notes: notes?.trim() || null,
      },
    });

    // Log AI Action
    await prisma.aIActionLog.create({
      data: {
        businessId,
        actionType: "CUSTOMER_CREATED",
        description: `Customer "${customer.name}" (${customer.phone}) registered in CRM.`,
        entityType: "CUSTOMER",
        entityId: customer.id,
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Customer POST error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { id, name, phone, email, company, tags, status, notes } = body;

    if (!id) return NextResponse.json({ error: "Customer ID required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Customer not found or access denied" }, { status: 404 });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(email !== undefined ? { email: email?.trim() || null } : {}),
        ...(company !== undefined ? { company: company?.trim() || null } : {}),
        ...(tags !== undefined ? { tags: Array.isArray(tags) ? JSON.stringify(tags) : tags } : {}),
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
      },
    });

    return NextResponse.json({ customer });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Customer PUT error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Customer ID required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Customer not found or access denied" }, { status: 404 });
    }

    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Customer DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
