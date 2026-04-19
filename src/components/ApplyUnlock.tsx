"use client";

import { useActionState, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { signInWithMagicLink } from "@/app/actions/auth";

/**
 * Gated apply CTA.
 *
 * Authed reader → direct outbound claim button.
 *
 * Anonymous reader → expand email, send Supabase magic link only. The
 * outbound apply button appears only after `authed` is true (session from
 * the email link). `next` is sent so the callback returns to this offer.
 */
export function ApplyUnlock({
  authed,
  applyUrl,
  vendor,
}: {
  authed: boolean;
  applyUrl: string;
  vendor: string;
}) {
  const [state, action, pending] = useActionState(signInWithMagicLink, null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (authed) {
    return (
      <Button
        href={applyUrl}
        size="md"
        className="w-full min-h-12 text-[12.5px] sm:min-h-11"
      >
        Apply on {vendor} →
      </Button>
    );
  }

  const sent = state?.ok === true;

  return (
    <div className="flex flex-col gap-3">
      {!open && !sent && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-5 text-[12.5px] font-medium text-black transition hover:brightness-110 active:scale-[0.99] focus-ring sm:min-h-11"
          >
            Unlock apply link <span aria-hidden>→</span>
          </button>
          <p className="text-[11.5px] leading-[1.5] text-[color:var(--muted)]">
            One-click magic link. No password. We&rsquo;ll bring you right back
            to this claim.
          </p>
        </>
      )}

      {open && !sent && (
        <form action={action} className="flex flex-col gap-2.5">
          <input type="hidden" name="next" value={pathname} />
          <label htmlFor="unlock-email" className="sr-only">
            Email
          </label>
          <input
            id="unlock-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            autoFocus
            placeholder="founder@yourcompany.com"
            className="mono h-11 w-full rounded-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-4 text-[13px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-2)] focus-ring"
          />
          <input type="hidden" name="subscribe" value="on" />
          <button
            type="submit"
            aria-busy={pending}
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-5 text-[12.5px] font-medium text-black transition hover:brightness-110 active:scale-[0.99] focus-ring disabled:opacity-60"
            disabled={pending}
          >
            {pending ? "Sending…" : "Send magic link →"}
          </button>
          <p className="text-[11px] leading-[1.5] text-[color:var(--muted-2)]">
            Magic link · No password · One-click unsubscribe anytime
          </p>
          {state?.ok === false && (
            <p
              role="alert"
              className="mono rounded-md border border-[color:var(--gold)] bg-[color:var(--gold-soft)] p-2.5 text-[11.5px] text-[color:var(--gold-bright)]"
            >
              {state.error}
            </p>
          )}
        </form>
      )}

      {sent && (
        <p
          role="status"
          className="mono rounded-md border border-[color:var(--teal)] bg-[color:var(--teal-soft)] p-3 text-[11.5px] leading-[1.55] text-[color:var(--teal)]"
        >
          {state.message}{" "}
          <span className="text-[color:var(--foreground-dim)]">
            Open that email and tap the sign-in link. After you sign in,
            you&rsquo;ll land back here — then the apply button appears.
          </span>
        </p>
      )}
    </div>
  );
}
