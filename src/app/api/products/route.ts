import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireBusinessTenant } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const products = await prisma.product.findMany({
      where: {
        businessId,
        ...(category && category !== "All" ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { sku: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId, user } = await requireBusinessTenant();
    const body = await req.json();

    const { name, sku, category, price, discountPrice, stock, lowStockThreshold, description, imageUrl } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }

    // Enforce Plan Limits
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { _count: { select: { products: true } } },
    });

    const currentCount = business?._count.products || 0;
    const plan = business?.plan || "FREE";

    if (plan === "FREE" && currentCount >= 20) {
      return NextResponse.json(
        {
          error: "You have reached the 20-product limit on the Free plan. Please upgrade to Starter or Business for unlimited catalog products.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const product = await prisma.product.create({
      data: {
        businessId,
        name: name.trim(),
        sku: sku?.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        category: category?.trim() || "General",
        price: parseFloat(price) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10) || 0,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
        description: description?.trim() || "",
        imageUrl: imageUrl?.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        status: "ACTIVE",
      },
    });

    // Log AI Action
    await prisma.aIActionLog.create({
      data: {
        businessId,
        actionType: "PRODUCT_CREATED",
        description: `Product "${product.name}" added to catalog with stock ${product.stock}.`,
        entityType: "PRODUCT",
        entityId: product.id,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const body = await req.json();
    const { id, name, sku, category, price, discountPrice, stock, lowStockThreshold, description, imageUrl, status } = body;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Verify ownership
    const existing = await prisma.product.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(sku ? { sku: sku.trim() } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(price !== undefined ? { price: parseFloat(price) } : {}),
        ...(discountPrice !== undefined ? { discountPrice: discountPrice ? parseFloat(discountPrice) : null } : {}),
        ...(stock !== undefined ? { stock: parseInt(stock, 10) } : {}),
        ...(lowStockThreshold !== undefined ? { lowStockThreshold: parseInt(lowStockThreshold, 10) } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl.trim() } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Product PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { businessId } = await requireBusinessTenant();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Verify tenant ownership
    const existing = await prisma.product.findFirst({
      where: { id, businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
