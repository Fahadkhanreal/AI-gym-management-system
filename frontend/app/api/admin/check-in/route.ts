import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const { member_id } = await request.json();

    if (!member_id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    // Record check-in
    const { data, error } = await supabaseAdmin
      .from("check_ins")
      .insert({
        member_id,
        check_in_date: new Date().toISOString().split("T")[0],
        check_in_time: new Date().toTimeString().split(" ")[0],
      })
      .select()
      .single();

    if (error) throw error;

    // Update last_checkin on member
    await supabaseAdmin
      .from("members")
      .update({ last_checkin: new Date().toISOString() })
      .eq("id", member_id);

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("member_id");
  const date = searchParams.get("date");

  let query = supabaseAdmin.from("check_ins").select("*, members(name, member_id)");

  if (memberId) query = query.eq("member_id", memberId);
  if (date) query = query.eq("check_in_date", date);

  query = query.order("check_in_date", { ascending: false }).limit(50);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
