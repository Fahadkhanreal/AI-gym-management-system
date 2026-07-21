# Data Model: TitanForge Gym Landing Page

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-08
**Note**: This is a static frontend with no backend or database. All entities
are in-memory data structures defined in `lib/constants.ts`.

---

## Entity: MembershipTier

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., `"basic"`, `"warrior"`, `"titan"`) |
| `name` | `string` | Display name |
| `description` | `string` | One-line teaser |
| `priceMonthly` | `number` | Price in PKR / month |
| `priceQuarterly` | `number` | Price in PKR / quarter |
| `priceYearly` | `number` | Price in PKR / year |
| `features` | `Feature[]` | Array of included features |
| `isRecommended` | `boolean` | Whether this tier is highlighted |
| `ctaText` | `string` | Button label (e.g., `"Join Now"`) |

**Feature sub-type**: `{ text: string; included: boolean }`

**Instances**: Basic (entry-level), Warrior (recommended), Titan (premium)

---

## Entity: Program

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Program name |
| `description` | `string` | Short description (1-2 sentences) |
| `image` | `string` | Image path (public/images/program-*.webp) |
| `icon` | `LucideIcon` | Icon component reference |
| `tags` | `string[]` | Category tags (e.g., `["strength", "beginner"]`) |

**Instances**: Strength Training, Hypertrophy, CrossFit, Mobility, Women's Training, Boxing / HIIT

---

## Entity: Trainer

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Full name |
| `role` | `string` | Specialty / title (e.g., `"Head Strength Coach"`) |
| `image` | `string` | Photo path |
| `bio` | `string` | Short bio (1-2 sentences) |
| `socials` | `SocialLink[]` | Social media links |

**SocialLink**: `{ platform: 'instagram' | 'twitter' | 'linkedin'; url: string }`

---

## Entity: Testimonial

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Member name |
| `avatar` | `string` | Avatar image path |
| `quote` | `string` | Testimonial text |
| `achievement` | `string` | Brief result (e.g., `"Lost 20kg in 6 months"`) |

---

## Entity: FAQItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `question` | `string` | Question text |
| `answer` | `string` | Answer text (may include inline links) |
| `category` | `string` | Grouping (e.g., `"membership"`, `"schedule"`, `"facilities"`) |

---

## Entity: Benefit

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Benefit headline |
| `description` | `string` | Short description |
| `icon` | `LucideIcon` | Icon component reference |
| `stat` | `{ value: number; suffix: string }` | Optional stat (e.g., `{ value: 5000, suffix: "+" }`) |

---

## Entity: NavLink

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display text |
| `href` | `string` | Section anchor (e.g., `"#programs"`) |

---

## Entity: FooterSection

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Column heading |
| `links` | `{ label: string; href: string }[]` | Link list |

---

## State Management

Since this is a fully static landing page, the only client-side state is:

- **Pricing toggle**: `'monthly' | 'quarterly' | 'yearly'` — local `useState`
  in `Pricing.tsx`, passed down to tier cards
- **FAQ open item**: `string | null` — local `useState` in `FAQ.tsx`
- **Mobile nav open**: `boolean` — local `useState` in `Navbar.tsx`
- **Scroll progress**: `number` (0-100) — via `useScrollProgress` hook
- **Mouse position**: `{ x: number; y: number }` — via `useMousePosition` hook
  (used by 3D orb + magnetic buttons)

No global state management, no context providers (beyond Lenis + R3F Canvas),
no data fetching.
