# Quickstart: TitanForge Gym Landing Page

**Phase**: 1 — Development Setup
**Branch**: `001-gym-landing-page`

## Prerequisites

- Node.js 22 LTS+
- npm 10+ (or pnpm 9+ / yarn 4+)
- Git

## Setup

```bash
# 1. Navigate to project root
cd D:\Governor Sindh It Initiative\code\landing-page-2

# 2. Create Next.js 16 project (if not already created)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# 3. Install dependencies
npm install framer-motion lenis @react-three/fiber @react-three/drei three lucide-react
npm install -D @types/three gsap

# 4. Run development server
npm run dev
```

## Development Workflow

```bash
# Start dev server
npm run dev               # → http://localhost:3000

# Type checking
npx tsc --noEmit

# Build
npm run build              # Verifies production build + Lighthouse budgets
```

## File Structure (key files)

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — fonts, metadata, Lenis provider |
| `app/page.tsx` | Main page — imports all sections |
| `app/globals.css` | Tailwind + glassmorphism utilities |
| `lib/constants.ts` | All content data (pricing, programs, trainers, etc.) |
| `components/Navbar.tsx` | Sticky glass navbar |
| `sections/Hero.tsx` | Hero with 3D orb |
| `sections/Pricing.tsx` | Pricing with billing toggle |

## Key Commands for Review

```bash
# Lighthouse CI (if @lhci/cli installed)
npx lhci autorun

# Build size analysis
npx next build && npx next-bundle-analyzer
```

## Constitution Gates (pre-commit checklist)

- [ ] Lighthouse Performance ≥ 95
- [ ] LCP < 1.8s
- [ ] Bundle < 300 KB initial JS
- [ ] All images are WebP with lazy loading
- [ ] All sections responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] `prefers-reduced-motion` disables animations
- [ ] No JS errors in console
