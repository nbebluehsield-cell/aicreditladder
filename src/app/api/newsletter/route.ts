import { NextResponse, type NextRequest } from "next/server";
import { subscribeToNewsletter } from "@/app/actions/auth";

/**
 * Progressive-enhancement fallback for the home-page newsletter form.
 * Server Actions are the preferred path; this route handles raw
 * `<form action="/api/newsletter" method="post">` submissions so the
 * form still works when hydration hasn't completed.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await subscribeToNewsletter(null, formData);

  const origin = request.nextUrl.origin;
  const referer = request.headers.get("referer");
  let redirectTo: URL;
  try {
    const r = referer ? new URL(referer) : null;
    redirectTo =
      r?.origin === origin ? r : new URL("/", origin);
  } catch {
    redirectTo = new URL("/", origin);
  }
  if (result.ok) {
    redirectTo.searchParams.set("subscribed", "1");
  } else {
    redirectTo.searchParams.set("subscribe_err", result.error);
  }
  return NextResponse.redirect(redirectTo, { status: 303 });
}
