import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const { data, error } = await supabaseAdmin
    .from("gym_settings")
    .select("sidebar_order")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ order: [] });
  }

  return NextResponse.json({ order: data?.sidebar_order || [] });
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { order } = body;

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "order must be an array" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("gym_settings")
      .update({ sidebar_order: order, updated_at: new Date().toISOString() })
      .eq("id", (await supabaseAdmin.from("gym_settings").select("id").limit(1).single()).data?.id);

    if (error) throw error;

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
