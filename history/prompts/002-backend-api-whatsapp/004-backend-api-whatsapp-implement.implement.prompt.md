---
id: 004
title: backend-api-whatsapp-implement
stage: implement
date: 2026-07-09
surface: agent
model: oc/deepseek-v4-flash-free
feature: backend-api-whatsapp
branch: 002-backend-api-whatsapp
user: Fahadkhanreal
command: /sp.implement
labels: [backend, implement, supabase, whatsapp, green-api, api, crud]
links:
  spec: specs/002-backend-api-whatsapp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/lib/supabase.ts
  - frontend/lib/auth.ts
  - frontend/lib/whatsapp.ts
  - frontend/lib/api-error.ts
  - frontend/lib/validations.ts
  - frontend/app/api/settings/route.ts
  - frontend/app/api/pricing/route.ts
  - frontend/app/api/programs/route.ts
  - frontend/app/api/faqs/route.ts
  - frontend/app/api/testimonials/route.ts
  - frontend/app/api/gallery/route.ts
  - frontend/app/api/whatsapp/webhook/route.ts
  - frontend/app/api/admin/login/route.ts
  - frontend/app/api/admin/logout/route.ts
  - frontend/app/api/admin/settings/route.ts
  - frontend/app/api/admin/pricing/route.ts
  - frontend/app/api/admin/pricing/[id]/route.ts
  - frontend/app/api/admin/programs/route.ts
  - frontend/app/api/admin/programs/[id]/route.ts
  - frontend/app/api/admin/faqs/route.ts
  - frontend/app/api/admin/faqs/[id]/route.ts
  - frontend/app/api/admin/testimonials/route.ts
  - frontend/app/api/admin/testimonials/[id]/route.ts
  - frontend/app/api/admin/gallery/route.ts
  - frontend/app/api/admin/gallery/[id]/route.ts
  - frontend/app/api/admin/whatsapp/route.ts
  - frontend/app/api/admin/whatsapp/reply/route.ts
  - supabase/migrations/001_init.sql
  - supabase/seed.sql
  - frontend/.env.local.example
tests:
  - Manual: curl tests for all 22 API endpoints
---

## Prompt

ek folder ha frontend ka name sa uska ander he project banana qk frontend bhe uska ander ha or backend bhe usma he rakhaga

## Response snapshot

Full backend implementation complete in the existing `frontend/` project. All 28 tasks completed across 6 phases:

### Phase 1 — Setup ✅
- npm install: @supabase/supabase-js, @supabase/ssr, zod, axios
- lib/supabase.ts (public anon client + admin service_role client)
- .env.local.example with all variables

### Phase 2 — Foundational ✅
- supabase/migrations/001_init.sql — 8 tables with RLS policies
- Storage bucket 'gallery' configuration

### Phase 3 — US1: Public API (P1) ✅
- 6 public GET endpoints: /api/settings, /api/pricing, /api/programs, /api/faqs, /api/testimonials, /api/gallery
- All filter by is_active=true, ordered by sort_order

### Phase 4 — US2: WhatsApp (P2) ✅
- lib/whatsapp.ts — Green API client (sendMessage via axios)
- POST /api/whatsapp/webhook — inbound message handler with keyword auto-reply
- GET /api/admin/whatsapp — message inbox with filters
- POST /api/admin/whatsapp/reply — manual reply sender

### Phase 5 — US3: Admin CRUD (P3) ✅
- lib/auth.ts — Bearer token verification
- POST /api/admin/login & /logout — auth routes
- Full CRUD for settings, pricing, programs, FAQs, testimonials, gallery
- Gallery: multipart upload to Supabase Storage + URL saving
- Gallery delete: also removes from Storage

### Phase 6 — Polish ✅
- supabase/seed.sql — comprehensive seed data (3 pricing plans, 6 programs, 8 FAQs, 4 testimonials, 4 bot responses)
- lib/api-error.ts — standardized error responses
- lib/validations.ts — Zod schemas for all entities

## Outcome

- ✅ Impact: Complete backend API system for TitanForge gym — 22 route handlers, 8 database tables, WhatsApp automation, admin CRUD
- 🧪 Tests: Manual curl tests defined in quickstart.md
- 📁 Files: 28+ files created across frontend/ and supabase/
- 🔁 Next prompts: Deploy to Vercel + configure Supabase + configure Green API webhook
- 🧠 Reflection: All 28 tasks completed. TypeScript build passes with 0 errors. Architecture clean — public vs admin separation with auth middleware.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript type-check PASS
- Prompt variant (if applicable): full-backend-implement
- Next experiment (smallest change to try): Connect frontend sections to dynamic API data
