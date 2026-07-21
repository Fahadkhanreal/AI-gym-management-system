"use client";

import { ArrowRight, Dumbbell, Heart, Zap, Users, Target, Flame, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import HoverCard3D from "@/components/HoverCard3D";
import GlassPanel from "@/components/GlassPanel";
import OptimizedImage from "@/components/OptimizedImage";

const ICON_MAP: Record<string, any> = {
  Dumbbell, Heart, Zap, Users, Target, Flame,
  Armchair: Target, Run: Zap,
};

interface ProgramItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  icon_name: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}


export default function Programs() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollToPricing = useCallback(() => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch("/api/programs")
      .then(res => res.json())
      .then(data => {
        setPrograms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="programs" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan mb-3 sm:mb-4">
            Training Programs
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Choose Your{" "}
            <span className="text-pink">Path</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-cyan" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center text-muted py-20">
            <p>No programs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {programs.map((program) => {
              const IconComp = ICON_MAP[program.icon_name] || Dumbbell;
              return (
                <div
                  key={program.id}
                  className="animate-fade-in-up"
                >
                  <button
                    onClick={scrollToPricing}
                    className="w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-2xl card-press tap-splash transition-transform duration-300 ease-out hover:scale-[1.02]"
                  >
                    <GlassPanel className="overflow-hidden h-full group hover:border-cyan/30 transition-colors duration-300">
                      {/* Image area */}
                      <div className="relative overflow-hidden bg-surface" style={{ height: "200px" }}>
                        {program.image_url ? (
                          <OptimizedImage src={program.image_url} alt={program.title} containerClassName="size-full" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-cyan/20">
                            <IconComp size={36} className="sm:size-12" />
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComp size={16} className="sm:size-[18px] text-cyan shrink-0" />
                          <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                            {program.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-3 sm:mb-4">
                          {program.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {program.duration && (
                            <span className="rounded-full bg-white/5 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-muted">
                              {program.duration}
                            </span>
                          )}
                          {program.category && (
                            <span className="rounded-full bg-white/5 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-muted">
                              {program.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-cyan/70 group-hover:text-cyan transition-colors">
                          View Pricing <ArrowRight size={12} className="sm:size-[14px]" />
                        </div>
                      </div>
                    </GlassPanel>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
