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
import { useModal } from "./ModalProvider";
import { useGym } from "@/lib/gym-context";

const linkIcons: Record<string, typeof Home> = {
  Home,
  Programs: Dumbbell,
  Facilities: Building2,
  Trainers: Users,
  Pricing: CreditCard,
  Contact: Mail,
};

export default function Navbar() {
  const { settings } = useGym();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { openContact, openTrial } = useModal();

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        rafId = 0;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 px-6 lg:px-12",
          isScrolled
            ? "bg-black/80 py-3 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-5",
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
            <span className="text-xl font-bold font-heading tracking-tight">
              <span className="neon-glow-cyan">{settings.gym_name}</span>
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
                    onClick={() => link.label === "Contact" ? openContact() : scrollTo(link.href)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors duration-200 cursor-pointer group",
                      isActive
                        ? "text-cyan"
                        : "text-muted hover:text-cyan",
                    )}
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        className={cn(
                          "transition-colors duration-200",
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
            <MagneticButton size="sm" onClick={openTrial}>
              Free Trial
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </MagneticButton>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-foreground cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur-xl md:hidden transition-colors duration-200",
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
              onClick={() => link.label === "Contact" ? openContact() : scrollTo(link.href)}
              className={cn(
                "flex items-center gap-3 text-2xl font-heading transition-colors cursor-pointer",
                isActive ? "text-cyan" : "text-foreground hover:text-cyan",
              )}
            >
              {Icon && <Icon size={20} />}
              {link.label}
            </button>
          );
        })}
        <div className="flex flex-col items-center gap-4 mt-4">
          <MagneticButton size="lg" onClick={openTrial}>
            Start Free Trial
            <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </>
  );
}
