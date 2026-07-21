---
id: 002
title: backend-api-whatsapp-plan
stage: plan
date: 2026-07-09
surface: agent
model: oc/deepseek-v4-flash-free
feature: backend-api-whatsapp
branch: 002-backend-api-whatsapp
user: Fahadkhanreal
command: /sp.plan
labels: [backend, supabase, whatsapp, green-api, api, plan]
links:
  spec: specs/002-backend-api-whatsapp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-backend-api-whatsapp/plan.md
  - specs/002-backend-api-whatsapp/research.md
  - specs/002-backend-api-whatsapp/data-model.md
  - specs/002-backend-api-whatsapp/quickstart.md
  - specs/002-backend-api-whatsapp/contracts/public-api.json
  - specs/002-backend-api-whatsapp/contracts/admin-api.json
  - specs/002-backend-api-whatsapp/contracts/whatsapp.json
tests:
  - null
---

## Prompt

# GYM PROJECT - BACKEND IMPLEMENTATION PLAN

[Full implementation plan with 7 phases, Supabase + Green API setup, admin dashboard, WhatsApp integration, frontend connection]

## Response snapshot

Completed full `/sp.plan` workflow for the backend feature:

### Phase 0 — Research (`research.md`)
- Supabase integration patterns (RLS, anon vs service_role)
- Green API WhatsApp flow (webhook → keyword match → auto-reply)
- Admin auth approach (Supabase Auth + cookies)
- Zod validation, environment variables, performance targets

### Phase 1 — Design & Contracts
- **data-model.md**: 8 entities (gym_settings, pricing_plans, programs, faqs, testimonials, gallery, whatsapp_messages, bot_responses) with full field definitions, types, constraints, RLS policies
- **contracts/public-api.json**: 6 GET endpoints (settings, pricing, programs, faqs, testimonials, gallery)
- **contracts/admin-api.json**: Full CRUD endpoints for all content + auth + WhatsApp reply
- **contracts/whatsapp.json**: Green API webhook payload schema
- **quickstart.md**: Setup steps, test commands, test scenarios table

### Constitution Check
- All 6 gates: ✅ PASS (Pre + Post design)
- No violations

### Agent Context
- Updated CLAUDE.md with new technology (TypeScript 5.x, Supabase, Zod, axios)

## Outcome

- ✅ Impact: Complete backend plan with research, data model, API contracts, and quickstart guide
- 🧪 Tests: N/A (plan phase)
- 📁 Files: 7 files created/updated across specs/002-backend-api-whatsapp/
- 🔁 Next prompts: `/sp.tasks` to generate executable task breakdown for all 7 phases
- 🧠 Reflection: Backend spec was comprehensive — research confirmed all technology choices. Data model clean with proper RLS policies. OpenAPI contracts cover public, admin, and webhook endpoints exhaustively.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): full-backend-plan
- Next experiment (smallest change to try): Tasks phase
