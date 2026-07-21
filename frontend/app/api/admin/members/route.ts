import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  let query = supabaseAdmin.from("members").select("*").order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,member_id.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, phone, email, plan, membership_start, membership_end, fees_amount, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Check if member with same phone already exists — prevent duplicates
    const { data: existingMember } = await supabaseAdmin
      .from("members")
      .select("id, member_id, name")
      .eq("phone", phone)
      .maybeSingle();

    if (existingMember) {
      return NextResponse.json({
        error: `Member already exists: ${existingMember.name} (${existingMember.member_id})`,
        existing: existingMember,
      }, { status: 409 });
    }

    // Auto-generate member ID
    const { data: memberId } = await supabaseAdmin
      .rpc('generate_member_id');

    const memberIdResult = memberId || "TF-001";

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({
        member_id: memberIdResult,
        name,
        phone,
        email: email || "",
        plan: plan || "basic",
        membership_start: membership_start || new Date().toISOString().split("T")[0],
        membership_end,
        fees_paid: true,
        fees_amount: fees_amount || 0,
        status: "active",
        notes: notes || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
