"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/consent";
import { SITE_URL } from "@/lib/site-url";

type ActionState =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Sends a magic-link email. If `subscribeToNewsletter` is true we
 * capture an explicit consent record alongside it.
 */
export async function signInWithMagicLink(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const subscribe = formData.get("subscribe") === "on";

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ok: false,
      error:
        "Email sign-in is not configured yet. Add Supabase credentials to .env.local.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: error.message };

  if (subscribe) {
    try {
      const svc = createServiceClient();
      await svc.from("newsletter_subscribers").upsert(
        {
          email,
          consent_text: NEWSLETTER_CONSENT_TEXT,
          source: "auth_signin",
          consented_at: new Date().toISOString(),
          unsubscribed_at: null,
        },
        { onConflict: "email" },
      );
    } catch {
      // Subscribe is best-effort at signin; user can subscribe again later.
    }
  }

  return {
    ok: true,
    message: `Check ${email} for a sign-in link.`,
  };
}

/**
 * Direct newsletter signup (no auth). Used by the home / newsletter
 * page forms. Still writes explicit consent.
 */
export async function subscribeToNewsletter(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "newsletter_page");

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      error:
        "Newsletter subscription is not configured yet. Add SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  try {
    const svc = createServiceClient();
    const { error } = await svc.from("newsletter_subscribers").upsert(
      {
        email,
        consent_text: NEWSLETTER_CONSENT_TEXT,
        source,
        consented_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    );
    if (error) return { ok: false, error: error.message };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Subscription failed.",
    };
  }

  return {
    ok: true,
    message: `You're in. Digest lands Sunday.`,
  };
}

export async function signOut(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
