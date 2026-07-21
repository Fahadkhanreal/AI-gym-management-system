import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const { data, error } = await supabaseAdmin
    .from("api_settings")
    .select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const { provider, api_key, is_active } = await request.json();
    if (!provider || !api_key) {
      return NextResponse.json({ error: "Provider and API key are required" }, { status: 400 });
    }

    // Delete old entry first, then insert
    await supabaseAdmin.from("api_settings").delete().eq("provider", provider);

    const { data, error } = await supabaseAdmin
      .from("api_settings")
      .insert({ provider, api_key, is_active: is_active ?? true })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid request" }, { status: 400 });
  }
}
