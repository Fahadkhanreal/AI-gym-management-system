---
id: 002
title: gym-landing-page-plan
stage: plan
date: 2026-07-08
surface: agent
model: oc/deepseek-v4-flash-free
feature: landing-page
branch: 001-gym-landing-page
user: Fahadkhanreal
command: /sp.plan
labels: ["plan", "architecture", "gym", "landing-page", "titanforge", "nextjs"]
links:
  spec: specs/001-gym-landing-page/spec.md
  plan: specs/001-gym-landing-page/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-gym-landing-page/plan.md
  - specs/001-gym-landing-page/research.md
  - specs/001-gym-landing-page/data-model.md
  - specs/001-gym-landing-page/quickstart.md
  - specs/001-gym-landing-page/contracts/README.md
tests:
  - null
---

## Prompt

# GYM LANDING PAGE - COMPLETE IMPLEMENTATION PLAN

**Project:** Premium Gym Landing Page (TitanForge / NexusFit)  
**Phase:** Implementation Planning  
**Methodology:** Panaversity Spec Kit Plus

---

## 1. Project Phases

| Phase | Name                        | Duration (Est.) | Status     |
|-------|-----------------------------|-----------------|------------|
| 1     | Constitution                | Done            | Completed  |
| 2     | Detailed Specifications     | Done            | Completed  |
| 3     | Implementation Plan         | Current         | In Progress|
| 4     | Development                 | 4-6 days        | Pending    |
| 5     | Testing & Optimization      | 1-2 days        | Pending    |
| 6     | Deployment                  | 1 day           | Pending    |

---

## 2. Tech Stack (Final)

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (Primary) + GSAP (Complex scroll)
- **Smooth Scroll:** Lenis
- **3D:** React Three Fiber + Drei
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod (future)

---

## 3. Component Breakdown & Folder Structure

### Root Structure
/app
/components
/ui          → Reusable buttons, cards, glass etc.
/hero
/programs
/facilities
/trainers
/pricing
/testimonials
/faq
/sections
/lib
/hooks
/assets
text### Main Components List

1. **Navbar** (`components/Navbar.tsx`)
2. **Hero Section** (`sections/Hero.tsx`) — with 3D Orb
3. **Benefits** (`sections/Benefits.tsx`)
4. **Programs** (`sections/Programs.tsx`)
5. **Transformations** (`sections/Transformations.tsx`)
6. **Facilities** (`sections/Facilities.tsx`)
7. **Trainers** (`sections/Trainers.tsx`)
8. **Pricing** (`sections/Pricing.tsx`)
9. **Testimonials** (`sections/Testimonials.tsx`)
10. **FAQ** (`sections/FAQ.tsx`)
11. **FinalCTA** (`sections/FinalCTA.tsx`)

---

## 4. Task Breakdown (Development Order)

### Phase 1: Setup (Day 1)
- Next.js 16 project create with TypeScript + Tailwind
- Install dependencies (Framer Motion, Lenis, @react-three/fiber, etc.)
- Configure fonts (Space Grotesk + Inter)
- Global CSS + Glassmorphism utilities
- Lenis smooth scroll setup

### Phase 2: Navbar + Hero (Day 1-2)
- Sticky glass navbar
- Hero section with 3D floating element
- Mouse interaction on 3D object
- Text reveal + CTA animations
- Responsive hero

### Phase 3: Core Sections (Day 2-4)
- Benefits Section (cards with hover tilt)
- Programs Grid
- Transformations / Results
- Facilities Showcase
- Trainers Cards
- Pricing Tiers (with toggle)
- Testimonials (Infinite Marquee)
- FAQ Accordion

### Phase 4: Polish & Micro-interactions (Day 4-5)
- Scroll triggered animations (Framer Motion)
- All hover effects
- Magnetic buttons
- Neon glows + gradients
- Scroll progress bar
- Final CTA section

### Phase 5: Performance & SEO (Day 5)
- Image optimization (next/image)
- Lazy loading for 3D and heavy sections
- Metadata + SEO
- Lighthouse optimization
- Mobile testing

### Phase 6: Content & Final Touches (Day 6)
- Real content integration
- Final color & branding adjustments
- Animation fine-tuning

---

## 5. Priority Features

**Must Have (MVP):**
- Smooth scroll (Lenis)
- Hero with 3D element
- All sections with scroll animations
- Responsive design
- Pricing plans
- Testimonials marquee

**Should Have:**
- 3D mouse reactive orb/dumbbell
- Magnetic CTAs
- Strong neon/glow aesthetics

---

## 6. Timeline Summary (Aggressive)

- **Day 1:** Project Setup + Navbar + Hero
- **Day 2:** Benefits + Programs + Facilities
- **Day 3:** Pricing + Testimonials + FAQ
- **Day 4:** Transformations + Trainers + Final CTA
- **Day 5:** Polish, Animations, Mobile fixes
- **Day 6:** Final review + Optimization

**Total Estimated Time:** 6 Days

## Response snapshot

Generated the full implementation plan for the TitanForge gym landing page.

**Constitution Check**: All 6 gates passed. No violations to justify.
- I. Premium-First Design ✅ — glassmorphism, neon, dark aesthetic in all components
- II. Mobile-First ✅ — all layouts authored for smallest viewport first
- III. Scroll-Driven Storytelling ✅ — Lenis + Framer Motion entrance animations confirmed
- IV. Performance Obsession ✅ — 300KB budget, lazy-loaded R3F, WebP + blur placeholders
- V. Conversion-Centric ✅ — 4+ CTA touch points, trust signals within first 2 scrolls
- VI. Maintainability ✅ — App Router, strict TypeScript, utility classes, single-responsibility components

**Phase 0 Artifacts**:
- `research.md` — Technology decisions and rationale for all stack choices; no NEEDS CLARIFICATION markers needed (user provided complete specs)
- Performance strategy: Lazy-loaded 3D, WebP via next/image, font-display swap
- Accessibility baseline: reduced-motion, keyboard nav, WCAG AA contrast, screen reader support

**Phase 1 Artifacts**:
- `data-model.md` — 8 entity types (MembershipTier, Program, Trainer, Testimonial, FAQItem, Benefit, NavLink, FooterSection); all in-memory in `lib/constants.ts`
- `contracts/README.md` — No API contracts (fully static frontend)
- `quickstart.md` — Setup commands, dev workflow, constitutional pre-commit gate checklist
- Agent context updated via `update-agent-context.ps1` → CLAUDE.md now includes the tech stack

**Structure Decision**: Standard Next.js 16 App Router with sections/ for page-level composition, components/ for reusable primitives, components/3d/ for R3F isolation.

**Stop point**: Phase 2 planning (tasks.md) is next — run `/sp.tasks`.

## Outcome

- ✅ Impact: Complete implementation plan with all Phase 0 + Phase 1 artifacts generated.
- 🧪 Tests: N/A (plan phase — no tests applicable)
- 📁 Files: `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/README.md`
- 🔁 Next prompts: `/sp.tasks` for detailed task breakdown, or begin coding
- 🧠 Reflection: The user's implementation plan was very detailed — the template required filling Technical Context + Structure Decision sections with concrete values. No NEEDS CLARIFICATION markers needed. The architecture is deliberately minimal (static frontend, no backend) which aligns with the constitutional mandate for simplicity.

## Evaluation notes (flywheel)

- Failure modes observed: None — user provided complete technical specs.
- Graders run and results (PASS/FAIL): Constitution Check gates pass (6/6).
- Prompt variant (if applicable): /sp.plan (standard)
- Next experiment (smallest change to try): Move to /sp.tasks for task breakdown with phases and parallel execution groups.
