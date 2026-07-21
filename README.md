<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/TitanForge/titanforge-gym/main/frontend/public/og-image.svg" alt="TitanForge Gym" width="600"/>
  <br/>
  <h1>🏋️ TitanForge Gym — Premium Fitness Landing Page</h1>
  <p>
    <strong>A full-featured, production-ready gym management system with AI-powered chatbot, WhatsApp integration, and complete admin panel.</strong>
  </p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-environment-variables">Environment Variables</a> •
    <a href="#-database">Database</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-project-structure">Project Structure</a>
  </p>
  <br/>
</div>

---

## ✨ Features

### 🌐 Public Website
- **Premium Landing Page** — Hero, Programs, Pricing, Trainers, Testimonials, Facilities, Transformations, FAQ sections
- **Dynamic Content** — All content editable via admin panel (gym name, tagline, pricing, programs, etc.)
- **AI Chatbot** — RAG-based chatbot for WhatsApp & website inquiries
- **Trial Signup** — Free trial form with detailed fitness profiling
- **Contact Form** — General inquiries with plan selection
- **SEO Optimized** — Dynamic metadata, OG image, sitemap, JSON-LD structured data, robots.txt
- **Responsive Design** — Fully mobile-optimized with Tailwind CSS
- **WhatsApp Integration** — Click-to-chat and automated responses

### 🔐 Admin Panel
- **Dashboard** — Overview of members, leads, and key metrics
- **Gym Settings** — Update gym name, tagline, address, WhatsApp number, timing, etc. (reflects site-wide instantly)
- **Content Management**
  - Pricing Plans (CRUD with featured/recommended)
  - Programs (CRUD with images)
  - Benefits (CRUD with stats)
  - Facilities (CRUD with images)
  - Trainers (CRUD with social links)
  - Transformations (before/after images)
  - Testimonials (with approval workflow)
  - FAQs (categorized)
  - Gallery (image uploads)
- **Member Management**
  - Add/edit/delete members
  - Auto-generated member IDs (TF-001, TF-002, ...)
  - Check-in/attendance tracking
  - Membership expiry & fee tracking
  - Active/expired/inactive status management
- **Lead Management**
  - View inquiries from contact form, trial signup & WhatsApp
  - Status tracking (new, contacted, converted, member, closed)
  - One-click lead-to-member conversion (with duplicate protection)
  - Delete leads
- **WhatsApp Inbox** — View & reply to WhatsApp messages
- **AI Knowledge Base** — Manage chatbot training data
- **API Settings** — Configure WhatsApp API keys
- **Drag & Drop Sidebar** — Reorder admin navigation to your preference (persisted globally)

### 🤖 AI & Communication
- **RAG Chatbot** — AI-powered responses based on your gym's knowledge base
- **WhatsApp Cloud API** — Send/receive messages via Meta's WhatsApp Business API
- **Voice Reply** — Text-to-speech voice replies for WhatsApp
- **Auto-reply** — Automated responses to common queries

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Database** | PostgreSQL (via Supabase) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage (images) |
| **AI** | RAG-based chatbot |
| **WhatsApp** | Meta Cloud API |
| **Fonts** | Space Grotesk & Inter (next/font) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier works)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/titanforge-gym.git
cd titanforge-gym/frontend
npm install
```

### 2. Supabase Setup

Create a Supabase project at [supabase.com](https://supabase.com), then run all migration files from `supabase/migrations/` in order (1 → 10) via Supabase Dashboard → SQL Editor.

After migrations, add a row to `gym_settings` and create an admin user in Supabase Authentication.

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your project credentials from Supabase Dashboard → Settings → API.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Production domain URL |

### 4. Run Development Server

```bash
cd frontend
npm run dev
# Opens at http://localhost:3000
```

### 5. Access Admin Panel

Navigate to `/admin` and log in with your Supabase admin credentials.

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (secret - bypasses RLS) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production domain for SEO/sitemap |

---

## 📁 Project Structure

```
titanforge-gym/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── (landing)/          # Public website pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   └── layout.tsx     # Landing layout (with GymProvider)
│   │   ├── admin/              # Admin panel
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── layout.tsx      # Admin layout (sidebar, auth)
│   │   │   ├── members/        # Member management
│   │   │   ├── leads/          # Lead management
│   │   │   ├── settings/       # Gym settings
│   │   │   ├── pricing/        # Pricing plans
│   │   │   ├── programs/       # Programs
│   │   │   ├── trainers/       # Trainers
│   │   │   └── ...             # Other admin sections
│   │   ├── api/                # API routes (serverless)
│   │   │   ├── admin/          # Admin-only APIs (with auth)
│   │   │   └── ...             # Public APIs
│   │   ├── privacy/page.tsx    # Privacy policy
│   │   ├── terms/page.tsx      # Terms of service
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   └── robots.ts           # Robots.txt
│   ├── components/             # Reusable UI components
│   ├── sections/               # Landing page sections
│   ├── lib/                    # Utilities (supabase client, auth, gym-context)
│   ├── public/                 # Static assets (og-image.svg, fonts)
│   └── next.config.ts          # Next.js configuration
├── supabase/
│   └── migrations/             # Database migration files (run in order)
│       ├── 001_init.sql
│       ├── 002_sections.sql
│       └── ... (up to 010)
└── README.md
```

---

## 🗄 Database

### Tables Overview

| Table | Purpose |
|-------|---------|
| `gym_settings` | Global gym configuration (name, tagline, contact, etc.) |
| `pricing_plans` | Membership pricing tiers |
| `programs` | Training programs |
| `benefits` | Gym benefits/features |
| `facilities` | Gym facilities |
| `trainers` | Staff/coaches |
| `transformations` | Before/after member transformations |
| `testimonials` | Member reviews with approval |
| `faqs` | Frequently asked questions |
| `gallery` | Gym photos |
| `leads` | Inquiries from contact form, trial signup & WhatsApp |
| `members` | Gym members with membership tracking |
| `check_ins` | Daily attendance records |
| `whatsapp_messages` | WhatsApp chat history |
| `bot_responses` | AI chatbot training data |
| `knowledge_base` | RAG knowledge base for chatbot |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard → Settings → Environment Variables.

### Netlify

1. Connect your GitHub repo
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/.next`
4. Set environment variables in Netlify dashboard

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test admin login at `/admin`
- [ ] Check `og-image.svg` loads in social previews
- [ ] Verify dynamic gym name appears site-wide
- [ ] Test trial signup and contact forms
- [ ] Confirm WhatsApp integration (if configured)
- [ ] Test member creation from leads page
- [ ] Run Lighthouse audit for performance

---

## 👨‍💻 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

## 🤝 Support

For support, email hello@titanforge.pk or open an issue on GitHub.

---

<div align="center">
  <sub>Built with ❤️ for gym owners who want to go digital.</sub>
  <br/>
  <sub>© 2026 TitanForge Gym. All rights reserved.</sub>
</div>
