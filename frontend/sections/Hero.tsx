"use client";

import { Play, MessageCircle } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { useGym } from "@/lib/gym-context";
import CountUp from "@/components/CountUp";

/**
 * Parse a stat string like "5,000+ Members" into { num: 5000, suffix: "+ Members" }
 */
function parseStat(stat: string): { num: number; suffix: string; raw: string } | null {
  if (!stat) return null;
  const match = stat.match(/^([\d,]+)(\+?)\s*(.*)/);
  if (!match) return null;
  const num = parseInt(match[1].replace(/,/g, ""), 10);
  const plus = match[2] || "";
  const text = match[3] || "";
  const suffix = plus + (text ? " " + text : "");
  return isNaN(num) ? null : { num, suffix, raw: stat };
}

export default function Hero() {
  const { settings } = useGym();

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const members = parseStat(settings.hero_stat_members);
  const years = parseStat(settings.hero_stat_years);
  const award = parseStat(settings.hero_stat_award);

  return (
    <section
      id="home"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* Background gradient — premium dark with visible purple/cyan tones */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#002040] via-[#0a0510] to-[#0a0a0a]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"

        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom gradient fade — smooth transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: "clamp(60px, 15vh, 120px)", background: "linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)" }}
      />

      {/* Content — pure CSS animation, no Framer Motion */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <p className="animate-fade-in-up mb-3 sm:mb-4 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan">
          Premium Fitness — Karachi
        </p>

        <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 font-heading text-[2.5rem] leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl">
          <span className="neon-glow-cyan">FORGE</span>{" "}
          <span className="block sm:inline">YOUR</span>{" "}
          <span className="neon-glow-pink">LEGACY</span>
        </h1>

        <p className="animate-fade-in-up animate-fade-in-up-delay-2 mt-4 sm:mt-6 text-base sm:text-lg text-muted sm:text-xl max-w-2xl mx-auto px-2">
          World-class training. Next-level results. Join the most premium gym in Karachi and transform your body, mind, and spirit.
        </p>

        <div className="animate-fade-in-up animate-fade-in-up-delay-3 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <MagneticButton variant="secondary" size="lg" className="w-full sm:w-auto">
            <Play size={18} />
            Watch The Experience
          </MagneticButton>
          <a
            href={`https://wa.me/${settings.whatsapp_number || "923001234567"}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(settings.gym_name)}%20Gym`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/20 text-foreground text-base font-semibold hover:border-[#25D366]/50 hover:text-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.15)] transition-all duration-300 w-full sm:w-auto active:scale-[0.97] btn-idle-pulse"
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Trust signals — with lightweight count-up animation */}
        <div className="animate-fade-in-up animate-fade-in-up-delay-4 mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted">
          {members && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
              <span className="text-cyan leading-none">◆</span>
              <CountUp value={members.num} suffix={members.suffix} />
            </span>
          )}
          {years && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
              <span className="text-cyan leading-none">◆</span>
              <CountUp value={years.num} suffix={years.suffix} />
            </span>
          )}
          {award ? (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
              <span className="text-cyan leading-none">◆</span>
              <CountUp value={award.num} suffix={award.suffix} />
            </span>
          ) : settings.hero_stat_award ? (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
              <span className="text-cyan leading-none">◆</span> {settings.hero_stat_award}
            </span>
          ) : null}
        </div>
      </div>

      {/* Scroll indicator — thin cyan line pulse */}
      <button
        onClick={scrollDown}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-full"
        aria-label="Scroll down"
      >
        <div className="w-16 h-[2px] bg-cyan/60 rounded-full scroll-indicator-line" />
      </button>
    </section>
  );
}
