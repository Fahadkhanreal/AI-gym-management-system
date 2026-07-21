-- ============================================================================
-- TitanForge Gym — Seed Data
-- ============================================================================

-- Gym Settings
INSERT INTO gym_settings (gym_name, tagline, address, phone, whatsapp_number, opening_time, closing_time)
VALUES (
  'TitanForge Gym',
  'Forge Your Legacy — World-class training. Next-level results.',
  '123 Main Boulevard, Gulshan-e-Iqbal, Karachi, Pakistan',
  '+92 300 1234567',
  '923001234567',
  '06:00',
  '23:00'
);

-- Pricing Plans
INSERT INTO pricing_plans (name, description, price_monthly, price_quarterly, price_yearly, features, is_popular, cta_text, sort_order) VALUES
(
  'Basic',
  'Everything you need to start your fitness journey.',
  2999, 7999, 29999,
  '[{"text": "Gym access (6 AM — 11 PM)", "included": true}, {"text": "Cardio & free weight zone", "included": true}, {"text": "Locker room access", "included": true}, {"text": "Personal training session", "included": false}, {"text": "Nutrition consultation", "included": false}, {"text": "Priority class booking", "included": false}]',
  false, 'Start Free Trial', 1
),
(
  'Warrior',
  'Our most popular plan for dedicated athletes.',
  4999, 12999, 49999,
  '[{"text": "Unlimited gym access", "included": true}, {"text": "All equipment zones", "included": true}, {"text": "Locker & shower access", "included": true}, {"text": "4 Personal training sessions/month", "included": true}, {"text": "Nutrition consultation", "included": true}, {"text": "Priority class booking", "included": true}]',
  true, 'Join Warrior Plan', 2
),
(
  'Titan',
  'The ultimate premium experience with full personalization.',
  7999, 19999, 79999,
  '[{"text": "24/7 Premium access", "included": true}, {"text": "All zones + VIP area", "included": true}, {"text": "Premium locker & spa access", "included": true}, {"text": "Unlimited personal training", "included": true}, {"text": "Monthly nutrition plan", "included": true}, {"text": "Exclusive Titan events", "included": true}]',
  false, 'Go Titan', 3
);

-- Programs
INSERT INTO programs (title, description, duration, price, category, icon_name, sort_order) VALUES
('Strength Training', 'Build raw power with compound lifts, progressive overload, and structured strength programming.', '12 weeks', 0, 'strength', 'Dumbbell', 1),
('Hypertrophy', 'Sculpt your physique with science-based volume training and aesthetic muscle development.', '12 weeks', 0, 'hypertrophy', 'Armchair', 2),
('CrossFit', 'High-intensity functional movements combining weightlifting, gymnastics, and metabolic conditioning.', '8 weeks', 0, 'crossfit', 'Flame', 3),
('Mobility & Recovery', 'Improve flexibility, reduce injury risk, and accelerate recovery with guided mobility work.', '4 weeks', 0, 'mobility', 'Heart', 4),
('Cardio & Endurance', 'Boost cardiovascular health and stamina through structured running, rowing, and HIIT programs.', '8 weeks', 0, 'cardio', 'Heart', 5),
('Personal Training', 'One-on-one coaching with certified trainers. Customized programs, form correction, and accountability.', 'Per session', 1500, 'personal', 'User', 6);

-- FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('What are your gym timings?', 'We are open from 6:00 AM to 11:00 PM, seven days a week. Titan members get 24/7 access.', 'general', 1),
('How much does a membership cost?', 'Our plans start from PKR 2,999/month for Basic, PKR 4,999/month for Warrior (most popular), and PKR 7,999/month for Titan. We also offer quarterly and yearly discounts.', 'pricing', 2),
('Is there a free trial?', 'Yes! We offer a complimentary 3-day trial pass so you can experience our facilities and training environment before committing.', 'membership', 3),
('What equipment do you have?', 'We have Olympic platforms, squat racks, dumbbells up to 150 lbs, cable machines, cardio equipment, functional training rigs, and a dedicated recovery suite.', 'facilities', 4),
('Do you offer personal training?', 'Absolutely! Our certified trainers offer one-on-one sessions starting from PKR 1,500/session. Warrior and Titan plans include personal training sessions.', 'training', 5),
('Can I freeze my membership?', 'Yes, you can freeze your membership for up to 30 days at no extra cost. Longer freezes are available for medical reasons with a doctor''s note.', 'membership', 6),
('Is there parking available?', 'Yes, we have a dedicated parking area with 50+ spots for members. Valet parking is available for Titan members.', 'facilities', 7),
('What is the cancellation policy?', 'You can cancel anytime with a 30-day notice. No hidden fees. We believe in earning your business every month.', 'membership', 8);

-- Testimonials
INSERT INTO testimonials (name, message, rating, sort_order) VALUES
('Ahmed R.', 'Joined TitanForge 6 months ago and it has completely transformed my life. Lost 15 kg and gained confidence I never knew I had. The trainers are world-class!', 5, 1),
('Sara K.', 'The Warrior plan is incredible value. The personal training sessions have helped me perfect my form and see results I never got from working out alone.', 5, 2),
('Usman T.', 'Best gym in Karachi hands down. The equipment is top-notch, facilities are always clean, and the community is amazing. Worth every penny.', 5, 3),
('Zara M.', 'I was intimidated to join a gym but the TitanForge team made me feel welcome from day one. The female trainers are fantastic and the atmosphere is unbeatable.', 5, 4);

-- Bot Responses (WhatsApp auto-reply keywords)
INSERT INTO bot_responses (keywords, response_text, sort_order) VALUES
(ARRAY['fees', 'price', 'membership', 'cost', 'plan', 'pricing'], '🏋️ Our membership plans:\n\n🔥 Basic — PKR 2,999/month (Gym access + cardio zone)\n⚡ Warrior — PKR 4,999/month (Most popular! Includes PT sessions)\n👑 Titan — PKR 7,999/month (Premium + unlimited PT)\n\nReady to start? Visit us or reply "trial" for a FREE 3-day pass! 💪', 1),
(ARRAY['timing', 'open', 'close', 'hour', 'time'], '⏰ TitanForge Gym Timings:\n\nMonday — Sunday: 6:00 AM — 11:00 PM\n👑 Titan Members: 24/7 access\n\nWe''re open every day of the year! 🎯', 2),
(ARRAY['location', 'address', 'map', 'where'], '📍 TitanForge Gym\n\n123 Main Boulevard, Gulshan-e-Iqbal, Karachi\n\n📱 WhatsApp: 0300 1234567\n🅿️ Free parking available\n\nSee you at the gym! 💪', 3),
(ARRAY['program', 'training', 'class', 'workout'], '🏆 Our Training Programs:\n\n💪 Strength Training — 12 weeks\n🔥 Hypertrophy — 12 weeks\n⚡ CrossFit — 8 weeks\n🧘 Mobility & Recovery — 4 weeks\n❤️ Cardio & Endurance — 8 weeks\n👤 Personal Training — Per session\n\nReply with program name for details!', 4);
