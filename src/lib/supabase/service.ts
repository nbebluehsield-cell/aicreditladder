import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS. Use only for:
 *   - admin-only mutations (verified by the admin allowlist),
 *   - newsletter subscribe writes,
 *   - internal verification workflows.
 *
 * Never import this into a client component.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service-role client requested but SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL are not configured.",
    );
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
