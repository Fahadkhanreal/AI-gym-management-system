"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Send, Mail, Phone, User, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

const SUBJECTS = [
  "General Inquiry",
  "Membership",
  "Personal Training",
  "Group Classes",
  "Corporate Inquiry",
  "Join Basic",
  "Join Warrior",
  "Join Titan",
];

export default function ContactModal({ isOpen, onClose, defaultSubject }: ContactModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject || "",
    message: "",
    preferred_time: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync defaultSubject when modal opens with a new plan
  useEffect(() => {
    if (isOpen && defaultSubject) {
      setForm(f => ({ ...f, subject: defaultSubject }));
    }
  }, [isOpen, defaultSubject]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ name: "", email: "", phone: "", subject: "", message: "", preferred_time: "" });
    setDone(false);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg max-h-[calc(100dvh-32px)] overflow-y-auto rounded-2xl border border-white/10 bg-surface/95 shadow-2xl animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                {done ? "Message Sent! 🎉" : "Get In Touch"}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {done ? "We'll get back to you shortly" : "Fill the form and we'll reach out"}
              </p>
            </div>
            <button
              onClick={() => { onClose(); setTimeout(reset, 300); }}
              className="flex items-center justify-center size-8 rounded-xl bg-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {done ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="size-8 text-green-400" />
              </div>
              <p className="text-sm text-muted max-w-sm mx-auto">
                Thank you! Our team will contact you soon. You can also message us directly on WhatsApp.
              </p>
              <button
                onClick={() => { onClose(); setTimeout(reset, 300); }}
                className="mt-6 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Full Name *</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/50" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                  />
                </div>
              </div>

              {/* Phone + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Phone *</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/50" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/50" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-surface">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s} className="bg-surface">{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Message *</label>
                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3 top-3 size-4 text-muted/50" />
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    required
                    rows={4}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Preferred Contact Time</label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted/50" />
                  <select
                    value={form.preferred_time}
                    onChange={e => setForm({ ...form, preferred_time: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-surface">Anytime</option>
                    <option value="morning" className="bg-surface">Morning (9AM-12PM)</option>
                    <option value="afternoon" className="bg-surface">Afternoon (12PM-5PM)</option>
                    <option value="evening" className="bg-surface">Evening (5PM-8PM)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-pink text-black font-semibold py-3 text-sm hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] disabled:opacity-50 transition-colors duration-300"
              >
                {submitting ? (
                  <span className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
