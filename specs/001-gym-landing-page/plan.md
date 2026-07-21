# Implementation Plan: Premium Gym Landing Page — TitanForge

**Branch**: `001-gym-landing-page` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-gym-landing-page/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a cinematic, futuristic, premium single-page gym landing page (TitanForge)
that delivers an immersive scroll-driven experience with a 3D hero element,
interactive program/facility cards, pricing with billing toggle, testimonial
marquee, FAQ accordion, and multiple CTA touch points — all optimized for
Lighthouse ≥ 95 and a mobile-first responsive layout with zero backend.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22 LTS+, Next.js 16 (App Router)  
**Primary Dependencies**: React 19, Tailwind CSS 4, Framer Motion 11, Lenis, @react-three/fiber + @react-three/drei, Lucide React, GSAP (complex scroll sequences)  
**Storage**: N/A — fully static frontend; no database, no backend  
**Testing**: Manual visual regression review across 3 viewports (mobile/tablet/desktop) + Lighthouse CI for performance budgets  
**Target Platform**: Modern evergreen browsers (Chrome 120+, Firefox 121+, Safari 17+, Edge 120+) — desktop, tablet, and mobile  
**Project Type**: Web application — single-page frontend only (no backend)  
**Performance Goals**: LCP < 1.8s, Lighthouse Performance ≥ 95, CLS < 0.1, initial JS bundle < 300 KB  
**Constraints**: Must render core content (text/images/CTAs) without JavaScript; all interactive elements keyboard-navigable; reduced-motion fallback for animations  
**Scale/Scope**: Single landing page, 12 sections, zero external API dependencies, zero authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| **I. Premium-First Design** | All UI components must implement glassmorphism, neon glows/gradients, hover lift + glow, and a dark cyber-fitness aesthetic | ✅ Pass |
| **II. Mobile-First Responsiveness** | Mobile layout authored first; every section stacks correctly on smallest viewport; navbar collapses to hamburger | ✅ Pass |
| **III. Scroll-Driven Storytelling** | Lenis smooth scroll must be global; every section must have scroll-triggered entrance via Framer Motion | ✅ Pass |
| **IV. Performance Obsession** | Bundle < 300 KB; LCP < 1.8s; all images WebP + lazy-loaded; 3D lazy-loaded; no render-blocking resources | ✅ Pass |
| **V. Conversion-Centric Architecture** | ≥4 CTA touch points; trust signals visible within first 2 scrolls; magnetic hover on all CTA buttons | ✅ Pass |
| **VI. Maintainability & Clean Code** | TypeScript strict; single-responsibility components; Tailwind utility classes only; App Router conventions | ✅ Pass |

**Complexity Tracking**: None — no violations detected. A single-page landing page with zero backend is the simplest viable architecture.

## Project Structure

### Documentation (this feature)

```text
specs/001-gym-landing-page/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output — empty (no API endpoints)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # Root layout + fonts + metadata + Lenis provider
├── page.tsx             # Main landing page — composes all sections
├── globals.css          # Global styles + Tailwind + glassmorphism utilities
└── favicon.ico

components/
├── Navbar.tsx           # Sticky glass navbar with scroll blur
├── MagneticButton.tsx   # Reusable magnetic hover CTA
├── ScrollProgress.tsx   # Thin neon scroll progress bar
├── HoverCard3D.tsx      # Reusable 3D tilt card wrapper
├── InfiniteMarquee.tsx  # Auto-scrolling testimonial row
├── PricingToggle.tsx    # Monthly / Quarterly / Yearly toggle
├── Accordion.tsx        # FAQ accordion (single-open)
├── Counter.tsx          # Animated counter for stats
└── GlassPanel.tsx       # Reusable glassmorphism container

sections/
├── Hero.tsx             # Full-vp hero with 3D orb + text reveal
├── Benefits.tsx         # Why choose us — benefit cards grid
├── Programs.tsx         # Training program cards grid
├── Transformations.tsx  # Before/after comparison + success stories
├── Facilities.tsx       # Equipment gallery with hover zoom
├── Trainers.tsx         # Coach profiles
├── Pricing.tsx          # 3-tier pricing with toggle
├── Testimonials.tsx     # Infinite marquee (2 rows)
├── FAQ.tsx              # Accordion Q&A
├── FinalCTA.tsx         # Cinematic call-to-action
└── Footer.tsx           # Links, socials, map, copyright

components/3d/
├── FloatingOrb.tsx      # 3D energy orb with mouse tracking
└── Scene.tsx            # R3F Canvas wrapper with lighting

lib/
├── utils.ts             # Tailwind merge, clsx helpers
└── constants.ts         # Copy, program data, pricing, FAQs, testimonials

hooks/
├── useScrollProgress.ts # Scroll progress bar logic
├── useMousePosition.ts  # Mouse position for 3D + magnetic buttons
└── useLenis.ts           # Lenis smooth scroll instance

public/
├── images/
│   ├── hero-bg.webp     # Hero background fallback
│   ├── program-*.webp   # Program card images
│   ├── trainer-*.webp   # Trainer photos
│   ├── facility-*.webp  # Facility gallery images
│   └── testimonial-*.webp # Testimonial avatars
└── fonts/               # Space Grotesk + Inter (self-hosted optional)
```

**Structure Decision**: Standard Next.js 16 App Router layout with `app/` as the entry point. Sections live in `sections/` for page-level composition. Reusable primitives live in `components/`. 3D-specific components are isolated in `components/3d/`. Data/mock content lives in `lib/constants.ts`. This keeps the page composable (swap sections, add/remove without touching routing), aligns with the constitution's Maintainability & Clean Code principle, and mirrors the Next.js community convention.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected — architecture is a standard single-page frontend with no backend, database, or complex state management.
