"use client";

import { ChevronDown, Play, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import { useGym } from "@/lib/gym-context";

export default function Hero() {
  const { settings } = useGym();
  const [stats, setStats] = useState({ members: "", years: "", award: "" });

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data?.gym_name) {
          setStats({
            members: data.hero_stat_members || "5,000+ Members",
            years: data.hero_stat_years || "10+ Years",
            award: data.hero_stat_award || "Award-Winning",
          });
        }
      })
      .catch(() => {});
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* Background gradient — linear is GPU-friendly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001830] via-[#0a0a0a] to-background" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
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
          World-class training. Next-level results. Join the most premium gym in Karachi
          and transform your body, mind, and spirit.
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
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/20 text-foreground text-base font-semibold hover:border-[#25D366]/50 hover:text-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.15)] transition-all duration-300 w-full sm:w-auto active:scale-[0.97]"
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-in-up animate-fade-in-up-delay-4 mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-xs sm:text-sm text-muted">
          {stats.members && (
            <span className="flex items-center gap-2">
              <span className="text-cyan">◆</span> {stats.members}
            </span>
          )}
          {stats.years && (
            <span className="flex items-center gap-2">
              <span className="text-cyan">◆</span> {stats.years}
            </span>
          )}
          {stats.award && (
            <span className="flex items-center gap-2">
              <span className="text-cyan">◆</span> {stats.award}
            </span>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-cyan transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-full"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="scroll-indicator" />
      </button>
    </section>
  );
}
