"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import GlassPanel from "@/components/GlassPanel";
import { useGym } from "@/lib/gym-context";
import OptimizedImage from "@/components/OptimizedImage";

interface TestimonialItem {
  id: string;
  name: string;
  message: string;
  image_url: string;
  rating: number;
}

function TestimonialCard({ t }: { t: TestimonialItem }) {
  return (
    <GlassPanel className="w-72 sm:w-80 shrink-0 p-4 sm:p-6 mx-2">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-surface-light flex items-center justify-center text-cyan text-xs sm:text-sm font-medium shrink-0 overflow-hidden">
          {t.image_url ? (
            <OptimizedImage src={t.image_url} alt={t.name} containerClassName="size-full" />
          ) : (
            t.name.split(" ").map((n) => n[0]).join("")
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-xs sm:text-sm text-foreground truncate">{t.name}</p>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-muted leading-relaxed">&ldquo;{t.message}&rdquo;</p>
      {t.rating && (
        <div className="mt-2 sm:mt-3 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={`sm:size-[14px] ${i < t.rating ? "fill-gold text-gold" : "text-muted/30"}`} />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

export default function Testimonials() {
  const { settings } = useGym();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => { setShowForm(false); setDone(false); setForm({ name: "", message: "", rating: 5 }); }, 3000);
      }
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return (
      <section id="testimonials" className="relative py-20 sm:py-24 lg:py-32">
        <div className="text-center">
          <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  const half = Math.ceil(items.length / 2);

  return (
    <section id="testimonials" className="relative py-20 sm:py-24 lg:py-32">
      <div className="text-center mb-12 sm:mb-16 px-4 sm:px-6 animate-fade-in-up">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan mb-3 sm:mb-4">
          Testimonials
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
          What Our{" "}
          <span className="text-gold">Members</span> Say
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <InfiniteMarquee direction="left" speed={40}>
          {items.slice(0, half).map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </InfiniteMarquee>
        <InfiniteMarquee direction="right" speed={35}>
          {items.slice(half).map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </InfiniteMarquee>
      </div>

      {/* Share Your Story Button */}
      <div className="text-center mt-10 sm:mt-12 px-4 animate-fade-in-up">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-muted hover:text-cyan hover:border-cyan/50 transition-colors hover:shadow-[0_0_20px_#00f5ff22]"
        >
          <MessageSquare className="size-4" />
          Share Your Story
        </button>
      </div>

      {/* Share Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/80" onClick={() => { if (!submitting) setShowForm(false); }} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-md max-h-[70dvh] overflow-y-auto rounded-2xl border border-white/10 bg-surface/95 shadow-2xl animate-fade-in-up">
            <div className="p-6">
              {done ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center size-14 rounded-full bg-green-500/10 mb-3">
                    <Send className="size-6 text-green-400" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground mb-1">Thank You! 🎉</h3>
                  <p className="text-xs text-muted">Your story has been submitted for review. It will appear here once approved.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1">Share Your Experience</h3>
                    <p className="text-xs text-muted">Tell us about your journey at {settings.gym_name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ahmed R."
                      required
                      maxLength={100}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="p-1">
                          <Star size={20} className={s <= form.rating ? "text-gold fill-gold" : "text-muted/30"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Your Story *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Share your transformation..."
                      required
                      maxLength={1000}
                      rows={3}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
                    <button
                      type="submit"
                      disabled={submitting || !form.name || !form.message}
                      className="flex items-center gap-2 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-colors"
                    >
                      {submitting ? <span className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin" /> : <Send className="size-4" />}
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
