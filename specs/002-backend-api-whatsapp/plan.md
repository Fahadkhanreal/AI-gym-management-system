# Implementation Plan: Gym Backend API & WhatsApp Automation

**Branch**: `002-backend-api-whatsapp` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-backend-api-whatsapp/spec.md`

## Summary

TitanForge gym ke liye ek full backend system: Supabase-based database, public API routes for landing page content, admin authentication + dashboard API, WhatsApp automation via Green API (webhook + keyword-based auto-reply). Yeh frontend landing page ko dynamic data dega aur gym owner ko control dega bina code change kiye.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16 (App Router)  
**Primary Dependencies**: @supabase/supabase-js, zod, axios  
**Storage**: PostgreSQL (via Supabase) + Supabase Storage (for gallery images)  
**Testing**: Manual API testing (via curl/Postman) — test framework TBD  
**Target Platform**: Web (Vercel deployment)  
**Project Type**: web — existing frontend (001-gym-landing-page) + new API routes + admin dashboard  
**Performance Goals**: Public API endpoints < 200ms (p95); WhatsApp replies < 3 seconds  
**Constraints**: < 200ms p95 response for public APIs; WhatsApp auto-reply within 3 seconds  
**Scale/Scope**: Single gym; 50+ concurrent WhatsApp webhook requests; single admin user initially

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Pre-Design | Post-Design | Notes |
|------|-----------|-------------|-------|
| I. Premium-First Design | ✅ N/A | ✅ N/A | Backend/API feature — not applicable to visual design |
| II. Mobile-First Responsiveness | ✅ N/A | ✅ N/A | Admin dashboard will be responsive by design |
| III. Scroll-Driven Storytelling | ✅ N/A | ✅ N/A | Backend feature |
| IV. Performance Obsession | ✅ PASS | ✅ PASS | 200ms p95 public API + 3s WhatsApp reply target — within budget |
| V. Conversion-Centric Architecture | ✅ PASS | ✅ PASS | WhatsApp auto-reply reduces response time from hours to seconds, directly improving lead conversion |
| VI. Maintainability & Clean Code | ✅ PASS | ✅ PASS | Route handlers pattern, Zod validation, TypeScript strict mode. Contracts and data model documented |

**Post-Design Verdict**: ✅ All gates pass. No violations detected. Architecture aligns with constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-api-whatsapp/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output — Supabase + Green API research
├── data-model.md        # Phase 1 output — entities and relationships
├── quickstart.md        # Phase 1 output — setup guide
├── contracts/           # Phase 1 output — API route specs
│   ├── public-api.json  # Public endpoints spec
│   ├── admin-api.json   # Admin endpoints spec
│   └── whatsapp.json    # WhatsApp webhook spec
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/                          # Existing Next.js 16 app
├── app/
│   ├── api/                       # NEW — Backend API routes
│   │   ├── settings/route.ts      # GET gym settings
│   │   ├── pricing/route.ts       # GET pricing plans
│   │   ├── programs/route.ts      # GET programs
│   │   ├── faqs/route.ts          # GET FAQs
│   │   ├── testimonials/route.ts  # GET testimonials
│   │   ├── gallery/route.ts       # GET gallery images
│   │   ├── admin/                 # Admin-only endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── pricing/route.ts
│   │   │   ├── programs/route.ts
│   │   │   ├── faqs/route.ts
│   │   │   ├── testimonials/route.ts
│   │   │   ├── gallery/route.ts
│   │   │   └── whatsapp/route.ts
│   │   └── whatsapp/
│   │       └── webhook/route.ts   # Green API webhook
│   └── admin/                     # NEW — Admin dashboard pages
│       └── ...
├── components/
│   └── admin/                     # Admin UI components
├── lib/
│   ├── supabase.ts                # NEW — Supabase client config
│   └── whatsapp.ts                # NEW — Green API client
└── .env.local                     # NEW — Environment variables
```

**Structure Decision**: Existing frontend project mein API routes add kiye jayenge (Next.js App Router convention). Admin dashboard alag routes `/admin/*` mein hoga. Yeh sab monorepo-style ek hi Next.js project mein.

## Complexity Tracking

No constitution violations detected — no complexity justification needed.
