"use client";

import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { footerSections } from "@/lib/constants";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/ModalProvider";
import { useGym } from "@/lib/gym-context";

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

export default function Footer() {
  const router = useRouter();
  const { settings: gymCtx } = useGym();
  const [settings, setSettings] = useState<any>(null);
  const { openContact } = useModal();

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data?.gym_name) setSettings(data); })
      .catch(() => {});
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleLinkClick = useCallback((href: string, label: string) => {
    if (href.startsWith("#") || href === "#") {
      const id = href === "#" ? "" : href.slice(1);
      if (id === "contact" || label === "Contact Us") {
        openContact();
        return;
      }
      if (id === "faq") { scrollTo("faq"); return; }
      if (id === "programs" || id === "pricing" || id === "home") {
        scrollTo(id);
        return;
      }
      openContact();
      return;
    }
    // Fallback: route to internal pages (/terms, /privacy)
    if (href) router.push(href);
  }, [scrollTo, openContact]);

  const address = settings?.address || "58-A, Block 6, PECHS, Shahrah-e-Faisal, Karachi";
  const phone = settings?.phone || "+92 300 1234567";
  const email = "hello@titanforge.pk";
  const gymName = settings?.gym_name || "TitanForge";

  return (
    <footer className="relative py-12 sm:py-16 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2 animate-fade-in-up">
            <span className="text-lg sm:text-xl font-bold font-heading">
              <span className="text-cyan">{gymName.split(" ")[0]}</span>
              <span className="text-foreground">{gymName.includes(" ") ? " " + gymName.split(" ").slice(1).join(" ") : ""}</span>
            </span>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted leading-relaxed max-w-xs">
              {settings?.tagline || "Premium gym in Karachi. World-class equipment, expert trainers, and an unbeatable community."}
            </p>

            {/* Contact */}
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted">
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin size={14} className="sm:size-4 mt-0.5 shrink-0 text-cyan" />
                <span className="break-words">{address}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone size={14} className="sm:size-4 shrink-0 text-cyan" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail size={14} className="sm:size-4 shrink-0 text-cyan" />
                <span className="break-all">{email}</span>
              </div>
            </div>

            {/* Social */}
            <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
              <a href={settings?.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded" aria-label="Instagram">
                <InstagramIcon size={18} className="sm:size-5" />
              </a>
              <a href={settings?.twitter_url || "#"} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded" aria-label="X (Twitter)">
                <XIcon size={18} className="sm:size-5" />
              </a>
              <a href={settings?.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded" aria-label="LinkedIn">
                <LinkedinIcon size={18} className="sm:size-5" />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="animate-fade-in-up">
              <h4 className="font-heading text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.label)}
                      className="text-xs sm:text-sm text-muted hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} {settings?.gym_name || "TitanForge"}. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded text-xs sm:text-xs">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded text-xs sm:text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
