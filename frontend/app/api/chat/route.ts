import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Collect ALL knowledge from DB
    let contextParts: string[] = [];

    // Knowledge base (content field)
    const { data: knowledgeData } = await supabase
      .from("knowledge_base")
      .select("content")
      .eq("is_active", true);
    if (knowledgeData?.length) {
      contextParts.push(...knowledgeData.map((k: any) => k.content));
    }

    // FAQs
    const { data: faqData } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("is_active", true);
    if (faqData?.length) {
      contextParts.push("FAQs:\n" + faqData.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n"));
    }

    // Pricing plans
    const { data: pricingData } = await supabase
      .from("pricing_plans")
      .select("name, description, price_monthly, price_quarterly, price_yearly, features")
      .eq("is_active", true)
      .order("sort_order");
    if (pricingData?.length) {
      contextParts.push("Pricing Plans:\n" + pricingData.map((p: any) =>
        `${p.name}: ${p.description} — PKR ${p.price_monthly}/month, PKR ${p.price_quarterly}/quarter, PKR ${p.price_yearly}/year`
      ).join("\n"));
    }

    // Programs
    const { data: programsData } = await supabase
      .from("programs")
      .select("title, description, duration, price")
      .eq("is_active", true);
    if (programsData?.length) {
      contextParts.push("Programs:\n" + programsData.map((p: any) =>
        `${p.title}: ${p.description} (${p.duration || "N/A"})${p.price ? ` — PKR ${p.price}` : ""}`
      ).join("\n"));
    }

    // Gym settings
    const { data: settingsData } = await supabase
      .from("gym_settings")
      .select("*")
      .maybeSingle();
    if (settingsData) {
      const s = settingsData as any;
      contextParts.push(`Gym Info: ${s.gym_name || "TitanForge Gym"}${s.tagline ? ` — ${s.tagline}` : ""}${s.address ? `\nAddress: ${s.address}` : ""}${s.phone ? `\nPhone: ${s.phone}` : ""}${s.opening_time || s.closing_time ? `\nTimings: ${s.opening_time || "?"} to ${s.closing_time || "?"}` : ""}`);
    }

    const fullContext = contextParts.join("\n\n---\n\n");

    // 2. Get ALL active API keys
    const { data: apiSettings } = await supabaseAdmin
      .from("api_settings")
      .select("*")
      .eq("is_active", true);

    const systemPrompt = `You are an AI assistant for TitanForge Gym. Answer concisely and helpfully using the gym information below. If you don't know something, say you'll connect them via WhatsApp.

Gym Information:
${fullContext || "No specific gym info available. Be helpful and suggest contacting via WhatsApp."}`;

    // 3. Try each provider in priority order
    const providers = (apiSettings || []).filter(s => s.api_key);

    // Prioritize groq first
    providers.sort((a: any) => a.provider === "groq" ? -1 : 0);

    for (const setting of providers) {
      try {
        const provider = setting.provider?.toLowerCase();
        const key = setting.api_key;

        if (provider === "groq") {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
            }),
          });
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply, source: "ai" });
          continue;
        }

        if (provider === "gemini") {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }] }]
              }),
            }
          );
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return NextResponse.json({ reply, source: "ai" });
          continue;
        }

        if (provider === "openai") {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
            }),
          });
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply, source: "ai" });
          continue;
        }
      } catch {
        continue;
      }
    }

    // 4. Fallback
    return NextResponse.json({
      reply: "I'm not sure about that. Please contact us on WhatsApp and our team will help you out! 😊",
      source: "fallback"
    });

  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
