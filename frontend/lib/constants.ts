// ============================================================================
// Navigation & Footer Configuration (only items actively consumed in the app)
// Content data comes from Supabase APIs (not mock constants).
// ============================================================================

// ─── Nav ───────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Programs", href: "#programs" },
  { label: "Facilities", href: "#facilities" },
  { label: "Trainers", href: "#trainers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

// ─── Footer ────────────────────────────────────────────
export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    title: "Programs",
    links: [
      { label: "Strength Training", href: "#programs" },
      { label: "CrossFit", href: "#programs" },
      { label: "Hypertrophy", href: "#programs" },
      { label: "Mobility & Yoga", href: "#programs" },
      { label: "Women's Training", href: "#programs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#home" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
