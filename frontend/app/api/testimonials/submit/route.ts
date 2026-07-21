import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, rating } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    if (name.length > 100 || message.length > 1000) {
      return NextResponse.json({ error: "Name or message too long" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name,
        message,
        rating: rating || 5,
        is_active: false,
        is_approved: false,
        sort_order: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
