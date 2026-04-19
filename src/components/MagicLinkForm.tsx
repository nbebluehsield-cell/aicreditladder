"use client";

import { useActionState } from "react";
import { Button } from "./ui/Button";
import { signInWithMagicLink } from "@/app/actions/auth";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/consent";

/**
 * Magic-link sign-in form with explicit newsletter opt-in. All work
 * happens in the `signInWithMagicLink` server action — this component
 * is client-side only for the `useActionState` UX (inline success /
 * error states without a page reload).
 */
export function MagicLinkForm({
  nextPath = "/explore",
}: {
  /** Where to send the user after they tap the email link (internal path only). */
  nextPath?: string;
}) {
  const [state, action, pending] = useActionState(signInWithMagicLink, null);

  return (
    <form
      action={action}
      className="mt-12 flex w-full flex-col items-center gap-5 text-center"
    >
      <input type="hidden" name="next" value={nextPath} />
      <div className="w-full">
        <label htmlFor="email" className="eyebrow mb-2 block text-center">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="founder@yourcompany.com"
          className="mono h-12 w-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-5 text-[13px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus:border-[color:var(--foreground)] focus-ring"
        />
      </div>

      <label className="mx-auto flex w-full max-w-[21rem] justify-center gap-3 text-left text-[12px] leading-[1.55] text-[color:var(--muted)]">
        <input
          type="checkbox"
          name="subscribe"
          defaultChecked
          className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--gold)]"
        />
        <span className="min-w-0">{NEWSLETTER_CONSENT_TEXT}</span>
      </label>

      <Button
        size="lg"
        type="submit"
        className="mt-1 w-full max-w-none shadow-[0_0_0_1px_rgba(224,78,47,0.12)]"
        aria-busy={pending}
      >
        {pending ? "Sending…" : "Send magic link →"}
      </Button>

      {state?.ok === true && (
        <p
          role="status"
          className="mono w-full border border-[color:var(--teal)] bg-[color:var(--teal-soft)] p-3 text-center text-[12px] leading-snug text-[color:var(--teal)]"
        >
          {state.message}
        </p>
      )}
      {state?.ok === false && (
        <p
          role="alert"
          className="mono w-full border border-[color:var(--gold)] bg-[color:var(--gold-soft)] p-3 text-center text-[12px] leading-snug text-[color:var(--gold)]"
        >
          {state.error}
        </p>
      )}

      <p className="eyebrow mt-0.5 max-w-[21rem] text-pretty text-center leading-relaxed">
        Magic link · No password · No spam · One-click unsubscribe
      </p>
    </form>
  );
}
