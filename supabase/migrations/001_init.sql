-- ============================================================================
-- TitanForge Gym — Initial Schema Migration
-- 8 tables + RLS policies + Storage bucket
-- ============================================================================

-- 1. gym_settings (single-row configuration)
CREATE TABLE gym_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  tagline text,
  address text,
  phone text,
  whatsapp_number text,
  opening_time time,
  closing_time time,
  map_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure only one row via unique constraint
CREATE UNIQUE INDEX gym_settings_singleton ON gym_settings ((true));

-- 2. pricing_plans
CREATE TABLE pricing_plans (
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
CREATE TABLE programs (
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
CREATE TABLE faqs (
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
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  image_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. gallery
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  category text,
  caption text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 7. whatsapp_messages
CREATE TABLE whatsapp_messages (
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

-- 8. bot_responses
CREATE TABLE bot_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keywords text[] NOT NULL,
  response_text text NOT NULL,
  is_active boolean DEFAULT true,
  match_type text DEFAULT 'any' CHECK (match_type IN ('any', 'all')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Gym settings: public read, authenticated write
ALTER TABLE gym_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view gym_settings" ON gym_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage gym_settings" ON gym_settings FOR ALL USING (auth.role() = 'authenticated');

-- Pricing plans: public read only active, admin full access
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active pricing_plans" ON pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage pricing_plans" ON pricing_plans FOR ALL USING (auth.role() = 'authenticated');

-- Programs: public read only active, admin full access
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage programs" ON programs FOR ALL USING (auth.role() = 'authenticated');

-- FAQs: public read only active, admin full access
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials: public read only active, admin full access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Gallery: public read only active, admin full access
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active gallery" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

-- WhatsApp messages: no public access, admin can read/update
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view whatsapp_messages" ON whatsapp_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update whatsapp_messages" ON whatsapp_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can insert whatsapp_messages" ON whatsapp_messages FOR INSERT WITH CHECK (true);

-- Bot responses: no public access, admin full access
ALTER TABLE bot_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can manage bot_responses" ON bot_responses FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKET: gallery
-- ============================================================================
-- Execute via Supabase Dashboard or SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
--
-- Storage RLS policies:
-- CREATE POLICY "Public can view gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
-- CREATE POLICY "Authenticated can upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated can delete gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
