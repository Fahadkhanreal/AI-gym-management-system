"use client";
import { getToken } from "@/lib/session";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, CheckCircle, Archive, Send, Loader2 } from "lucide-react";

interface WhatsAppMessage {
  id: string;
  from_number: string;
  message: string;
  reply: string;
  status: string;
  is_read: boolean;
  is_auto_replied: boolean;
  created_at: string;
}

export default function WhatsAppPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("received");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    fetchMessages();
  }, [router, filter]);

  const fetchMessages = async () => {
    const token = getToken();
    const url = filter ? `/api/admin/whatsapp?status=${filter}` : "/api/admin/whatsapp";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const token = getToken();
    await fetch(`/api/admin/whatsapp/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_read: true }),
    });
    await fetchMessages();
  };

  const sendReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    const token = getToken();
    await fetch("/api/admin/whatsapp/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message_id: messageId, reply_text: replyText }),
    });
    setReplyText("");
    setReplyingTo(null);
    setSending(false);
    await fetchMessages();
  };

  if (loading) return <Spinner />;

  const filters = ["received", "replied", "archived"];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">WhatsApp Inbox</h1>
        <p className="text-sm text-muted mt-1">Manage incoming messages and send replies</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              filter === f
                ? "bg-cyan/10 text-cyan border border-cyan/20"
                : "bg-white/5 text-muted border border-white/5 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="glass rounded-2xl p-10 border border-white/5 text-center">
          <MessageCircle className="size-10 text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-muted">No {filter} messages</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`glass rounded-2xl p-4 border transition-all ${
                !msg.is_read ? "border-cyan/20 bg-cyan/[0.02]" : "border-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-8 rounded-full bg-pink/10 text-pink">
                    <MessageCircle className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{msg.from_number}</p>
                    <p className="text-[10px] text-muted/50">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!msg.is_read && (
                    <button onClick={() => markAsRead(msg.id)} className="icon-btn text-cyan" title="Mark as read">
                      <CheckCircle className="size-4" />
                    </button>
                  )}
                  {msg.is_auto_replied && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan">Auto</span>
                  )}
                </div>
              </div>

              <div className="ml-10">
                <div className="rounded-xl bg-white/5 p-3 mb-2">
                  <p className="text-sm text-foreground">{msg.message}</p>
                </div>

                {msg.reply && (
                  <div className="rounded-xl bg-cyan/5 border border-cyan/10 p-3 mb-2">
                    <p className="text-xs text-muted mb-1">Your reply:</p>
                    <p className="text-sm text-cyan">{msg.reply}</p>
                  </div>
                )}

                {replyingTo === msg.id ? (
                  <div className="flex items-start gap-2 mt-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={2}
                      className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-cyan/50 resize-none"
                    />
                    <div className="flex flex-col gap-1">
                      <button onClick={() => sendReply(msg.id)} disabled={sending} className="flex items-center justify-center size-9 rounded-xl bg-cyan text-black disabled:opacity-50">
                        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                      </button>
                      <button onClick={() => setReplyingTo(null)} className="flex items-center justify-center size-9 rounded-xl text-muted hover:text-foreground bg-white/5">
                        <Archive className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  !msg.reply && (
                    <button
                      onClick={() => setReplyingTo(msg.id)}
                      className="flex items-center gap-2 text-xs text-cyan hover:text-cyan/80 transition-colors mt-1"
                    >
                      <Send className="size-3.5" /> Reply
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin" /></div>;
}


