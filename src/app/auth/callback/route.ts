import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/safe-path";

/**
 * Magic-link callback. Supabase appends `code` when the user clicks
 * their email link; we exchange it for a session and redirect to
 * `next` (default `/explore`). `next` must be a safe internal path.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeInternalPath(url.searchParams.get("next"));

  if (!code || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.redirect(new URL("/auth/login?err=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?err=${encodeURIComponent(error.message)}`, url.origin),
    );
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
