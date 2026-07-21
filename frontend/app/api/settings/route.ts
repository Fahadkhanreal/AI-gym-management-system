import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("gym_settings").select("*").limit(1).maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return empty object instead of error if no settings row yet
  return NextResponse.json(data ?? {});
}
