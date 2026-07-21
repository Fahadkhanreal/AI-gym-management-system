import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, preferred_time } = body;

    // Validate required fields
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone, and message are required" },
        { status: 400 }
      );
    }

    // Save to leads table
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name,
        phone,
        email: email || null,
        message: `${subject ? `[${subject}] ` : ""}${message}`,
        source: "contact-form",
        status: "new",
        preferred_time: preferred_time || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Lead save error:", error);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    // Try to send email notifications via Resend (optional — doesn't block)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const baseFrom = "TitanForge <onboarding@resend.dev>";

        // 1. Admin notification
        const adminHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00f5ff;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              ${email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>` : ""}
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>
              ${subject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>` : ""}
              ${preferred_time ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${preferred_time}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold;">Message:</p>
              <p style="margin: 8px 0 0;">${message}</p>
            </div>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: baseFrom,
            to: process.env.ADMIN_EMAIL || "admin@titanforge.pk",
            subject: `New Lead: ${name} — via Contact Form`,
            html: adminHtml,
          }),
        });

        // 2. User confirmation (if email provided)
        if (email) {
          const userHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00f5ff;">Thank You, ${name}! 🎉</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.5;">
                We've received your message and our team will get back to you within 24 hours.
              </p>
              <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 0; font-weight: bold; color: #333;">Your Message Summary:</p>
                <p style="margin: 8px 0 0; color: #555;">${message}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #888; font-size: 14px;">
                TitanForge Gym — Premium Fitness, Karachi<br/>
                <a href="https://wa.me/923001234567" style="color: #00f5ff;">Chat on WhatsApp</a>
              </p>
            </div>
          `;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: baseFrom,
              to: email,
              subject: "Thank You for Contacting TitanForge!",
              html: userHtml,
            }),
          });
        }
      }
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you soon.",
    });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
