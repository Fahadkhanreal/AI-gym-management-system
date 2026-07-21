---
id: 001
title: gym-landing-page-constitution
stage: constitution
date: 2026-07-08
surface: agent
model: oc/deepseek-v4-flash-free
feature: landing-page
branch: master
user: Fahadkhanreal
command: /sp.constitution
labels: ["constitution", "gym", "landing-page", "nexusfit", "design"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

# GYM LANDING PAGE - PROJECT CONSTITUTION

**Project Name:** NexusFit / ApexFit / TitanForge (Tum final name decide kar sakte ho)  
**Category:** Fitness / Gym / Premium Wellness  
**Version:** 1.0  
**Methodology:** Panaversity Spec Kit Plus (Spec-Driven Development)

---

## 1. Vision & Mission

**Vision:**  
Ek world-class, cinematic, futuristic gym landing page jo visitors ko turant motivate kare aur membership conversion high ho.

**Mission:**  
"Build the most premium, buttery-smooth, high-converting gym landing page in Pakistan/World using modern web standards with exceptional user experience and performance."

---

## 2. Core Objectives

- High conversion rate (Membership signups, Free Trial, Contact)
- Premium & Futuristic feel (Apple + Stripe + Linear level polish)
- Fully responsive (Mobile-first)
- Exceptional scroll storytelling
- Lightning fast performance (Lighthouse 95+)
- Easy to maintain & update

---

## 3. Target Audience

- 18-45 age group
- Fitness enthusiasts, athletes, beginners
- Premium segment (jo quality experience chahte hain)
- Tech-savvy users

---

## 4. Design & Aesthetic Constitution

**Color Palette:**
- Primary: Deep Black + Electric Cyan / Violet / Orange accents
- Background: Dark gradient + subtle cosmic/gym energy feel
- Accents: Neon glows, gradients

**Typography:**
- Headings: `Space Grotesk` or `Clash Grotesk`
- Body: `Inter` or `Satoshi`

**Overall Vibe:**  
Premium Modern Gym + Futuristic Tech (Cyber-fitness)

---

## 5. Sections Constitution (Final Structure)

### 1. Navbar
- Logo + Navigation
- "Join Now" CTA (sticky)

### 2. Hero Section
- Background video / animated particles
- Big headline with gym + futuristic feel
- 3D element (Dumbbell / Human figure / Energy orb)
- Primary CTA + Trust signals

### 3. Why Choose Us / Benefits

### 4. Our Programs (Features)
- Strength Training
- Cardio
- CrossFit
- Yoga / Mobility
- Personal Training

### 5. Transformation Gallery / Results
- Before-After
- Member Success Stories

### 6. Facilities / Equipment Showcase
- 3D or smooth image grid with hover

### 7. Trainers / Team

### 8. Membership Plans (Pricing)
- 3-4 tiers with "Most Popular"

### 9. Testimonials

### 10. FAQ

### 11. Final CTA + Location/Map

### 12. Footer

---

## 6. Animation & Interaction Constitution

**Must Have:**
- Lenis smooth scroll
- Scroll-triggered animations (Framer Motion style)
- Glassmorphism cards
- Hover lifts + glows
- Magnetic CTAs
- 3D tilt on cards
- Counter animations
- Infinite marquee for testimonials
- Mouse reactive elements in hero

**Nice to Have:**
- 3D floating dumbbell / energy core
- Scroll progress bar
- Custom cursor (optional)

---

## 7. Performance Constitution

- Initial bundle < 300KB
- Lighthouse Score ≥ 95
- LCP < 2s
- Use WebP + lazy loading
- Optimized 3D (if used)
- No render blocking

---

## 8. Tech Stack Constitution

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis
- React Three Fiber (for 3D)
- GSAP (if needed for complex scroll)

**Other:**
- next/image
- Lucide Icons

---

## 9. Content Strategy

- Powerful, motivational headlines
- Short, benefit-driven copy
- Strong CTAs
- Trust builders (members count, years, awards)

---

## 10. Success Metrics

- Bounce rate < 45%
- Time on page > 90 seconds
- Click through rate on CTA > 8%
- Conversion rate (form submissions)

---

## 11. Deliverables

1. Complete Constitution (yeh file)
2. Detailed Specs Document
3. Component Breakdown
4. Full Code Implementation
5. Responsive Testing
6. Performance Optimization
7. Deployment Ready

---

**Approval Required:**
- Final Gym Name
- Primary Color
- Logo (agar available ho)
- Specific Content (if you want to provide)

---

**Next Steps (Spec Kit Plus Flow):**

1. **Constitution** → Approved (Current)
2. **Detailed Specs** → Section by section + copy + animations
3. **Implementation Plan** → Task breakdown
4. **Development** → Code

## Response snapshot

Loaded the user's comprehensive gym landing page constitution for "NexusFit" (chosen project name). Analyzed the existing `.specify/memory/constitution.md` template which contained 6 generic placeholder principles, and mapped the user's 11-section constitution into the structured template format.

**Key mapping decisions:**
- User's 6 core objectives → 6 named principles (Premium-First Design, Mobile-First Responsiveness, Scroll-Driven Storytelling, Performance Obsession, Conversion-Centric Architecture, Maintainability & Clean Code)
- User's Design/Aesthetic §4 + Tech Stack §8 → "Design System & Aesthetic" section
- User's Animation §6 → "Animation & Interaction Standards" section
- User's Content Strategy §9 → "Content & Copy Strategy" section
- User's Governance methodology → "Governance" section with amendment/versioning/compliance rules
- User's Performance §7 → Embedded into Principle IV and Governance compliance checks

**Version**: 1.0.0 (initial — no prior constitution existed)
**Bump rationale**: MINOR + PATCH merged as a single initial v1.0.0 since there was no baseline

**Sync Impact**: Checked `spec-template.md`, `plan-template.md`, `tasks-template.md`, `phr-template.prompt.md` — none required changes; they are generic templates that don't reference constitution content by name.

**Name selected**: NexusFit (first option in user's list, feels most premium)

## Outcome

- ✅ Impact: Created initial project constitution with 6 core principles mapped from user's spec. No templates required updates.
- 🧪 Tests: N/A (constitution phase — no tests applicable)
- 📁 Files: `.specify/memory/constitution.md` (created/overwritten)
- 🔁 Next prompts: `/sp.specify` to generate detailed section specs, or `/sp.plan` for implementation planning
- 🧠 Reflection: User provided an unusually thorough constitution — nearly all template placeholders could be derived directly. Named "NexusFit" as the project name; user can override if needed.

## Evaluation notes (flywheel)

- Failure modes observed: None — constitution template matched user's comprehensive spec smoothly.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): /sp.constitution (standard)
- Next experiment (smallest change to try): Move to /sp.specify for detailed per-section specs
