# Data Model: Gym Backend System

**Created**: 2026-07-09  
**Feature**: 002-backend-api-whatsapp

## Entity Relationship Diagram (Text)

```
profiles (admin users)
  ↓ (no direct FK — auth managed by Supabase Auth)
  
gym_settings (single row)
pricing_plans
programs
faqs
testimonials
gallery

whatsapp_messages
  └── bot_responses (keyword matching lookup, no FK)
```

## Entity Definitions

### 1. `gym_settings`

Single configuration record for the gym.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| gym_name | text | NOT NULL | Gym display name |
| tagline | text | nullable | Short tagline |
| address | text | nullable | Physical address |
| phone | text | nullable | Contact phone |
| whatsapp_number | text | nullable | WhatsApp number (display) |
| opening_time | time | nullable | Opening time |
| closing_time | time | nullable | Closing time |
| map_link | text | nullable | Google Maps embed link |
| created_at | timestamptz | default now() | Creation timestamp |
| updated_at | timestamptz | default now() | Last update timestamp |

**Constraints**: Only ONE row allowed (application-enforced).

---

### 2. `pricing_plans`

Membership tier configurations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| name | text | NOT NULL | Plan name (e.g., "Basic", "Warrior") |
| description | text | nullable | Short description |
| price_monthly | numeric | NOT NULL | Monthly price in PKR |
| price_quarterly | numeric | NOT NULL | Quarterly price in PKR |
| price_yearly | numeric | NOT NULL | Yearly price in PKR |
| features | jsonb | NOT NULL, default '[]' | Array of {text, included} objects |
| is_popular | boolean | default false | Highlight as recommended |
| cta_text | text | default 'Join Now' | Button text |
| sort_order | integer | default 0 | Display ordering |
| is_active | boolean | default true | Soft delete flag |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**Validation**: At least one price must be > 0. Features is array of `{ text: string, included: boolean }`.

---

### 3. `programs`

Training programs offered by the gym.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| title | text | NOT NULL | Program name |
| description | text | nullable | Detailed description |
| duration | text | nullable | e.g., "4 weeks", "12 sessions" |
| price | numeric | nullable | Program-specific price |
| category | text | nullable | e.g., "strength", "cardio", "crossfit" |
| image_url | text | nullable | Program image URL |
| icon_name | text | nullable | Lucide icon name for display |
| is_active | boolean | default true | Soft delete flag |
| sort_order | integer | default 0 | Display ordering |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

---

### 4. `faqs`

Frequently asked questions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| question | text | NOT NULL | FAQ question |
| answer | text | NOT NULL | FAQ answer |
| category | text | nullable | Grouping category |
| sort_order | integer | default 0 | Display ordering |
| is_active | boolean | default true | Soft delete flag |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

---

### 5. `testimonials`

Member success stories and reviews.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| name | text | NOT NULL | Member name |
| message | text | NOT NULL | Testimonial text |
| image_url | text | nullable | Member photo URL |
| rating | integer | check(1-5) nullable | Star rating |
| is_active | boolean | default true | Toggle visibility |
| sort_order | integer | default 0 | Display ordering |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

---

### 6. `gallery`

Gym facility and equipment images.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| image_url | text | NOT NULL | Supabase Storage URL |
| category | text | nullable | e.g., "equipment", "facilities", "events" |
| caption | text | nullable | Short description |
| sort_order | integer | default 0 | Display ordering |
| is_active | boolean | default true | Soft delete flag |
| created_at | timestamptz | default now() | |

**Note**: Image file stored in Supabase Storage bucket `gallery`. Image deletion MUST also delete from Storage.

---

### 7. `whatsapp_messages`

Inbound WhatsApp messages and replies.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| from_number | text | NOT NULL | Sender's WhatsApp number |
| message | text | NOT NULL | Message text |
| reply | text | nullable | Admin/manual reply text |
| status | text | NOT NULL, default 'received' | Enum: received, replied, archived |
| is_read | boolean | default false | Admin read status |
| is_auto_replied | boolean | default false | Whether auto-reply was sent |
| auto_reply_sent_at | timestamptz | nullable | When auto-reply was sent |
| replied_at | timestamptz | nullable | When admin replied |
| replied_by | uuid | nullable, FK→profiles | Admin who replied |
| webhook_raw | jsonb | nullable | Raw Green API webhook payload |
| created_at | timestamptz | default now() | |

**Status Transitions**: `received` → `replied` (admin) or `received` (auto-replied) → `archived`

---

### 8. `bot_responses`

Configurable keyword-based auto-response rules.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK, default uuid() | Primary key |
| keywords | text[] | NOT NULL | Trigger keywords (array) |
| response_text | text | NOT NULL | Auto-reply text |
| is_active | boolean | default true | Enable/disable rule |
| match_type | text | default 'any' | Enum: any, all (match any or all keywords) |
| sort_order | integer | default 0 | Priority order |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**Matching Logic**: Case-insensitive. If any keyword matches message substring → send response. Higher sort_order = checked first.

## RLS Policies

### Public (anon key)
- `gym_settings`: SELECT only
- `pricing_plans`: SELECT where is_active = true
- `programs`: SELECT where is_active = true
- `faqs`: SELECT where is_active = true
- `testimonials`: SELECT where is_active = true
- `gallery`: SELECT where is_active = true
- `whatsapp_messages`: NO ACCESS
- `bot_responses`: NO ACCESS

### Authenticated Admin (service_role / authenticated user)
- All tables: FULL CRUD
- `whatsapp_messages`: SELECT, UPDATE (status, reply, is_read)
