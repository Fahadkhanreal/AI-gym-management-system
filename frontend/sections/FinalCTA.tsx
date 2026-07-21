"use client";

import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { useModal } from "@/components/ModalProvider";

export default function FinalCTA() {
  const { openTrial, openContact } = useModal();
  return (
    <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 overflow-hidden">
      {/* Subtle background gradient — starts black (matches FAQ), fades to blue, back to black (matches footer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#061020] to-background" />
      {/* Soft glow spot — clipped by overflow-hidden so it doesn't bleed into footer */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-cyan/8 blur-[60px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center animate-fade-in-up">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan mb-3 sm:mb-4">
          Start Today
        </p>
        <h2 className="font-heading text-3xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6">
          Ready to{" "}
          <span className="text-cyan">Forge</span>{" "}
          Your Legacy?
        </h2>
        <p className="text-sm sm:text-lg text-muted max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Join 5,000+ members who have already transformed their lives. Your first
          session is on us.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <MagneticButton size="lg" className="w-full sm:w-auto" onClick={openTrial}>
            Start Free Trial
            <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => openContact()}>
            Contact Us
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
