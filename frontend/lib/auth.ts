import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Lazy auth client — created on first use so build-time does not crash.
 */

function createLazyAuthClient(): SupabaseClient {
  let client: SupabaseClient | null = null;
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (!client) {
        client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.SUPABASE_SERVICE_ROLE_KEY || ""
        );
      }
      return (client as any)[prop];
    },
  });
}

/**
 * Admin Supabase client for auth operations (lazy).
 */
export const supabaseAuth = createLazyAuthClient();

/**
 * Verify the bearer token from the Authorization header.
 * Returns the authenticated user or null.
 */
export async function verifyAdminAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Create an unauthorized response.
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
