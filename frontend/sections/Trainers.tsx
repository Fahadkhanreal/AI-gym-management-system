"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X, MessageCircle, Dumbbell } from "lucide-react";
import HoverCard3D from "@/components/HoverCard3D";
import GlassPanel from "@/components/GlassPanel";
import { useModal } from "@/components/ModalProvider";
import OptimizedImage from "@/components/OptimizedImage";

// Social SVG icons — removed from lucide-react in v1.23
function InstagramIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function LinkedinIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function XIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

const socialIcons: Record<string, React.FC<{size: number; className?: string}>> = {
  instagram: InstagramIcon,
  twitter: XIcon,
  linkedin: LinkedinIcon,
};

interface TrainerItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_instagram: string;
  social_twitter: string;
  social_linkedin: string;
}

function TrainerModal({ trainer, onClose, openTrial }: { trainer: TrainerItem; onClose: () => void; openTrial: () => void }) {
  const socialLinks = [
    trainer.social_instagram && { platform: "instagram" as const, url: trainer.social_instagram },
    trainer.social_twitter && { platform: "twitter" as const, url: trainer.social_twitter },
    trainer.social_linkedin && { platform: "linkedin" as const, url: trainer.social_linkedin },
  ].filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200" onClick={onClose} />
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
        <div className="overflow-y-auto p-6 sm:p-8 pt-4 text-center">

          {/* Large avatar */}
          <div className="relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-cyan/20">
            {trainer.image_url ? (
              <OptimizedImage src={trainer.image_url} alt={trainer.name} containerClassName="size-full" />
            ) : (
              <div className="size-full flex items-center justify-center bg-gradient-to-br from-cyan/20 to-pink/20">
                <span className="font-heading text-3xl font-bold text-cyan">
                  {trainer.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            )}
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-1">{trainer.name}</h3>
          <p className="text-sm text-cyan mb-4">{trainer.role}</p>
          <p className="text-sm text-muted leading-relaxed mb-6 max-w-md mx-auto">{trainer.bio}</p>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4 mb-6">
              {socialLinks.map((s: any) => {
                const Icon = socialIcons[s.platform];
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-muted hover:text-cyan hover:border-cyan/30 hover:bg-cyan/5 transition-colors"
                    aria-label={`${trainer.name} on ${s.platform}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center">
            <button
              onClick={() => { openTrial(); onClose(); }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-cyan/80 text-black font-semibold px-6 py-3 text-sm hover:shadow-[0_0_30px_#00f5ff44] transition-colors"
            >
              <Dumbbell className="size-4" /> Book Free Trial
            </button>
            <a
              href={`https://wa.me/923001234567?text=Hi!%20I'm%20interested%20in%20training%20with%20${encodeURIComponent(trainer.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm text-muted hover:text-foreground hover:border-cyan/40 hover:bg-cyan/5 transition-colors"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Trainers() {
  const [items, setItems] = useState<TrainerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerItem | null>(null);
  const { openTrial } = useModal();

  useEffect(() => {
    fetch("/api/trainers")
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="trainers" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <>
    <section id="trainers" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-gold mb-3 sm:mb-4">
            Meet The Team
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Elite{" "}
            <span className="text-gold">Coaches</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((trainer) => {
            const socialLinks = [
              trainer.social_instagram && { platform: "instagram" as const, url: trainer.social_instagram },
              trainer.social_twitter && { platform: "twitter" as const, url: trainer.social_twitter },
              trainer.social_linkedin && { platform: "linkedin" as const, url: trainer.social_linkedin },
            ].filter(Boolean);

            return (
              <button
                key={trainer.id}
                onClick={() => setSelectedTrainer(trainer)}
                className="animate-fade-in-up flex text-left w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-2xl card-press tap-splash transition-transform duration-300 ease-out hover:scale-[1.02]"
              >
                <GlassPanel className="p-5 sm:p-6 text-center h-full flex flex-col w-full group hover:border-cyan/30 transition-colors duration-300">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-3 sm:mb-4 h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden shrink-0">
                    {trainer.image_url ? (
                      <div className="size-full">
                        <OptimizedImage src={trainer.image_url} alt={trainer.name} containerClassName="size-full" />
                      </div>
                    ) : (
                      <span className="font-heading text-xl sm:text-2xl font-bold text-cyan">
                        {trainer.name.split(" ").map((n: string) => n[0]).join("")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground group-hover:text-cyan transition-colors">{trainer.name}</h3>
                  <p className="text-[10px] sm:text-xs text-cyan mt-1 mb-2 sm:mb-3">{trainer.role}</p>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed flex-1">{trainer.bio}</p>
                  <div className="mt-3 sm:mt-4 text-xs text-cyan/70 group-hover:text-cyan transition-colors shrink-0">
                    View Profile →
                  </div>
                </GlassPanel>
              </button>
            );
          })}
        </div>
      </div>
    </section>

      {/* Trainer Modal */}
      {selectedTrainer && (
        <TrainerModal
          trainer={selectedTrainer}
          onClose={() => setSelectedTrainer(null)}
          openTrial={openTrial}
        />
      )}
    </>
  );
}
