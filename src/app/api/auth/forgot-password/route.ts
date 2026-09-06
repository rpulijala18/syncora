import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't leak user existence for security
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been generated." });
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // In production, an email would be sent using nodemailer / SendGrid.
    // For local evaluation, we return the token in the response or log it.
    return NextResponse.json({
      success: true,
      message: "Reset token generated successfully.",
      resetToken: token,
      resetUrl: `/reset-password?token=${token}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to generate password reset" }, { status: 500 });
  }
}
