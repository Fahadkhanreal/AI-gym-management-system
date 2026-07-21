import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Public: only return count of active members
    const { count, error } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (error) throw error;

    return NextResponse.json({ active_members: count || 0 });
  } catch {
    return NextResponse.json({ active_members: 0 });
  }
}
