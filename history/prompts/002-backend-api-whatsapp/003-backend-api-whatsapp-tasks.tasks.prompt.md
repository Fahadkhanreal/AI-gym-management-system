---
id: 003
title: backend-api-whatsapp-tasks
stage: tasks
date: 2026-07-09
surface: agent
model: oc/deepseek-v4-flash-free
feature: backend-api-whatsapp
branch: 002-backend-api-whatsapp
user: Fahadkhanreal
command: /sp.tasks
labels: [backend, tasks, supabase, whatsapp, green-api, api]
links:
  spec: specs/002-backend-api-whatsapp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-backend-api-whatsapp/tasks.md
tests:
  - null
---

## Prompt

/sp.tasks (empty args — tasks generated from existing design docs)

## Response snapshot

Generated executable task breakdown with 28 tasks across 6 phases:

- **Phase 1 (Setup) — T001-T003**: Dependencies, Supabase client, env.example
- **Phase 2 (Foundational) — T004-T006**: SQL migration, RLS policies, Storage bucket
- **Phase 3 (US1: Public API — P1) — T007-T012**: 6 public GET endpoints (settings, pricing, programs, faqs, testimonials, gallery) — all parallelizable
- **Phase 4 (US2: WhatsApp — P2) — T013-T016**: Green API client, webhook handler, admin inbox, manual reply
- **Phase 5 (US3: Admin CRUD — P3) — T017-T024**: Auth middleware, login/logout, CRUD for all 6 content tables — all parallelizable
- **Phase 6 (Polish) — T025-T028**: Seed data, error handler, validation, integration test

### Key Stats
- **Total tasks**: 28
- **US1 tasks**: 6 (all [P] parallel)
- **US2 tasks**: 4 (2 [P] parallel)
- **US3 tasks**: 8 (all [P] parallel)
- **MVP scope**: Phase 1 + 2 + 3 (public API endpoints)
- **All file paths**: Relative to `frontend/` — existing Next.js 16 project

## Outcome

- ✅ Impact: Complete executable task breakdown for all 3 user stories + setup + polish
- 🧪 Tests: N/A — manual API testing with curl/Postman
- 📁 Files: 1 file created (tasks.md)
- 🔁 Next prompts: `/sp.implement` to execute the tasks
- 🧠 Reflection: All tasks follow strict checklist format [ID] [P] [Story]. US1, US2, US3 are fully independent and parallelizable. Clear file paths throughout.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): full-backend-tasks
- Next experiment (smallest change to try): Implementation phase
