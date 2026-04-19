"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--muted-2)]">
        Something broke
      </p>
      <h1 className="display mt-3 text-[clamp(22px,3.5vw,32px)] leading-tight text-[color:var(--foreground)]">
        We couldn&rsquo;t load this view.
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
        {error.digest ? `Ref: ${error.digest}` : "Try again or head home."}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="mono rounded-lg border border-[color:var(--gold)] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold-soft)]"
        >
          Retry
        </button>
        <Link
          href="/"
          className="text-[14px] text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--foreground)] hover:underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
