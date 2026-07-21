-- ============================================================================
-- TITANFORGE GYM — COMPLETE DATABASE SCHEMA
-- Run this ONCE in Supabase SQL Editor on the client's project
-- ============================================================================

-- 1. gym_settings
CREATE TABLE IF NOT EXISTS gym_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  tagline text,
  address text,
  phone text,
  whatsapp_number text,
  opening_time time,
  closing_time time,
  map_link text,
  instagram_url text DEFAULT '',
  twitter_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  hero_stat_members text DEFAULT '',
  hero_stat_years text DEFAULT '',
  hero_stat_award text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS gym_settings_singleton ON gym_settings ((true));

-- 2. pricing_plans
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL,
  price_quarterly numeric NOT NULL,
  price_yearly numeric NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  is_popular boolean DEFAULT false,
  cta_text text DEFAULT 'Join Now',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. programs
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration text,
  price numeric,
  category text,
  image_url text,
  icon_name text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. faqs
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  image_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_active boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. transformations
CREATE TABLE IF NOT EXISTS transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  before_value text,
  after_value text,
  duration text,
  story text,
  image_url text,
  before_image_url text DEFAULT '',
  after_image_url text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. benefits (Build for Greatness)
CREATE TABLE IF NOT EXISTS benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Dumbbell',
  image_url text,
  stat_value integer,
  stat_suffix text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. facilities (The Arena)
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Dumbbell',
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. trainers
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  image_url text,
  social_instagram text,
  social_twitter text,
  social_linkedin text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT '',
  source text DEFAULT 'contact-form',
  status text DEFAULT 'new',
  email text,
  age integer,
  gender text DEFAULT '',
  fitness_goal text DEFAULT '',
  experience_level text DEFAULT '',
  preferred_time text DEFAULT '',
  days_per_week integer,
  injuries text,
  consented boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. whatsapp_messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_number text NOT NULL,
  message text NOT NULL,
  reply text,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'replied', 'archived')),
  is_read boolean DEFAULT false,
  is_auto_replied boolean DEFAULT false,
  auto_reply_sent_at timestamptz,
  replied_at timestamptz,
  replied_by uuid,
  webhook_raw jsonb,
  created_at timestamptz DEFAULT now()
);

-- 12. bot_responses
CREATE TABLE IF NOT EXISTS bot_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keywords text[] NOT NULL,
  response_text text NOT NULL,
  is_active boolean DEFAULT true,
  match_type text DEFAULT 'any' CHECK (match_type IN ('any', 'all')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 13. knowledge_base (AI RAG)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE gym_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read for active content
CREATE POLICY "Public read" ON gym_settings FOR SELECT USING (true);
CREATE POLICY "Public read active" ON pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read approved" ON testimonials FOR SELECT USING (is_active = true AND is_approved = true);
CREATE POLICY "Public read active" ON transformations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON benefits FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON trainers FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON knowledge_base FOR SELECT USING (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin all" ON gym_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON pricing_plans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON transformations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON benefits FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON trainers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin view" ON whatsapp_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON whatsapp_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert" ON whatsapp_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all" ON bot_responses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON knowledge_base FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
SELECT 'gallery', 'gallery', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery');

-- Storage policies (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete gallery" ON storage.objects;

CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Auth upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete gallery" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
