# Quickstart: Backend API & WhatsApp Automation

**Created**: 2026-07-09  
**Feature**: 002-backend-api-whatsapp  
**Prerequisites**: Node.js 18+, Next.js 16 project (already set up), Supabase account, Green API account

## 1. Environment Setup

Copy `.env.example` to `.env.local` and fill in values:

```bash
# Supabase — get from project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Green API — get from Green API dashboard
GREEN_API_INSTANCE_ID=your-instance-id
GREEN_API_TOKEN=your-api-token
GREEN_API_URL=https://api.green-api.com

# Display
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
```

## 2. Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr zod axios
```

## 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL migration from `supabase/migrations/001_init.sql` (to be created)
3. Enable RLS on all tables
4. Create a `gallery` storage bucket (public read, authenticated write)
5. Create an admin user in Supabase Auth dashboard

## 4. Verify Public API

```bash
# Settings
curl http://localhost:3000/api/settings

# Pricing
curl http://localhost:3000/api/pricing

# FAQs
curl http://localhost:3000/api/faqs
```

All public endpoints should return JSON with `is_active = true` records.

## 5. Admin Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@titanforge.com","password":"your-password"}'

# Update settings (with session cookie)
curl -X PUT http://localhost:3000/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"gym_name":"TitanForge Gym"}'
```

## 6. WhatsApp Webhook Test

```bash
# Simulate Green API webhook
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "incomingMessageReceived",
    "body": {
      "messageData": {
        "textMessageData": {
          "textMessage": "fees"
        }
      }
    },
    "senderData": {
      "sender": "923001234567"
    }
  }'
```

Expected response: `{ "success": true, "auto_replied": true }` if "fees" keyword is configured.

## 7. Green API Webhook Configuration

In Green API dashboard:
1. Go to your instance → Settings → Webhook
2. Set webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Enable: "Incoming messages"
4. Save

## 8. Test Scenarios

| Test | Endpoint | Expected |
|------|----------|----------|
| Get gym info | GET /api/settings | 200 + settings JSON |
| Get pricing | GET /api/pricing | 200 + array of active plans |
| Admin auth | POST /api/admin/login | 200 + cookie |
| Unauthorized CRUD | PUT /api/admin/pricing | 401 |
| WhatsApp "fees" | POST /api/whatsapp/webhook | 200 + auto_replied: true |
| Unknown WhatsApp msg | POST /api/whatsapp/webhook | 200 + auto_replied: false |
| Admin reply | POST /api/admin/whatsapp/reply | 200 + message replied |
| Gallery upload | POST /api/admin/gallery | 201 + image URL |
