"use client";

import { useActionState } from "react";
import { Button } from "./ui/Button";
import { signInWithMagicLink, NEWSLETTER_CONSENT_TEXT } from "@/app/actions/auth";

/**
 * Magic-link sign-in form with explicit newsletter opt-in. All work
 * happens in the `signInWithMagicLink` server action — this component
 * is client-side only for the `useActionState` UX (inline success /
 * error states without a page reload).
 */
export function MagicLinkForm() {
  const [state, action, pending] = useActionState(signInWithMagicLink, null);

  return (
    <form action={action} className="mt-10 flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="eyebrow mb-2 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="founder@yourcompany.com"
          className="mono h-12 w-full rounded-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-5 text-[13px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-2)] focus-ring"
        />
      </div>

      <label className="flex items-start gap-3 text-[12px] text-[color:var(--muted)]">
        <input
          type="checkbox"
          name="subscribe"
          defaultChecked
          className="mt-0.5 h-4 w-4 accent-[color:var(--gold)]"
        />
        <span>{NEWSLETTER_CONSENT_TEXT}</span>
      </label>

      <Button size="lg" type="submit" className="mt-2" aria-busy={pending}>
        {pending ? "Sending…" : "Send magic link →"}
      </Button>

      {state?.ok === true && (
        <p
          role="status"
          className="mono rounded-md border border-[color:var(--teal)]/40 bg-[color:var(--teal-soft)] p-3 text-[12px] text-[color:var(--teal)]"
        >
          {state.message}
        </p>
      )}
      {state?.ok === false && (
        <p
          role="alert"
          className="mono rounded-md border border-[color:var(--crimson)]/40 bg-red-500/10 p-3 text-[12px] text-[color:var(--crimson)]"
        >
          {state.error}
        </p>
      )}

      <p className="eyebrow mt-1">
        Magic link · No password · No spam · One-click unsubscribe
      </p>
    </form>
  );
}
