# Research: Backend API & WhatsApp Automation

**Created**: 2026-07-09  
**Feature**: 002-backend-api-whatsapp

## 1. Supabase Integration Patterns

### Decision
Use Supabase with `@supabase/supabase-js` as the database client, with Row Level Security (RLS) for data protection. Public read-only access via anon key with RLS policies; admin write access via service_role key.

### Rationale
- Supabase provides PostgreSQL, Auth, and Storage in one platform — perfect for our full-stack Next.js app
- Anon key with strict RLS allows safe public API access without additional auth layer
- Service role key bypasses RLS for admin operations
- Real-time subscriptions available if needed for WhatsApp inbox
- Supabase Storage handles gallery image uploads natively

### Alternatives Considered
- **MongoDB Atlas**: More flexible schema but no built-in auth/storage, requires additional services
- **Firebase**: Better real-time but Firebase has RDB limitations for relational gym data
- **Direct PostgreSQL (Neon)**: More control but no built-in auth, requires additional auth service

## 2. Green API WhatsApp Integration

### Decision
Use Green API's REST webhook pattern: incoming messages POST to our webhook URL, we respond with chat messages via their `sendMessage` API endpoint.

### Rationale
- Green API is the most popular WhatsApp Business API alternative in Pakistan
- Simple REST-based integration — no complex webhook verification like Meta's official API
- Supports sending text, images, and documents
- Webhook URL configuration is done through Green API dashboard
- No Meta Business Verification required (official WhatsApp Business API requires this)

### Flow
1. User sends WhatsApp message to gym number
2. Green API forwards it to our webhook: `POST /api/whatsapp/webhook`
3. Webhook handler:
   - Saves message to `whatsapp_messages` table
   - Checks keywords against `bot_responses` table
   - If match: sends auto-reply via Green API `sendMessage`
   - If no match: marks as unread for admin
4. Admin can reply manually from dashboard → sends via Green API

### Green API Methods Needed
- `sendMessage` — Send text reply
- Webhook format: `{ "body": { "messageData": { "textMessageData": { "textMessage": "..." } }, "senderData": { "sender": "92300..." } } }`

### Alternatives Considered
- **Meta WhatsApp Cloud API**: Official but requires Business Verification (can take weeks in Pakistan)
- **Twilio WhatsApp**: Reliable but expensive per-message pricing
- **WhatsApp Web JS**: Unofficial, violates ToS, unreliable

## 3. Admin Authentication Approach

### Decision
Use Supabase Auth with email/password for admin authentication. Server-side session validation via cookies.

### Rationale
- Built into Supabase — no extra service needed
- `@supabase/ssr` package handles cookie-based sessions for Next.js
- RLS policies tied to authenticated user
- Simple enough for single-admin use case
- Session refresh handled automatically

### Alternatives Considered
- **NextAuth.js**: More flexible but adds another dependency when Supabase Auth already covers it
- **JWT manually**: More control but more code to maintain

## 4. API Route Pattern for Next.js App Router

### Decision
Use Next.js App Router route handlers (`route.ts`) for all API endpoints. Public endpoints use anon key. Admin endpoints check session before allowing service_role access.

### Rationale
- Standard Next.js 16 pattern
- No additional framework needed
- Route handlers are server-side only (no client bundle)
- Edge-compatible if needed
- Clean file-based routing

## 5. Input Validation

### Decision
Use Zod for request body validation on all admin write endpoints and webhook.

### Rationale
- Industry standard for TypeScript validation
- Type inference from schemas
- Clear error messages
- Lightweight — no runtime overhead beyond validation

## 6. Environment Variables Schema

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=        # Public — used by client and server
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Public anon key — RLS protected
SUPABASE_SERVICE_ROLE_KEY=       # Secret — admin operations only

# Green API
GREEN_API_INSTANCE_ID=           # Green API instance ID
GREEN_API_TOKEN=                 # Green API API token
GREEN_API_URL=                   # Green API API base URL (https://api.green-api.com)

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=     # Display number for frontend floating button
```

## 7. Performance Considerations

- Public API routes: Direct Supabase query (no external calls) → expected < 50ms
- WhatsApp webhook: Green API call adds latency → expected < 3s
- Admin routes: Same as public + auth check overhead → expected < 100ms
- Image upload: Supabase Storage direct upload → expected < 5s for typical gym images
- Rate limiting: Consider Vercel's built-in rate limiting or a simple in-memory map for webhook dedup
