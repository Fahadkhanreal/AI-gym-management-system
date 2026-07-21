"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { useGym } from "@/lib/gym-context";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const { settings } = useGym();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: `👋 Hi! Welcome to ${settings.gym_name} Gym. Ask me anything about our gym, programs, pricing, or diet tips!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(() => setShowPrompt(false), 10000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, something went wrong. Please try again or WhatsApp us!" }]);
    }
    setLoading(false);
  };

  const suggestions = ["What are your timings?", "How much is membership?", "BMI kaise nikalein?", "Free trial?"];

  return (
    <>
      {/* Backdrop overlay when chat is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-200"
        />
      )}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
        {showPrompt && !isOpen && (
          <div className="bg-surface text-foreground text-xs font-medium px-4 py-2 rounded-2xl shadow-lg border border-white/10 backdrop-blur-xl transition-colors duration-200">
            💬 Ask me anything!
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="size-14 rounded-full bg-gradient-to-br from-cyan to-pink text-black shadow-[0_0_30px_rgba(0,245,255,0.3)] flex items-center justify-center hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] transition-shadow duration-200 hover:scale-110 active:scale-90"
          aria-label="Chat with us"
        >
          {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] max-h-[calc(100dvh-200px)] bg-surface/95 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-fade-in-up"
          style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
        >
          {/* Inner gradient backdrop for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan/[0.03] to-pink/[0.03] pointer-events-none" />

          {/* Header */}
          <div className="relative bg-gradient-to-r from-cyan/15 to-pink/15 px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-cyan to-pink flex items-center justify-center shadow-lg shrink-0">
              <Bot className="size-5 text-black" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">{settings.gym_name} AI</h3>
              <p className="text-[10px] text-muted/70">Ask me anything about the gym</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto size-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "user" ? "bg-pink/20" : "bg-cyan/20"
                }`}>
                  {msg.role === "user" ? <User className="size-3.5 text-pink" /> : <Bot className="size-3.5 text-cyan" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-pink/20 to-pink/10 text-foreground border border-pink/20"
                    : "bg-white/10 text-foreground/90 border border-white/5"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="size-7 rounded-full bg-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-3.5 text-cyan" />
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="relative px-4 pb-2">
              <p className="text-[10px] text-muted/50 mb-1.5">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-muted hover:text-foreground hover:bg-white/15 hover:border-cyan/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="relative p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 focus:bg-white/15 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="size-10 rounded-xl bg-gradient-to-br from-cyan to-pink text-black flex items-center justify-center disabled:opacity-30 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-colors shrink-0"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
