---

description: "Task list for TitanForge gym landing page implementation"
---

# Tasks: Premium Gym Landing Page — TitanForge

**Input**: Design documents from `/specs/001-gym-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested per plan.md — testing is manual visual regression across 3 viewports + Lighthouse CI. No test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: All source at repository root (`app/`, `components/`, `sections/`, `hooks/`, `lib/`)
- Paths shown follow the project structure from `plan.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 16 project with TypeScript + Tailwind CSS
- [X] T002 [P] Install production dependencies: framer-motion, lenis, @react-three/fiber, @react-three/drei, three, lucide-react
- [X] T003 [P] Install dev dependencies: @types/three, gsap
- [X] T004 [P] Configure fonts in `app/layout.tsx` — Space Grotesk (headings) + Inter (body) via next/font/google
- [X] T005 Set up global CSS in `app/globals.css` — Tailwind directives, glassmorphism utilities, neon glow keyframes, custom CSS variables for color palette
- [X] T006 Create Lenis smooth scroll provider in `components/LenisProvider.tsx` and wrap root layout in `app/layout.tsx`
- [X] T007 Create `lib/constants.ts` with all content data types and placeholder/mock data for: programs, benefits, trainers, testimonials, FAQs, pricing tiers, nav links, footer sections
- [X] T008 Create `lib/utils.ts` with `cn()` utility using clsx + tailwind-merge
- [X] T009 [P] Create `hooks/useMousePosition.ts` for cursor tracking (used by 3D orb + magnetic buttons)
- [X] T010 [P] Create `hooks/useScrollProgress.ts` for scroll progress bar

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable components that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 [P] Create `components/GlassPanel.tsx` — reusable glassmorphism container (backdrop-blur, semi-transparent bg, border, rounded corners)
- [X] T012 [P] Create `components/MagneticButton.tsx` — reusable magnetic hover CTA button with glow + ripple click animation
- [X] T013 [P] Create `components/HoverCard3D.tsx` — reusable 3D tilt card wrapper with hover lift + neon border glow
- [X] T014 [P] Create `components/InfiniteMarquee.tsx` — auto-scrolling horizontal marquee component for testimonials
- [X] T015 [P] Create `components/PricingToggle.tsx` — Monthly / Quarterly / Yearly toggle switch
- [X] T016 [P] Create `components/Accordion.tsx` — single-open FAQ accordion with Framer Motion smooth expand/collapse
- [X] T017 [P] Create `components/Counter.tsx` — animated number counter for stats (Framer Motion)
- [X] T018 [P] Create `components/ScrollProgress.tsx` — thin neon scroll progress bar fixed at top
- [X] T019 [P] Create `components/3d/Scene.tsx` — R3F Canvas wrapper with lighting (ambient + directional), environment, and responsive sizing
- [X] T020 [P] Create `components/3d/FloatingOrb.tsx` — 3D energy orb with mouse tracking rotation, floating animation, and emissive material
- [X] T021 Create `app/page.tsx` — main page scaffold that imports and composes all sections in order

**Checkpoint**: Foundation ready — reusable components and data layer exist. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Immersive Landing Page Experience (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor lands on the page and immediately feels the premium, futuristic gym atmosphere. The hero delivers a cinematic experience with smooth scroll through all sections.

**Independent Test**: Load the page on a desktop browser — hero displays headline, sub-headline, primary CTA, and cinematic background. Scroll from top to bottom without jank or broken layout.

- [X] T022 [P] [US1] Create `components/Navbar.tsx` — sticky glass navbar with logo, nav links (Home, Programs, Facilities, Trainers, Pricing, Contact), "Free Trial" button, "Login" link, scroll-triggered background blur, hamburger menu for mobile
- [X] T023 [US1] Create `components/NavbarMobile.tsx` — mobile hamburger menu overlay with animated slide-in + link list (reused by Navbar.tsx, integrated within Navbar.tsx)
- [X] T024 [P] [US1] Create `sections/Hero.tsx` — full viewport hero with headline "FORGE YOUR LEGACY", sub-headline "World-class training. Next-level results.", primary CTA "Start Free Trial", secondary CTA "Watch The Experience"
- [X] T025 [US1] Integrate `components/3d/FloatingOrb.tsx` into `sections/Hero.tsx` as the centerpiece 3D element, lazy-loaded via `dynamic(() => import(...), { ssr: false })`
- [X] T026 [US1] Implement text reveal animation on hero headline + sub-headline using Framer Motion
- [X] T027 [US1] Add animated scroll-down indicator (chevron/bouncing arrow) at bottom of hero section
- [X] T028 [US1] Add scroll-triggered entrance animations to every section in `app/page.tsx` — fade-up + stagger on scroll into view (Framer Motion `useInView` + `motion.div`)
- [X] T029 [US1] Create `app/layout.tsx` — root layout with metadata, fonts, Lenis provider, ScrollProgress bar, favicon
- [X] T030 [US1] Create `public/images/hero-bg.webp` — placeholder hero background fallback image

**Checkpoint**: At this point, User Story 1 should be fully functional. The page loads, navbar is sticky, hero is cinematic with 3D orb, and all sections have scroll-triggered animations.

---

## Phase 4: User Story 2 — Explore Programs & Facilities (Priority: P1)

**Goal**: A potential member browses program cards, views facility gallery, reads trainer profiles — all in-page.

**Independent Test**: Scroll to Programs section, see program cards with hover lift + glow effect. Scroll to Facilities section, see images with hover zoom. Scroll to Trainers section, see trainer profiles.

- [X] T031 [P] [US2] Create `sections/Benefits.tsx` — "Why Choose Us" section with 4-6 benefit cards using HoverCard3D + GlassPanel, animated counter stats, icons from Lucide
- [X] T032 [P] [US2] Create `sections/Programs.tsx` — training program grid (Strength, Hypertrophy, CrossFit, Mobility, Women's Training, Boxing/HIIT) using HoverCard3D with image + title + description + "Learn More"
- [X] T033 [US2] Populate program data in `lib/constants.ts` — 6 program entries with id, title, description, icon, tags
- [X] T034 [P] [US2] Create `sections/Facilities.tsx` — equipment/facility gallery with hover zoom (next/image with CSS scale transform + overlay labels)
- [X] T035 [P] [US2] Create `sections/Trainers.tsx` — coach profile cards with photo, name, specialty, social icon links (Instagram, Twitter, LinkedIn)
- [X] T036 [US2] Populate trainer data in `lib/constants.ts` — 4 trainer entries with name, role, bio, socials
- [X] T037 [US2] Populate benefit data in `lib/constants.ts` — 4-6 benefit entries with title, description, icon, optional stat counter

**Checkpoint**: User Stories 1 AND 2 both work. Programs, benefits, facilities, and trainers sections render with hover interactions.

---

## Phase 5: User Story 3 — View Results & Social Proof (Priority: P2)

**Goal**: Hesitant visitors see transformation stories and testimonials that build trust.

**Independent Test**: Scroll to Transformations section, view before/after comparison. Scroll to Testimonials section, see auto-scrolling marquee with quote cards.

- [X] T038 [P] [US3] Create `sections/Transformations.tsx` — before/after comparison with slide/toggle between images + member success story cards
- [X] T039 [P] [US3] Create `sections/Testimonials.tsx` — 2-row infinite marquee using InfiniteMarquee component with glass quote cards (avatar, name, quote, achievement)
- [X] T040 [US3] Populate testimonial data in `lib/constants.ts` — 6-8 testimonial entries with id, name, avatar path, quote, achievement

**Checkpoint**: User Stories 1-3 all work. Social proof sections (transformations + testimonials) render and animate.

---

## Phase 6: User Story 4 — Compare & Select Membership (Priority: P2)

**Goal**: A motivated visitor compares 3 pricing tiers and toggles billing frequency to find the right plan.

**Independent Test**: Scroll to Pricing section, see 3 tiers side-by-side with feature checkmarks, toggle billing to update prices, see "Recommended" badge glow on Warrior plan.

- [X] T041 [US4] Create `sections/Pricing.tsx` — 3-tier pricing display (Basic, Warrior, Titan) with feature comparison checkmarks, "Recommended" glow badge on Warrior tier
- [X] T042 [US4] Integrate `components/PricingToggle.tsx` into `sections/Pricing.tsx` — toggle state ('monthly' | 'quarterly' | 'yearly') updates displayed prices in place
- [X] T043 [US4] Populate pricing data in `lib/constants.ts` — 3-tier entries with name, description, prices for all 3 billing cycles, feature list with included booleans, isRecommended flag

**Checkpoint**: User Stories 1-4 all work. Pricing section renders with toggle and proper plan highlighting.

---

## Phase 7: User Story 5 — Take Action (Contact / Join) (Priority: P2)

**Goal**: A convinced visitor can always find an enticing CTA. The final CTA section and footer push conversion.

**Independent Test**: Click any "Start Free Trial" button — button responds with ripple animation. Scroll to final CTA — see large cinematic call-to-action. Footer shows links and contact info.

- [X] T044 [P] [US5] Create `sections/FinalCTA.tsx` — large cinematic CTA section with "Ready to Forge Your Legacy?" headline + big CTA button using MagneticButton
- [X] T045 [P] [US5] Create `sections/Footer.tsx` — footer with nav links column, contact info, location/map reference, social media icons, copyright notice + subtle entrance animation
- [X] T046 [US5] Populate footer data in `lib/constants.ts` — FooterSection entries with title + link arrays, contact info, social links
- [X] T047 [US5] Populate nav link data in `lib/constants.ts` — NavLink entries for all navigation items
- [X] T048 [US5] Wire all CTA buttons across sections to point to appropriate section anchors / actions

**Checkpoint**: User Stories 1-5 all work. CTAs are everywhere, final CTA is cinematic, footer is complete.

---

## Phase 8: User Story 6 — Find Answers in FAQ (Priority: P3)

**Goal**: Visitors with lingering questions expand the FAQ accordion for quick answers.

**Independent Test**: Scroll to FAQ section, click any question — answer expands smoothly. Click another question — previous answer collapses, new one expands.

- [X] T049 [US6] Create `sections/FAQ.tsx` — FAQ section with single-open accordion using Accordion component
- [X] T050 [US6] Populate FAQ data in `lib/constants.ts` — 6-8 FAQ items with id, question, answer, category (membership, schedule, facilities)

**Checkpoint**: All 6 user stories are now independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T051 [P] Optimize all images to WebP format with proper compression in `public/images/`
- [X] T052 [P] Add `next/image` priority prop on hero image only, lazy-load all other images
- [X] T053 [P] Add metadata, Open Graph tags, and favicon in `app/layout.tsx`
- [X] T054 [P] Implement `prefers-reduced-motion` fallback — disable all Framer Motion animations when user prefers reduced motion
- [X] T055 [P] Add keyboard focus indicators (visible focus-visible rings) on all interactive elements
- [X] T056 [P] Add descriptive alt text to all images across all sections
- [X] T057 Responsive pass — test and fix all sections at 375px, 768px, 1024px, 1440px
- [X] T058 Lighthouse optimization pass — achieve Performance ≥ 95, LCP < 1.8s, CLS < 0.1
- [X] T059 [P] Final content pass — replace any placeholder/dummy content with real copy
- [X] T060 [P] Animation fine-tuning — adjust durations, easings, stagger delays across sections
- [X] T061 Final production build verification — `npm run build` with no errors, verify bundle size

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed by multiple developers)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 — Immersive Landing Page Experience (P1)**: Can start after Foundation — no dependencies on other stories
- **US2 — Explore Programs & Facilities (P1)**: Can start after Foundation — no dependencies on US1 (separate files)
- **US3 — View Results & Social Proof (P2)**: Can start after Foundation — no dependencies on US1/US2 (separate files)
- **US4 — Compare & Select Membership (P2)**: Can start after Foundation — no dependencies on other stories (separate files)
- **US5 — Take Action (P2)**: Can start after Foundation — no dependencies on other stories (separate files)
- **US6 — FAQ (P3)**: Can start after Foundation — no dependencies on other stories (separate files)

### Within Each Phase

- Models/data (constants.ts) before sections
- Core components before section composition
- Foundation complete before any story implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 1 Setup tasks marked [P] can run in parallel
- All Phase 2 Foundational tasks marked [P] can run in parallel
- Once Phase 2 completes, ALL user stories can start in parallel (no cross-story file conflicts — each story works on different section files)
- Within each story, [P] tasks (section components) can run in parallel
- All Phase 9 Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all sections for User Story 2 together (independent files):
Task: Create sections/Benefits.tsx
Task: Create sections/Programs.tsx
Task: Create sections/Facilities.tsx
Task: Create sections/Trainers.tsx
Task: Populate data in lib/constants.ts

# These all use different files and have no dependencies on each other.
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 — Immersive Landing Page Experience
4. Complete Phase 4: US2 — Explore Programs & Facilities
5. **STOP and VALIDATE**: Test US1 + US2 independently — core page with programs is the MVP
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundation → Foundation ready (reusable components + data)
2. Add US1 + US2 → Core page with hero, programs, facilities, trainers (MVP!)
3. Add US3 → Social proof (transformations + testimonials)
4. Add US4 → Pricing with billing toggle
5. Add US5 → Final CTA + Footer
6. Add US6 → FAQ
7. Polish → Performance + responsiveness + accessibility

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundation together
2. Once Foundation is done:
   - Developer A: US1 — Hero + Navbar
   - Developer B: US2 — Programs, Facilities, Trainers, Benefits
   - Developer C: US3 — Transformations, Testimonials
   - Developer D: US4 — Pricing
3. After US1-4 complete, add US5 (CTA + Footer) and US6 (FAQ)
4. Polish phase handled by all

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No test tasks generated per plan.md (manual visual regression testing)
- Commit after each logical group (at minimum after each phase checkpoint)
- Stop at any checkpoint to validate story independently
- Constitution gates (Lighthouse ≥ 95, LCP < 1.8s, bundle < 300 KB) checked in Phase 9
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
