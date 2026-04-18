import { updateSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 uses `proxy.ts` (formerly `middleware.ts`). This runs
 * before every matched request and refreshes the Supabase session
 * cookies so server components read a live session.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Exclude static assets, the favicon, and image optimizer requests.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
