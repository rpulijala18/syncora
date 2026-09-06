import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("bizpilot_session");
  return NextResponse.json({ success: true });
}
