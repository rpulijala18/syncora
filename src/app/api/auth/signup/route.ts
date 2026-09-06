import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, businessName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and initial business inside transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Business
      const business = await tx.business.create({
        data: {
          name: businessName?.trim() || `${name.trim()}'s Store`,
          plan: "FREE",
          onboardingCompleted: false,
        },
      });

      // 2. Create User as OWNER
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "OWNER",
          businessId: business.id,
        },
      });

      // 3. Create Team Member record for the owner
      await tx.teamMember.create({
        data: {
          businessId: business.id,
          name: name.trim(),
          email: normalizedEmail,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      // 4. Create Initial Subscription (FREE tier)
      const oneYearAhead = new Date();
      oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
      await tx.subscription.create({
        data: {
          businessId: business.id,
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: oneYearAhead,
        },
      });

      return { user, business };
    });

    // Set HTTP-only secure cookie
    const cookieStore = await cookies();
    cookieStore.set("bizpilot_session", result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          businessId: result.business.id,
          businessName: result.business.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user account" },
      { status: 500 }
    );
  }
}
