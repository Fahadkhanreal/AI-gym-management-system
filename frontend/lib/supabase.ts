import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazy Supabase clients — created on first use so that build-time
 * (where env vars may be undefined) does not crash at module evaluation.
 *
 * Uses Proxy objects so existing `import { supabase, supabaseAdmin }`
 * continues to work without modifying 50+ API route files.
 */

function createLazyClient(getUrl: () => string, getKey: () => string): SupabaseClient {
  let client: SupabaseClient | null = null;
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (!client) {
        client = createClient(getUrl(), getKey());
      }
      return (client as any)[prop];
    },
  });
}

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const getAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const getServiceRoleKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Public Supabase client — uses anon key with RLS.
 * Lazy Proxy — first property access creates the real client.
 */
export const supabase = createLazyClient(getSupabaseUrl, getAnonKey);

/**
 * Admin Supabase client — uses service_role key (bypasses RLS).
 * Lazy Proxy — first property access creates the real client.
 */
export const supabaseAdmin = createLazyClient(getSupabaseUrl, getServiceRoleKey);
