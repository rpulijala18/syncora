import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessId: string | null;
  businessName: string | null;
  plan: string;
  onboardingCompleted: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("bizpilot_session")?.value;

    if (!sessionUserId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        business: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      businessId: user.businessId,
      businessName: user.business?.name || null,
      plan: user.business?.plan || "FREE",
      onboardingCompleted: user.business?.onboardingCompleted ?? false,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function requireAuthUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireBusinessTenant(): Promise<{ user: SessionUser; businessId: string }> {
  const user = await requireAuthUser();
  if (!user.businessId) {
    throw new Error("NO_BUSINESS");
  }
  return { user, businessId: user.businessId };
}
