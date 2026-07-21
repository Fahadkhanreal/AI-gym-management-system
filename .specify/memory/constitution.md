<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  SYNC IMPACT REPORT                                         ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  Version change: N/A → 1.0.0                                ║
  ║  Status: Initial constitution creation                      ║
  ║                                                              ║
  ║  Principles defined: 6 (from user's constitution)            ║
  ║  Sections added: Design System, Animation, Content           ║
  ║  Removed sections: N/A (fresh template)                     ║
  ║                                                              ║
  ║  Templates consistency check:                                ║
  ║   - spec-template.md       → ⚠ Pending (no changes needed)  ║
  ║   - plan-template.md       → ⚠ Pending (no changes needed)  ║
  ║   - tasks-template.md      → ⚠ Pending (no changes needed)  ║
  ║   - phr-template.prompt.md → ⚠ Pending (no changes needed)  ║
  ║                                                              ║
  ║  No deferred placeholders.                                   ║
  ╚══════════════════════════════════════════════════════════════╝
-->

# NexusFit Constitution

> A world-class, cinematic, futuristic gym landing page that motivates visitors
> instantly and drives high membership conversion.

## Core Principles

### I. Premium-First Design

Every component MUST deliver an Apple / Stripe / Linear level of polish. The
visual identity fuses premium modern gym aesthetics with futuristic tech
(Cyber-fitness). Dark gradients, neon glows, glassmorphism, and subtle cosmic
energy are non-negotiable. Rationale: our target audience (18–45, tech-savvy,
quality-seeking) judges credibility by visual craft within seconds.

### II. Mobile-First Responsiveness

All sections MUST be designed mobile-first and be fully responsive across
every breakpoint. No desktop-first development — every layout, animation, and
interaction is authored for the smallest screen first, then progressively
enhanced. Rationale: the majority of our audience browses on mobile; a broken
mobile experience destroys conversion.

### III. Scroll-Driven Storytelling

The page experience MUST be organized around an exceptional scroll narrative.
Use Lenis for smooth scroll and Framer Motion for scroll-triggered entrance
animations. Section transitions, parallax effects, counter animations, and
infinite marquees are mandatory. Rationale: scroll is the primary interaction
on landing pages — every pixel scrolled should build motivation and trust.

### IV. Performance Obsession

The initial bundle MUST stay under 300 KB. Lighthouse performance score MUST
be ≥ 95. Largest Contentful Paint (LCP) MUST be under 2 seconds. All images
MUST use WebP format with lazy loading. No render-blocking resources are
allowed. Optimize 3D assets aggressively (if using React Three Fiber).
Rationale: performance is conversion — a 1-second delay drops conversion by 7%.

### V. Conversion-Centric Architecture

Every section, CTA, animation, and layout decision MUST serve the primary
conversion goal (membership signup, free trial, contact form). Trust signals
(member counts, years in business, awards) MUST be visible early. CTA buttons
MUST use magnetic hover effects and clear benefit-driven copy. The final CTA
MUST include location/map context. Rationale: the page exists to convert, not
to decorate.

### VI. Maintainability & Clean Code

All code MUST be written with long-term maintainability as a first-class
concern. Use Next.js 16 App Router conventions, TypeScript strict mode, and
Tailwind CSS utility classes consistently. Components MUST be composable,
sensibly named, and single-responsibility. Avoid premature abstraction
(YAGNI). Rationale: the page will be iterated on; clean code is the cheapest
insurance against technical debt.

## Design System & Aesthetic

**Color Palette:**
- Primary: Deep Black (#0A0A0A) with Electric Cyan (#00F0FF), Violet (#8B5CF6),
  and Orange (#FF6B35) accents
- Background: Dark gradient (#0A0A0A → #1A0A2E) with subtle cosmic/gym energy feel
- Accents: Neon glows, gradients, glassmorphism (backdrop-blur, semi-transparent)

**Typography:**
- Headings: `Space Grotesk` (primary) or `Clash Grotesk` (fallback)
- Body: `Inter` (primary) or `Satoshi` (fallback)

**Iconography:**
- Use Lucide Icons (consistent, lightweight, React-native)
- All icons MUST support hover glow/lift effects

**Overall Vibe:**
- Premium Modern Gym + Futuristic Tech (Cyber-fitness)

## Animation & Interaction Standards

**Mandatory (MUST have):**
- Lenis smooth scroll (applied globally)
- Scroll-triggered entrance animations via Framer Motion
- Glassmorphism cards with hover lift + glow
- Magnetic CTA buttons (cursor-follow + spring-back)
- 3D tilt on program/card elements
- Counter animations (member count, years, stats)
- Infinite marquee for testimonials
- Mouse-reactive parallax elements in hero section
- Scroll progress bar (nice-to-have but strongly recommended)

**Explicitly Excluded (not in scope for v1):**
- Custom cursor (nice-to-have, deferred)

## Content & Copy Strategy

- Headlines MUST be powerful, motivational, and benefit-driven
- Body copy MUST be short, scannable, and focused on outcomes
- Every section MUST have a primary CTA with clear action language
- Trust builders (members count, years of operation, awards) MUST appear
  within the first two scrolls
- Testimonials MUST use real-sounding quotes with attribution

## Governance

1. **Supremacy**: This constitution supersedes all ad-hoc practices. Every
   spec, plan, task, and PR MUST be verified against these principles.

2. **Amendment Process**: Amendments MUST be documented with rationale, the
   affected principle/section, and a migration plan. MAJOR version bumps
   require the same approval as the original.

3. **Versioning**: Follows SemVer (MAJOR.MINOR.PATCH):
   - MAJOR: Backward-incompatible principle removals or redefinitions
   - MINOR: New principle/section added or materially expanded guidance
   - PATCH: Clarifications, wording, typo fixes, non-semantic refinements

4. **Compliance Review**: Every `/sp.plan` MUST include a "Constitution Check"
   gate. Every `/sp.checklist` MUST reference relevant constitutional
   principles. PRs that violate constitutional constraints MUST be rejected
   with an explanation.

5. **Runtime Guidance**: Development MUST follow the instructions in
   `CLAUDE.md` (project-level agent guidance) and this constitution. When
   conflict arises, constitution wins.

6. **Testing Discipline**: While this is a landing page (not a library), visual
   regression and responsive layout tests SHOULD be added for critical
   sections. Performance budgets (Lighthouse ≥ 95, LCP < 2s) MUST be verified
   before merge.

**Version**: 1.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08
