"use client";

import { useEffect, useState } from "react";
import {
  Dumbbell, Heart, Zap, Users, Target, Flame,
  Sparkles, ArrowRight, X, MessageCircle, type LucideIcon
} from "lucide-react";
import GlassPanel from "@/components/GlassPanel";
import HoverCard3D from "@/components/HoverCard3D";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useModal } from "@/components/ModalProvider";
import { useGym } from "@/lib/gym-context";
import OptimizedImage from "@/components/OptimizedImage";

const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell, Heart, Zap, Users, Target, Flame, Sparkles,
};

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  stat_value: number | null;
  stat_suffix: string | null;
}

function BenefitModal({
  item,
  onClose,
  openTrial,
}: {
  item: BenefitItem;
  onClose: () => void;
  openTrial: () => void;
}) {
  const { settings } = useGym();
  const IconComp = ICON_MAP[item.icon_name] || Sparkles;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg max-h-[70dvh] bg-surface/95 border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up flex flex-col">
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

          {/* Image */}
          {item.image_url && (
            <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 h-48 sm:h-56 overflow-hidden bg-surface rounded-t-2xl">
              <OptimizedImage src={item.image_url} alt={item.title} containerClassName="size-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
            </div>
          )}

          {/* Icon + Title + Stat */}
          <div className="flex items-start gap-4 mb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-pink/20 border border-cyan/20">
              <IconComp className="size-7 text-cyan" />
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                {item.title}
              </h3>
              {item.stat_value != null && (
                <p className="text-2xl sm:text-3xl font-bold text-cyan mt-1">
                  <AnimatedCounter target={item.stat_value} />
                  {item.stat_suffix || ""}
                </p>
              )}
            </div>
          </div>

          {/* Full description */}
          <div className="mb-8">
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => { openTrial(); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-cyan/80 text-black font-semibold px-6 py-3 text-sm hover:shadow-[0_0_30px_#00f5ff44] transition-colors"
            >
              Start Free Trial
              <ArrowRight className="size-4" />
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number || "923001234567"}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(settings.gym_name)}%20Gym`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm text-muted hover:text-foreground hover:border-cyan/40 hover:bg-cyan/5 transition-colors"
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Benefits() {
  const [items, setItems] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<BenefitItem | null>(null);
  const { openTrial } = useModal();

  useEffect(() => {
    fetch("/api/benefits")
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
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan mb-3 sm:mb-4">
            Why TitanForge
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Built For{" "}
            <span className="text-cyan">Greatness</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const IconComp = ICON_MAP[item.icon_name] || Sparkles;
            return (
              <div
                key={item.id}
                className={`animate-fade-in-up ${index > 0 ? `animate-fade-in-up-delay-${Math.min(index, 5)}` : ""}`}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-2xl card-press tap-splash transition-transform duration-300 ease-out hover:scale-[1.02]"
                >
                  <GlassPanel className="p-5 sm:p-8 h-full group hover:border-cyan/30 transition-colors duration-300">
                    {item.image_url && (
                      <div className="relative mb-4 -mx-5 -mt-5 sm:-mx-8 sm:-mt-8 overflow-hidden rounded-t-2xl bg-surface" style={{ height: "200px" }}>
                        <OptimizedImage src={item.image_url} alt={item.title} containerClassName="size-full" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors">
                        <IconComp size={20} className="sm:size-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.stat_value != null && (
                          <p className="text-xl sm:text-2xl font-bold text-cyan">
                            <AnimatedCounter target={item.stat_value} />
                            {item.stat_suffix || ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">{item.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs text-cyan/70 group-hover:text-cyan transition-colors">
                      Learn More <ArrowRight size={12} />
                    </div>
                  </GlassPanel>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <BenefitModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          openTrial={openTrial}
        />
      )}
    </section>
  );
}
