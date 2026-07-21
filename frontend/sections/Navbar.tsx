"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Home,
  Dumbbell,
  Building2,
  Users,
  CreditCard,
  Mail,
} from "lucide-react";
import { navLinks } from "@/lib/constants";
import MagneticButton from "@/components/MagneticButton";
import { cn } from "@/lib/utils";

const linkIcons: Record<string, typeof Home> = {
  Home,
  Programs: Dumbbell,
  Facilities: Building2,
  Trainers: Users,
  Pricing: CreditCard,
  Contact: Mail,
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-12",
          isScrolled
            ? "glass-strong py-3 border-b border-white/5"
            : "bg-transparent py-4 sm:py-5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#home");
            }}
          >
            <span className="text-lg sm:text-xl font-bold font-heading tracking-tight">
              <span className="neon-glow-cyan">Titan</span>
              <span className="text-foreground group-hover:text-cyan transition-colors duration-300">Forge</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = linkIcons[link.label];
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                      isActive
                        ? "text-cyan"
                        : "text-muted hover:text-cyan",
                    )}
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        className={cn(
                          "transition-all duration-200",
                          isActive
                            ? "text-cyan"
                            : "text-muted/50 group-hover:text-cyan",
                        )}
                      />
                    )}
                    {link.label}
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-cyan shadow-[0_0_6px_#00f5ff]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <MagneticButton size="sm" onClick={() => scrollTo("#pricing")}>
              Free Trial
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </MagneticButton>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-lg p-1"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — CSS transition */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 sm:gap-8 bg-background/95 backdrop-blur-xl md:hidden transition-all duration-200",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        {navLinks.map((link) => {
          const Icon = linkIcons[link.label];
          const sectionId = link.href.replace("#", "");
          const isActive = activeSection === sectionId;
          return (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className={cn(
                "flex items-center gap-3 text-xl sm:text-2xl font-heading transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-lg px-4 py-2",
                isActive ? "text-cyan" : "text-foreground hover:text-cyan",
              )}
            >
              {Icon && <Icon size={20} />}
              {link.label}
            </button>
          );
        })}
        <div className="flex flex-col items-center gap-4 mt-4">
          <MagneticButton size="lg" onClick={() => scrollTo("#pricing")}>
            Start Free Trial
            <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </>
  );
}
