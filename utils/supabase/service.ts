import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Server-only client using the service role key. Bypasses RLS — use only in
 * trusted server code (e.g. Server Actions) after validating input.
 * Never import this from client components or expose SUPABASE_SERVICE_ROLE_KEY.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
