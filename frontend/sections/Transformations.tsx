"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X, TrendingUp, MessageCircle } from "lucide-react";
import { useGym } from "@/lib/gym-context";
import OptimizedImage from "@/components/OptimizedImage";

interface Transformation {
  id: string;
  name: string;
  before_value: string;
  after_value: string;
  duration: string;
  story: string;
  before_image_url: string;
  after_image_url: string;
  image_url?: string; // backward compat
}

function TransformationModal({ t, onClose }: { t: Transformation; onClose: () => void }) {
  const { settings } = useGym();
  const scrollToPricing = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("pricing");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-2xl max-h-[70dvh] bg-surface/95 border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up flex flex-col">
        {/* Sticky Close Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-end p-3 bg-surface/95 rounded-t-2xl border-b border-white/5 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center size-9 rounded-full bg-black/60 border border-white/15 text-foreground hover:text-cyan hover:bg-black/80 transition-colors shadow-lg"
            aria-label="Close"
          >
            <X className="size-[18px]" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 sm:p-8 pt-4">

          {/* Full-width before/after images */}
          <div className="flex h-48 sm:h-64 bg-surface rounded-2xl overflow-hidden -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6">
            {/* Before */}
            <div className="flex-1 relative overflow-hidden">
              {t.before_image_url ? (
                <div className="size-full">
                  <div className="absolute top-3 left-3 z-10 text-xs text-black/70 font-semibold bg-white/80 px-2.5 py-1 rounded-full bg-black/70">Before</div>
                  <OptimizedImage src={t.before_image_url} alt={`${t.name} before`} containerClassName="size-full" />
                </div>
              ) : (
                <div className="size-full flex items-center justify-center bg-gradient-to-br from-cyan/10 to-transparent">
                  <span className="text-xs text-muted absolute top-3 left-3">Before</span>
                  <span className="font-heading text-3xl sm:text-5xl font-bold text-muted">{t.before_value}</span>
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="w-1 shrink-0 bg-gradient-to-b from-cyan to-pink" />
            {/* After */}
            <div className="flex-1 relative overflow-hidden">
              {t.after_image_url ? (
                <div className="size-full">
                  <div className="absolute top-3 right-3 z-10 text-xs text-black/70 font-semibold bg-white/80 px-2.5 py-1 rounded-full bg-black/70">After</div>
                  <OptimizedImage src={t.after_image_url} alt={`${t.name} after`} containerClassName="size-full" />
                </div>
              ) : (
                <div className="size-full flex items-center justify-center bg-gradient-to-bl from-pink/10 to-transparent">
                  <span className="text-xs text-muted absolute top-3 right-3">After</span>
                  <span className="font-heading text-3xl sm:text-5xl font-bold text-cyan">{t.after_value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-5">
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Before</p>
              <p className="font-heading text-xl sm:text-2xl font-bold text-muted">{t.before_value}</p>
            </div>
            <TrendingUp className="size-5 sm:size-6 text-cyan" />
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">After</p>
              <p className="font-heading text-xl sm:text-2xl font-bold text-cyan">{t.after_value}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Duration</p>
              <p className="font-heading text-xl sm:text-2xl font-bold text-gold">{t.duration}</p>
            </div>
          </div>

          {/* Story */}
          <div className="mb-6 sm:mb-8 text-center">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2">{t.name}&rsquo;s Journey</h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">&ldquo;{t.story}&rdquo;</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToPricing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-pink text-black font-semibold px-8 py-3.5 text-sm hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-colors w-full sm:w-auto justify-center"
            >
              Start Your Transformation <ArrowRight className="size-4" />
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number || "923001234567"}?text=Hi!%20I%20saw%20this%20transformation%20at%20${encodeURIComponent(settings.gym_name)}%20and%20I%20want%20results%20too!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-sm text-muted hover:text-foreground hover:border-cyan/40 hover:bg-cyan/5 transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Transformations() {
  const [items, setItems] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transformation | null>(null);

  useEffect(() => {
    fetch("/api/transformations")
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-pink mb-3 sm:mb-4">
            Transformations
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Real{" "}
            <span className="text-pink">Results</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {selected && (
            <TransformationModal t={selected} onClose={() => setSelected(null)} />
          )}
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`animate-fade-in-up ${i > 0 ? `animate-fade-in-up-delay-${Math.min(i, 5)}` : ""} text-left w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-2xl card-press tap-splash transition-transform duration-300 ease-out hover:scale-[1.02]`}
            >
              {/* Before/After visual */}
              <div className="flex h-36 sm:h-48 bg-surface rounded-t-2xl overflow-hidden">
                {/* Before */}
                <div className="flex-1 relative overflow-hidden">
                  {t.before_image_url ? (
                    <div className="size-full">
                      <div className="absolute top-2 left-2 z-10 text-[10px] sm:text-xs text-black/70 font-semibold bg-white/80 px-2 py-0.5 rounded-full bg-black/70">Before</div>
                      <OptimizedImage src={t.before_image_url} alt={`${t.name} before`} containerClassName="size-full" />
                    </div>
                  ) : (
                    <div className="size-full flex items-center justify-center bg-gradient-to-br from-cyan/10 to-transparent">
                      <span className="text-[10px] sm:text-xs text-muted absolute top-2 left-2">Before</span>
                      <span className="font-heading text-xl sm:text-3xl font-bold text-muted">{t.before_value}</span>
                    </div>
                  )}
                </div>
                {/* Divider */}
                <div className="w-0.5 shrink-0 bg-gradient-to-b from-cyan to-pink relative z-10" />
                {/* After */}
                <div className="flex-1 relative overflow-hidden">
                  {t.after_image_url ? (
                    <div className="size-full">
                      <div className="absolute top-2 right-2 z-10 text-[10px] sm:text-xs text-black/70 font-semibold bg-white/80 px-2 py-0.5 rounded-full bg-black/70">After</div>
                      <OptimizedImage src={t.after_image_url} alt={`${t.name} after`} containerClassName="size-full" />
                    </div>
                  ) : (
                    <div className="size-full flex items-center justify-center bg-gradient-to-bl from-pink/10 to-transparent">
                      <span className="text-[10px] sm:text-xs text-muted absolute top-2 right-2">After</span>
                      <span className="font-heading text-xl sm:text-3xl font-bold text-cyan">{t.after_value}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-6 group">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground group-hover:text-cyan transition-colors">{t.name}</h3>
                  <span className="text-[10px] sm:text-xs text-gold">{t.duration}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">&ldquo;{t.story}&rdquo;</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
