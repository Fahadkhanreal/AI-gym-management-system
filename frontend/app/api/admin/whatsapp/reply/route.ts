import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await verifyAdminAuth(request.headers.get("Authorization"));
  if (!user) return unauthorizedResponse();

  try {
    const { message_id, reply_text } = await request.json();

    if (!message_id || !reply_text) {
      return NextResponse.json(
        { error: "message_id and reply_text are required" },
        { status: 400 },
      );
    }

    // Fetch the original message
    const { data: message, error: fetchError } = await supabaseAdmin
      .from("whatsapp_messages")
      .select("*")
      .eq("id", message_id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Send reply via Green API
    const result = await sendWhatsAppMessage(message.from_number, reply_text);

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
    }

    // Update message record
    const { error: updateError } = await supabaseAdmin
      .from("whatsapp_messages")
      .update({
        reply: reply_text,
        status: "replied",
        is_read: true,
        replied_at: new Date().toISOString(),
      })
      .eq("id", message_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp reply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
