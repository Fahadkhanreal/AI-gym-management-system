import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

interface GreenAPIWebhookPayload {
  type?: string;
  body?: {
    messageData?: {
      textMessageData?: {
        textMessage?: string;
      };
    };
  };
  senderData?: {
    sender?: string;
    senderName?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: GreenAPIWebhookPayload = await request.json();

    // Extract message text and sender
    const messageText = payload?.body?.messageData?.textMessageData?.textMessage?.trim();
    const senderNumber = payload?.senderData?.sender;

    if (!messageText || !senderNumber) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // Save the incoming message
    const { data: savedMessage, error: saveError } = await supabaseAdmin
      .from("whatsapp_messages")
      .insert({
        from_number: senderNumber,
        message: messageText,
        webhook_raw: payload,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save WhatsApp message:", saveError);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    // Check for keyword-based auto-reply
    const { data: botResponses } = await supabaseAdmin
      .from("bot_responses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    let autoReplied = false;

    if (botResponses && botResponses.length > 0) {
      const lowerMessage = messageText.toLowerCase();

      for (const rule of botResponses) {
        const keywords: string[] = rule.keywords || [];
        const matched =
          rule.match_type === "all"
            ? keywords.every((kw) => lowerMessage.includes(kw.toLowerCase()))
            : keywords.some((kw) => lowerMessage.includes(kw.toLowerCase()));

        if (matched) {
          // Send auto-reply via Green API
          const result = await sendWhatsAppMessage(senderNumber, rule.response_text);

          if (result.success) {
            // Update message record with auto-reply info
            await supabaseAdmin
              .from("whatsapp_messages")
              .update({
                reply: rule.response_text,
                is_auto_replied: true,
                auto_reply_sent_at: new Date().toISOString(),
                status: "replied",
              })
              .eq("id", savedMessage.id);

            autoReplied = true;
          }

          break; // Only first matched rule
        }
      }
    }

    return NextResponse.json({
      success: true,
      auto_replied: autoReplied,
      message_id: savedMessage.id,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
