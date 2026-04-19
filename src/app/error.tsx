"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

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
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Button
          type="button"
          variant="default"
          size="md"
          className="mono uppercase tracking-[0.14em]"
          onClick={() => reset()}
        >
          Retry
        </Button>
        <Button variant="outline" size="md" className="normal-case" asChild>
          <Link href="/" prefetch>
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
