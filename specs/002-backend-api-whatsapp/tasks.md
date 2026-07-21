# Tasks: Gym Backend API & WhatsApp Automation

**Input**: Design documents from `/specs/002-backend-api-whatsapp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No explicit test framework — manual API testing via curl/Postman throughout.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js project root**: `frontend/` (existing Next.js 16 app)
- **API routes**: `frontend/app/api/`
- **Admin pages**: `frontend/app/admin/`
- **Library files**: `frontend/lib/`
- **Contracts/docs**: `specs/002-backend-api-whatsapp/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure environment, create base utilities

- [X] T001 Install backend dependencies: @supabase/supabase-js, @supabase/ssr, zod, axios in frontend/package.json
- [X] T002 [P] Create Supabase client config in frontend/lib/supabase.ts (public anon client + service role admin client)
- [X] T003 [P] Create .env.local.example in frontend/ with all required variables: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GREEN_API_INSTANCE_ID, GREEN_API_TOKEN, GREEN_API_URL, NEXT_PUBLIC_WHATSAPP_NUMBER

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, RLS policies, storage bucket — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create SQL migration with all 8 tables in supabase/migrations/001_init.sql — gym_settings, pricing_plans, programs, faqs, testimonials, gallery, whatsapp_messages, bot_responses (with all fields from data-model.md)
- [X] T005 [P] Enable RLS policies for all 8 tables in the SQL migration — public SELECT for content tables, authenticated CRUD for admin tables
- [X] T006 [P] Create Supabase Storage bucket 'gallery' with public read, authenticated write policies

**Checkpoint**: Foundation ready — database tables exist, RLS active, storage ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — Public Landing Page API (Priority: P1) 🎯 MVP

**Goal**: Public read-only API endpoints serve all landing page content dynamically. Frontend can fetch settings, pricing, programs, FAQs, testimonials, and gallery images from Supabase.

**Independent Test**: Hit each endpoint with curl and verify correct JSON response with only active records.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create GET /api/settings route in frontend/app/api/settings/route.ts — fetch single gym_settings row using anon key
- [X] T008 [P] [US1] Create GET /api/pricing route in frontend/app/api/pricing/route.ts — fetch active pricing_plans ordered by sort_order
- [X] T009 [P] [US1] Create GET /api/programs route in frontend/app/api/programs/route.ts — fetch active programs ordered by sort_order
- [X] T010 [P] [US1] Create GET /api/faqs route in frontend/app/api/faqs/route.ts — fetch active FAQs ordered by sort_order
- [X] T011 [P] [US1] Create GET /api/testimonials route in frontend/app/api/testimonials/route.ts — fetch active testimonials ordered by sort_order
- [X] T012 [P] [US1] Create GET /api/gallery route in frontend/app/api/gallery/route.ts — fetch active gallery images ordered by sort_order

**Checkpoint**: All 6 public endpoints functional. Can test independently with curl. Landing page can now fetch dynamic data.

---

## Phase 4: User Story 2 — WhatsApp Automation (Priority: P2)

**Goal**: Incoming WhatsApp messages are received via Green API webhook, matched against keywords for auto-reply, and unmatched messages are stored for admin review. Admin can view and reply manually.

**Independent Test**: Simulate Green API webhook with curl — verify auto-reply for matching keywords and message save for unmatched ones.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create Green API client in frontend/lib/whatsapp.ts — sendMessage function using axios to Green API REST endpoint
- [X] T014 [US2] Create POST /api/whatsapp/webhook route in frontend/app/api/whatsapp/webhook/route.ts — parse Green API payload, save message to whatsapp_messages table, check bot_responses keywords, send auto-reply via Green API client if match found
- [X] T015 [P] [US2] Create admin WhatsApp inbox endpoint GET /api/admin/whatsapp in frontend/app/api/admin/whatsapp/route.ts — fetch messages with optional status/is_read filters
- [X] T016 [US2] Create admin manual reply endpoint POST /api/admin/whatsapp/reply in frontend/app/api/admin/whatsapp/reply/route.ts — save reply text, update message status to 'replied', send via Green API client

**Checkpoint**: WhatsApp integration works end-to-end — inbound message → auto-reply OR admin inbox → manual reply.

---

## Phase 5: User Story 3 — Admin Content Management (Priority: P3)

**Goal**: Admin can authenticate and perform full CRUD operations on all content tables via protected API endpoints.

**Independent Test**: Login with valid credentials → perform CRUD → verify updated data reflects in public endpoints. Unauthorized requests should get 401.

### Implementation for User Story 3

- [X] T017 [P] [US3] Create auth middleware/helper in frontend/lib/auth.ts — Supabase Auth session check for route protection
- [X] T018 [P] [US3] Create admin auth routes: POST /api/admin/login and POST /api/admin/logout in frontend/app/api/admin/login/route.ts and frontend/app/api/admin/logout/route.ts
- [X] T019 [P] [US3] Create admin settings CRUD endpoint PUT /api/admin/settings in frontend/app/api/admin/settings/route.ts
- [X] T020 [P] [US3] Create admin pricing CRUD endpoint in frontend/app/api/admin/pricing/route.ts — GET (all including inactive), POST (create), plus frontend/app/api/admin/pricing/[id]/route.ts for PUT and DELETE
- [X] T021 [P] [US3] Create admin programs CRUD endpoint in frontend/app/api/admin/programs/route.ts — GET, POST, plus frontend/app/api/admin/programs/[id]/route.ts for PUT and DELETE
- [X] T022 [P] [US3] Create admin FAQs CRUD endpoint in frontend/app/api/admin/faqs/route.ts — GET, POST, plus frontend/app/api/admin/faqs/[id]/route.ts for PUT and DELETE
- [X] T023 [P] [US3] Create admin testimonials CRUD endpoint in frontend/app/api/admin/testimonials/route.ts — GET, POST, plus frontend/app/api/admin/testimonials/[id]/route.ts for PUT and DELETE
- [X] T024 [P] [US3] Create admin gallery CRUD endpoint in frontend/app/api/admin/gallery/route.ts — GET, POST (multipart upload to Supabase Storage + save URL), plus frontend/app/api/admin/gallery/[id]/route.ts for DELETE (also removes from Storage)

**Checkpoint**: Full admin API functional — authentication works, all CRUD operations work, public endpoints reflect changes immediately.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Seed data, error handling, final validation

- [X] T025 [P] Create seed data SQL script in supabase/seed.sql — sample pricing_plans (Basic, Warrior, Titan), programs (Strength, Hypertrophy, CrossFit, Mobility, Cardio), FAQs (8 common questions), testimonials (4 sample), bot_responses (fees, timing, location, program keywords)
- [X] T026 Create reusable error handler in frontend/lib/api-error.ts — standardized error response format with status codes and messages
- [X] T027 Validate all endpoints using commands from quickstart.md — run curl tests for every public, admin, and webhook endpoint
- [X] T028 Add Zod validation schemas for all admin write endpoints and webhook in frontend/lib/validations.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 — Public API (Phase 3)**: Depends on Foundational — No dependencies on other stories
- **US2 — WhatsApp (Phase 4)**: Depends on Foundational — No dependencies on other stories
- **US3 — Admin CRUD (Phase 5)**: Depends on Foundational — No dependencies on other stories
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on US2/US3
- **US2 (P2)**: Can start after Foundational — No dependencies on US1/US3
- **US3 (P3)**: Can start after Foundational — May integrate with US1 (verify public endpoints reflect admin changes) but independently testable

### Within Each User Story

- Core implementation (route handler) first
- File-based — each route is self-contained
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 2 tasks marked [P] can run in parallel
- ALL user story tasks marked [P] can run in parallel (different files, no inter-story dependencies)
- Within US1: All 6 endpoints can be created in parallel
- Within US3: All CRUD endpoints can be created in parallel
- US1, US2, US3 can all be worked on in parallel by different team members

---

## Parallel Example: User Story 1 — Public API

```bash
# Launch all 6 public endpoints in parallel:
Task: "Create GET /api/settings/route.ts"
Task: "Create GET /api/pricing/route.ts"
Task: "Create GET /api/programs/route.ts"
Task: "Create GET /api/faqs/route.ts"
Task: "Create GET /api/testimonials/route.ts"
Task: "Create GET /api/gallery/route.ts"
```

## Parallel Example: User Story 3 — Admin CRUD

```bash
# Launch all admin endpoints in parallel:
Task: "Create auth middleware + login/logout"
Task: "Create admin settings CRUD"
Task: "Create admin pricing CRUD"
Task: "Create admin programs CRUD"
Task: "Create admin FAQs CRUD"
Task: "Create admin testimonials CRUD"
Task: "Create admin gallery CRUD"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Public API)
4. **STOP and VALIDATE**: Test all 6 endpoints with curl
5. Frontend can now consume dynamic data

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. **US1 (Public API)** → Landing page gets dynamic content ✅ **MVP!**
3. **US2 (WhatsApp Automation)** → Auto-reply bot goes live
4. **US3 (Admin CRUD)** → Admin can manage content without code changes
5. **Polish** → Seed data, error handling, validation

Each story adds independent value without breaking previous stories.

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No test framework required — manual curl/Postman validation throughout
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to `frontend/` (the Next.js project root)
