import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, phone, email, age, gender,
      fitness_goal, experience_level,
      preferred_time, days_per_week, consented,
    } = body;

    // Validate required
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
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
        age: age || null,
        gender: gender || null,
        fitness_goal: fitness_goal || null,
        experience_level: experience_level || null,
        preferred_time: preferred_time || null,
        days_per_week: days_per_week || null,
        consented: consented || false,
        source: "trial-signup",
        status: "new",
        message: `Free trial signup — Goal: ${fitness_goal || "N/A"}, Level: ${experience_level || "N/A"}, Time: ${preferred_time || "N/A"}`,
      })
      .select()
      .single();

    if (error) {
      console.error("Trial signup save error:", error);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    // Try email notifications
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const baseFrom = "TitanForge <onboarding@resend.dev>";

        // 1. Admin notification
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: baseFrom,
            to: process.env.ADMIN_EMAIL || "admin@titanforge.pk",
            subject: `Free Trial Signup: ${name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px;">
                <h2 style="color: #00f5ff;">New Free Trial Signup</h2>
                <table style="width:100%; border-collapse:collapse;">
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone}</td></tr>
                  ${email ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>` : ""}
                  ${age ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Age</td><td style="padding:8px;border-bottom:1px solid #eee;">${age}</td></tr>` : ""}
                  ${gender ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Gender</td><td style="padding:8px;border-bottom:1px solid #eee;">${gender}</td></tr>` : ""}
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Fitness Goal</td><td style="padding:8px;border-bottom:1px solid #eee;">${fitness_goal || "N/A"}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Experience</td><td style="padding:8px;border-bottom:1px solid #eee;">${experience_level || "N/A"}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Preferred Time</td><td style="padding:8px;border-bottom:1px solid #eee;">${preferred_time || "N/A"}</td></tr>
                  <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Days/Week</td><td style="padding:8px;border-bottom:1px solid #eee;">${days_per_week || "N/A"}</td></tr>
                </table>
              </div>
            `,
          }),
        });

        // 2. User confirmation (if email provided)
        if (email) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: baseFrom,
              to: email,
              subject: "Welcome to TitanForge — Free Trial Confirmed!",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #00f5ff;">Welcome to TitanForge, ${name}! 🏋️</h2>
                  <p style="color: #333; font-size: 16px; line-height: 1.5;">
                    Your 7-day free trial has been confirmed. Our team will reach out to you on <strong>${phone}</strong> to schedule your first session.
                  </p>
                  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 0 0 8px; font-weight: bold; color: #333;">Your Trial Details:</p>
                    <p style="margin: 4px 0; color: #555;">Goal: ${fitness_goal || "General Fitness"}</p>
                    <p style="margin: 4px 0; color: #555;">Level: ${experience_level || "All Levels"}</p>
                    <p style="margin: 4px 0; color: #555;">Preferred Time: ${preferred_time || "Flexible"}</p>
                    <p style="margin: 4px 0; color: #555;">Days/Week: ${days_per_week || "Flexible"}</p>
                  </div>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="color: #888; font-size: 14px;">
                    TitanForge Gym — Premium Fitness, Karachi<br/>
                    <a href="https://wa.me/923001234567" style="color: #00f5ff;">Chat on WhatsApp</a>
                  </p>
                </div>
              `,
            }),
          });
        }
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Welcome to TitanForge! We'll contact you to confirm your trial session.",
    });
  } catch (e) {
    console.error("Trial signup error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
