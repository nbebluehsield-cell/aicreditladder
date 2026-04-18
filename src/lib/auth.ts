import { createClient } from "@/lib/supabase/server";

/**
 * Session + authorization helpers. Always call these server-side
 * before rendering gated content or mutating data.
 */

export type SessionUser = {
  id: string;
  email: string;
};

/** Returns the authenticated user or null. Safe to call when Supabase env is unset. */
export async function getUser(): Promise<SessionUser | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) return null;
    return { id: data.user.id, email: data.user.email };
  } catch {
    return null;
  }
}

/** True when the current user is an admin per ADMIN_EMAILS env. */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const allowed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}

/** For server components that need a boolean for gated UI. */
export async function isAuthenticated(): Promise<boolean> {
  return (await getUser()) !== null;
}
