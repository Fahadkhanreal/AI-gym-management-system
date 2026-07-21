-- ============================================================================
-- TitanForge Gym — v2: Benefits, Facilities, Trainers, Transformations
-- ============================================================================

-- 9. benefits (Build for Greatness cards)
CREATE TABLE benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Dumbbell',
  stat_value integer,
  stat_suffix text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. facilities (The Arena / World-Class Facilities)
CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Dumbbell',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. trainers (Meet the Team / Elite Coaches)
CREATE TABLE trainers (
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

-- 12. transformations (Real Results)
CREATE TABLE transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  before_value text,
  after_value text,
  duration text,
  story text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active benefits" ON benefits FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage benefits" ON benefits FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active facilities" ON facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage facilities" ON facilities FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active trainers" ON trainers FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage trainers" ON trainers FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active transformations" ON transformations FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage transformations" ON transformations FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Seed Data
-- ============================================================================

-- Benefits
INSERT INTO benefits (title, description, icon_name, stat_value, stat_suffix, sort_order) VALUES
('Premium Equipment', 'State-of-the-art machines and free weights from top brands.', 'Dumbbell', 200, '+ machines', 1),
('Expert Trainers', 'Certified coaches with 10+ years of transformation experience.', 'Users', 50, '+ coaches', 2),
('Diverse Programs', 'From strength to mobility — something for every goal.', 'Target', 12, ' programs', 3),
('Strong Community', 'Join 5,000+ members who train, grow, and forge together.', 'Heart', 5000, '+ members', 4),
('Proven Results', 'Average 15kg transformation in the first 90 days.', 'Flame', 15, 'kg avg', 5),
('Elite Atmosphere', 'Curated lighting, sound, and energy for peak performance.', 'Zap', 24, '/7 energy', 6);

-- Facilities
INSERT INTO facilities (name, description, icon_name, sort_order) VALUES
('Free Weight Zone', 'Olympic platforms, squat racks, and every dumbbell you need.', 'Dumbbell', 1),
('Cardio Arena', 'Treadmills, bikes, rowers, and stair climbers with personal screens.', 'Heart', 2),
('Functional Training', 'Battle ropes, kettlebells, sleds, and turf for explosive work.', 'Box', 3),
('Recovery Suite', 'Cryotherapy, compression, and stretching area for post-training.', 'Waves', 4),
('Strength Lab', 'Plate-loaded, cable, and selectorized machines for all levels.', 'Weight', 5);

-- Trainers
INSERT INTO trainers (name, role, bio, sort_order) VALUES
('Alex Rivera', 'Head Strength Coach', '10+ years transforming athletes. Specialist in powerlifting and functional strength.', 1),
('Sarah Chen', 'CrossFit Lead', 'CrossFit Level 4 coach. Regional competitor and nutrition specialist.', 2),
('Marcus Johnson', 'Mobility & Recovery', 'Yoga-certified, physiotherapy background. Keeps champions injury-free.', 3),
('Priya Sharma', 'Womens Fitness Coach', 'Empowering women through strength. Pre/post-natal fitness certified.', 4);

-- Transformations
INSERT INTO transformations (name, before_value, after_value, duration, story, sort_order) VALUES
('Ahmed R.', '95kg', '68kg', '6 months', 'I never thought I could lose 27kg. The trainers at TitanForge designed a plan that worked with my lifestyle, not against it.', 1),
('Zara H.', '72kg', '58kg', '4 months', 'The women''s training program was a game-changer. I gained strength, confidence, and a whole new community.', 2),
('Usman K.', 'Bench: 60kg', 'Bench: 140kg', '8 months', 'Came in as a beginner, left as a powerlifter. The coaching here is next level — form first, always.', 3);
