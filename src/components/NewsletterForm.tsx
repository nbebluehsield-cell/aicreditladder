"use client";

import { useActionState } from "react";
import { Button } from "./ui/Button";
import { subscribeToNewsletter } from "@/app/actions/auth";

type Size = "compact" | "full";

/**
 * Newsletter form.
 *
 *   compact — single line band, used on the homepage digest rail
 *   full    — standalone page form with larger controls
 *
 * The consent text lives server-side in lib/consent and is stamped
 * onto every subscription row. We keep the visible form tight so it
 * reads as a utility, not a lead magnet.
 */
export function NewsletterForm({
  source = "newsletter_page",
  size = "full",
}: {
  source?: string;
  size?: Size;
}) {
  const [state, action, pending] = useActionState(subscribeToNewsletter, null);
  const compact = size === "compact";

  const fieldHeight = compact ? "h-11" : "h-14";
  const textSize = compact ? "text-[13px]" : "text-[14px]";
  const padding = compact ? "px-4" : "px-5";
  const buttonSize: "md" | "lg" = compact ? "md" : "lg";
  const wrapperMargin = compact ? "" : "mt-8";

  return (
    <>
      <form
        action={action}
        className={`flex flex-col gap-0 sm:flex-row sm:items-stretch ${wrapperMargin}`}
      >
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          name="email"
          required
          placeholder="founder@yourcompany.com"
          className={`mono ${fieldHeight} flex-1 border border-[color:var(--foreground)] bg-[color:var(--surface)] ${padding} ${textSize} text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus-ring sm:border-r-0`}
        />
        <input type="hidden" name="source" value={source} />
        <Button
          size={buttonSize}
          type="submit"
          aria-busy={pending}
          className={fieldHeight}
        >
          {pending ? "Subscribing…" : "Subscribe →"}
        </Button>
      </form>
      {state?.ok === true && (
        <p
          role="status"
          className="mono mt-3 border border-[color:var(--teal)] bg-[color:var(--teal-soft)] p-3 text-[12px] text-[color:var(--teal)]"
        >
          {state.message}
        </p>
      )}
      {state?.ok === false && (
        <p
          role="alert"
          className="mono mt-3 border border-[color:var(--gold)] bg-[color:var(--gold-soft)] p-3 text-[12px] text-[color:var(--gold)]"
        >
          {state.error}
        </p>
      )}
    </>
  );
}
