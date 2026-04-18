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

  const referer = request.headers.get("referer") ?? "/";
  const redirectTo = new URL(referer);
  if (result.ok) {
    redirectTo.searchParams.set("subscribed", "1");
  } else {
    redirectTo.searchParams.set("subscribe_err", result.error);
  }
  return NextResponse.redirect(redirectTo, { status: 303 });
}
