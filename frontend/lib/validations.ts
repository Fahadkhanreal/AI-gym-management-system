import { z } from "zod";

// ============================================================================
// Auth
// ============================================================================
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============================================================================
// Gym Settings
// ============================================================================
export const gymSettingsSchema = z.object({
  gym_name: z.string().min(1).optional(),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp_number: z.string().optional(),
  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
  map_link: z.string().url().optional().or(z.literal("")),
});

// ============================================================================
// Pricing Plans
// ============================================================================
export const pricingPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price_monthly: z.number().positive("Monthly price must be positive"),
  price_quarterly: z.number().positive("Quarterly price must be positive"),
  price_yearly: z.number().positive("Yearly price must be positive"),
  features: z.array(z.object({
    text: z.string(),
    included: z.boolean(),
  })).optional(),
  is_popular: z.boolean().optional(),
  cta_text: z.string().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// ============================================================================
// Programs
// ============================================================================
export const programSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().positive().optional().or(z.literal(0)),
  category: z.string().optional(),
  image_url: z.string().optional(),
  icon_name: z.string().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// ============================================================================
// FAQs
// ============================================================================
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// ============================================================================
// Testimonials
// ============================================================================
export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  image_url: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// ============================================================================
// WhatsApp
// ============================================================================
export const whatsappReplySchema = z.object({
  message_id: z.string().uuid("Invalid message ID"),
  reply_text: z.string().min(1, "Reply text is required"),
});
