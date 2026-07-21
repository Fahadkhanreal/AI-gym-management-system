import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Public Supabase client — uses anon key with RLS.
 * Use for public read-only operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase client — uses service_role key (bypasses RLS).
 * USE ONLY in authenticated admin API routes — NEVER expose to client.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
