"use client";

import { useActionState } from "react";
import { Button } from "./ui/Button";
import { subscribeToNewsletter } from "@/app/actions/auth";

export function NewsletterForm({ source = "newsletter_page" }: { source?: string }) {
  const [state, action, pending] = useActionState(subscribeToNewsletter, null);

  return (
    <>
      <form action={action} className="mt-10 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="founder@yourcompany.com"
          className="mono h-12 flex-1 rounded-full border border-[color:var(--rule-2)] bg-[color:var(--surface)] px-5 text-[13px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-2)] focus-ring"
        />
        <input type="hidden" name="source" value={source} />
        <Button size="lg" type="submit" aria-busy={pending}>
          {pending ? "Subscribing…" : "Subscribe →"}
        </Button>
      </form>
      {state?.ok === true && (
        <p
          role="status"
          className="mono mt-3 rounded-md border border-[color:var(--teal)]/40 bg-[color:var(--teal-soft)] p-3 text-[12px] text-[color:var(--teal)]"
        >
          {state.message}
        </p>
      )}
      {state?.ok === false && (
        <p
          role="alert"
          className="mono mt-3 rounded-md border border-[color:var(--crimson)]/40 bg-red-500/10 p-3 text-[12px] text-[color:var(--crimson)]"
        >
          {state.error}
        </p>
      )}
    </>
  );
}
