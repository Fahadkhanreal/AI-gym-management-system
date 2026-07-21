# Feature Specification: Gym Backend API & WhatsApp Automation

**Feature Branch**: `002-backend-api-whatsapp`  
**Created**: 2026-07-09  
**Status**: Draft  
**Input**: User description: "Complete backend specification for TitanForge gym management system with Supabase, WhatsApp automation via Green API"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Landing Page API (Priority: P1)

Gym website visitors dekhte hain dynamic content — pricing plans, programs, FAQs, testimonials, gallery images — jo admin dashboard se update kiya ja sakta hai. Backend APIs serve karti hain yeh data landing page frontend ko.

**Why this priority**: Yeh landing page ki backbone hai. Frontend ko live data chahiye jo admin manage kare. Iske bina site static rahegi.

**Independent Test**: API endpoints ko directly call karke verify kiya ja sakta hai ke sahi data return ho raha hai. Admin changes ke baad updated data mile.

**Acceptance Scenarios**:

1. **Given** admin ne pricing plans update kiye hain, **When** koi visitor landing page visit kare, **Then** updated pricing plans API se fetch hokar dikhne chahiye
2. **Given** admin ne ek naya program add kiya hai, **When** Programs section load ho, **Then** naya program list mein aaye
3. **Given** admin ne faqs update ki hain, **When** FAQ section expand kiya jaye, **Then** updated questions aur answers dikhein
4. **Given** admin ne testimonial disable kiya hai, **When** Testimonials section load ho, **Then** woh testimonial na dikhe
5. **Given** admin ne gym settings (timings, address) update kiya, **When** footer ya contact section load ho, **Then** updated info dikhe

---

### User Story 2 - WhatsApp Automation (Priority: P2)

Gym members aur potential customers WhatsApp ke through gym inquiries karte hain. Backend automatically reply karta hai unhe relevant info ke saath — pricing, timings, location — aur unanswered queries admin dashboard mein flag hoti hain.

**Why this priority**: WhatsApp Pakistan mein sabse common communication channel hai. Automated replies se response time seconds mein aa jata hai, jo conversion ke liye critical hai.

**Independent Test**: Green API webhook ko locally trigger karke verify kiya ja sakta hai ke keyword-based auto replies sahi bheje ja rahe hain aur unmatched messages admin panel mein appear ho rahi hain.

**Acceptance Scenarios**:

1. **Given** ek user ne "fees" ya "price" likha, **When** webhook message receive kare, **Then** system pricing details ka auto-reply bheje
2. **Given** ek user ne "timing" ya "open" likha, **When** webhook message receive kare, **Then** system gym timings ka reply bheje
3. **Given** ek user ne "location" likha, **When** webhook message receive kare, **Then** system address aur map link bheje
4. **Given** koi unknown message aaya (keyword match nahi hua), **When** webhook process kare, **Then** message admin dashboard mein unread flag ke saath save ho
5. **Given** admin ne bot_responses table mein naya keyword add kiya, **When** woh keyword receive ho, **Then** naya auto-reply trigger ho

---

### User Story 3 - Admin Content Management API (Priority: P3)

Admin (gym owner / manager) ko ek protected interface chahiye jahan se landing page ka saara content manage kar sake — pricing, programs, FAQs, testimonials, gallery — bina code change kiye.

**Why this priority**: Admin ko control dena important hai lekin landing page public API ke bina kaam karegi nahi. Isliye yeh P3 hai — building block pehle chahiye.

**Independent Test**: Authenticated user CRUD operations perform kar sakta hai aur unauthorized requests reject hoti hain.

**Acceptance Scenarios**:

1. **Given** admin login hai, **When** woh pricing plans create/update/delete kare, **Then** changes immediately public API par reflect hon
2. **Given** admin login hai, **When** woh program add kare, **Then** Programs public endpoint updated data return kare
3. **Given** admin login hai, **When** woh testimonial toggle kare (active/inactive), **Then** public API sirf active testimonials return kare
4. **Given** unauthorized request aati hai, **When** admin endpoint hit ho, **Then** 401 Unauthorized response mile
5. **Given** admin gallery mein image upload kare, **When** upload complete ho, **Then** image public gallery endpoint mein disponible ho

---

### Edge Cases

- WhatsApp message mein kiwi, emojis, ya Urdu (non-English) text ho — system ko unhe properly handle karna chahiye
- Agar Green API down ho ya webhook fail ho — message queue mein rehna chahiye ya retry hona chahiye
- Agar do admin simultaneously same record update karein — last-write-wins behavior acceptable hai initially
- Agar pricing plan delete kiya jaye jo currently active hai — system ko graceful fallback dena chahiye (ya delete prevent karna chahiye)
- Gallery image delete hone par Supabase Storage se bhi delete honi chahiye (orphan files avoid)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide public read-only data access for all landing page content (settings, pricing, programs, FAQs, testimonials, gallery)
- **FR-002**: Admin data modification requests MUST require authentication before processing
- **FR-003**: System MUST support full create, read, update, and delete operations for pricing plans, programs, FAQs, testimonials, and gallery images by authenticated admin
- **FR-004**: System MUST receive incoming WhatsApp messages via a configurable webhook and process them for auto-reply
- **FR-005**: System MUST auto-reply to WhatsApp messages based on keyword matching from a configurable bot responses list
- **FR-006**: Unmatched WhatsApp messages MUST be stored with an "unread" flag visible in the admin dashboard
- **FR-007**: System MUST allow admin to view all WhatsApp messages and manually reply to any message
- **FR-008**: System MUST persist all content persistently with proper relationships between data entities
- **FR-009**: Gym settings MUST be a single configuration record (not multiple rows)
- **FR-010**: Gallery images MUST support categorization and captions, with appropriate file storage
- **FR-011**: System MUST validate all input data before processing, rejecting invalid inputs with clear error messages
- **FR-012**: All public data access MUST return results within 200 milliseconds (p95) under normal load
- **FR-013**: Admin can update gym information: name, tagline, address, phone, WhatsApp number, opening/closing times, and map link
- **FR-014**: Pricing plans MUST support monthly, quarterly, and yearly pricing with a features checklist and a "popular/recommended" flag
- **FR-015**: Testimonials MUST support an active/inactive toggle so admin can show or hide without deleting
- **FR-016**: WhatsApp messages MUST track their processing status (received, replied, archived) and read/unread state
- **FR-017**: Bot responses MUST be configurable — multiple keywords can map to the same response, and admin can enable or disable each response independently

### Key Entities *(include if feature involves data)*

- **Gym Profile**: Single configuration record for the gym — name, address, contact, timings, WhatsApp number, map link
- **Pricing Plan**: Membership tier with name, description, three price tiers (monthly/quarterly/yearly), features checklist, popular flag
- **Training Program**: Individual program offering with title, description, duration, price, category, image
- **FAQ**: Question-answer pair with optional category grouping
- **Testimonial**: Member success story with name, message, image, rating, active status toggle
- **Gallery Image**: Uploaded image with category label and caption
- **WhatsApp Message**: Inbound message record with sender number, message text, reply, status tracking
- **Bot Response**: Keyword-triggered auto-response configuration

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public API endpoints respond within 200ms (p95) for all landing page content requests
- **SC-002**: WhatsApp auto-replies are sent within 3 seconds of receiving a webhook message
- **SC-003**: Admin can complete a full content update (e.g., update pricing + add program + edit FAQ) in under 5 minutes
- **SC-004**: System handles 50+ concurrent WhatsApp webhook requests without data loss or duplicate replies
- **SC-005**: Unauthorized access to admin endpoints is rejected reliably with proper HTTP status codes
- **SC-006**: Bot response keyword matching has zero false positives for common gym-related queries
- **SC-007**: Gallery uploads are processed and available via public API within 5 seconds of upload completion
