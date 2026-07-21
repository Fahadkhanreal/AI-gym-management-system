# Research: TitanForge Gym Landing Page

**Phase**: 0 — Outline & Research
**Date**: 2026-07-08
**Branch**: `001-gym-landing-page`

## Overview

All technical choices for the TitanForge landing page were explicitly provided
in the user's spec. No NEEDS CLARIFICATION markers were present. This document
records the decisions, rationale, and alternatives considered for transparency.

---

## Technology Decisions

### Framework: Next.js 16 (App Router)

- **Decision**: Next.js 16 with App Router
- **Rationale**: Provides file-based routing (even for single-page apps the
  layout system gives hydration, metadata, font optimization out of the box),
  built-in image optimization via `next/image`, and is the constitutional tech
  stack. The App Router's server components allow shipping zero-JS for static
  content while keeping interactive sections (pricing toggle, FAQ accordion)
  as client components.
- **Alternatives considered**: Vite + React (would need additional libraries
  for routing, image optimization, metadata), plain HTML/CSS/JS (no component
  model, no DX tooling). Next.js wins on performance optimizations out of the
  box that directly support the constitutional Performance Obsession principle.

### Styling: Tailwind CSS

- **Decision**: Tailwind CSS (v4 — latest stable)
- **Rationale**: Utility-first CSS aligns with the constitution's
  Maintainability principle — no naming conventions to invent, no CSS
  specificity battles, and tree-shaking guarantees the smallest possible CSS
  bundle. Dark theme support via `dark:` variant is first-class. Glassmorphism
  (`backdrop-blur`, `bg-black/40` etc.) is trivially composable.
- **Alternatives considered**: Styled-components (runtime cost, bundle size
  impact), vanilla CSS (maintenance burden at scale), CSS Modules (less
  ergonomic for rapid prototyping).

### Animation: Framer Motion (Primary) + GSAP (Secondary)

- **Decision**: Framer Motion for scroll-triggered entrance animations + GSAP
  for complex scroll sequences (if needed)
- **Rationale**: Framer Motion is React-native, works with the component
  model, and its `useInView` + `motion.div` patterns cover 90% of scroll
  animation needs. GSAP is reserved for specific timeline-based scroll
  sequences (e.g., multi-step parallax) that are harder to express in Framer
  Motion's declarative API. Both co-exist without conflict.
- **Alternatives considered**: CSS-only animations (too limited for
  scroll-driven storytelling), AOS library (not maintained, no React
  integration). The dual approach is standard in premium landing page
  development.

### Smooth Scroll: Lenis

- **Decision**: Lenis for smooth scrolling
- **Rationale**: Lenis is the de facto standard for smooth scroll on React
  landing pages. It's lightweight (~5 KB gzipped), works with Framer Motion
  via a bridge, and provides easing control.
- **Alternatives considered**: Locomotive Scroll (heavier, less actively
  maintained), simple CSS `scroll-behavior: smooth` (insufficient for the
  cinematic feel required by the constitution).

### 3D: React Three Fiber + Drei

- **Decision**: @react-three/fiber + @react-three/drei for the hero 3D orb
- **Rationale**: R3F is the standard React binding for Three.js. Drei provides
  helper components (OrbitControls, Float, Environment, etc.) that reduce
  boilerplate. The constitutional requirement for a mouse-reactive 3D element
  in the hero makes this essential.
- **Alternatives considered**: Pure Three.js (no React integration, manual
  lifecycle management), CSS 3D transforms (insufficient for the floating
  energy orb effect). R3F is the clear choice.
- **Optimization**: The 3D scene will be lazy-loaded with `dynamic(() => import(...), { ssr: false })` to avoid blocking initial render and to stay under the 300 KB bundle budget.

### Icons: Lucide React

- **Decision**: Lucide React
- **Rationale**: Tree-shakeable, consistent design, ~12 KB for typical usage,
  first-class React support.
- **Alternatives considered**: Heroicons (good but fewer icons), Phosphor
  Icons (heavier bundle).

---

## Performance Strategy

### Bundle Budget

- **Initial JS**: < 300 KB total
- **3D (R3F)**: Lazy-loaded via dynamic import with `ssr: false`
- **Icons**: Imported individually so tree-shaking eliminates unused icons
- **Code-splitting**: One chunk per section group; critical path (hero +
  navbar) is in the initial bundle, all other sections are lazy-loaded as
  they scroll into view

### Image Optimization

- All raster images → WebP (using `next/image` which auto-converts)
- Lazy loading with `loading="lazy"` and `priority` on hero image only
- Blur-up placeholders via `placeholder="blur"` with `blurDataURL`

### Font Strategy

- Space Grotesk + Inter loaded via `next/font/google` (self-hosted, no
  external requests)
- `font-display: swap` for body, `font-display: optional` for headings

### 3D Lazy Loading

```typescript
const FloatingOrb = dynamic(() => import('@/components/3d/FloatingOrb'), {
  ssr: false,
  loading: () => <div className="hero-orb-skeleton" />,
})
```

---

## Responsive Strategy

- **Mobile-first**: All layouts authored as single-column first
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Navbar**: Hamburger menu at `md` and below
- **Grid sections**: 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)
- **Pricing**: Stacked cards (mobile) → side-by-side (desktop)
- **Touch targets**: All interactive elements ≥ 44×44 px

---

## Accessibility Baseline

- **Reduced motion**: Detect `prefers-reduced-motion`; disable all animations,
  fall back to static fade-in
- **Keyboard navigation**: All interactive elements focusable and activatable
  via Tab/Enter/Space with visible focus rings
- **Screen readers**: Descriptive alt text on all images; semantic heading
  hierarchy (h1 → h2 → h3); ARIA labels on interactive elements
- **Contrast**: All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
  against the dark background

---

## Browser Support

- Chrome 120+, Firefox 121+, Safari 17+, Edge 120+ (modern evergreen)
- Progressive enhancement: JS-disabled users see static HTML with all CTAs
  and content; they miss animations and the 3D orb
