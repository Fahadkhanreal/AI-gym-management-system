import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("gym_settings")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", (await supabaseAdmin.from("gym_settings").select("id").limit(1).single()).data?.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
