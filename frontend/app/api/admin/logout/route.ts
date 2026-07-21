import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";
import { supabaseAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));

  if (!user) {
    return unauthorizedResponse();
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader!.slice(7);

  await supabaseAuth.auth.admin.signOut(token);

  return NextResponse.json({ success: true });
}
