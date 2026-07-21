import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();

    // Clean empty time fields — PostgreSQL time type requires valid time or null, not ""
    const cleanBody = { ...body };
    if (cleanBody.opening_time === "") cleanBody.opening_time = null;
    if (cleanBody.closing_time === "") cleanBody.closing_time = null;

    // Get the first settings row id safely
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("gym_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Settings fetch error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      // First time — insert a row
      const { data, error: insertError } = await supabaseAdmin
        .from("gym_settings")
        .insert({ ...cleanBody })
        .select()
        .single();

      if (insertError) {
        console.error("Settings insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      return NextResponse.json(data);
    }

    // Update existing row
    const { data, error } = await supabaseAdmin
      .from("gym_settings")
      .update({ ...cleanBody, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Settings update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Settings PUT catch:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
