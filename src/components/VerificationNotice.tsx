import Link from "next/link";

/**
 * Pre-launch honesty strip. Very subtle — a single line, top of page,
 * typographic only. No urgent dot, no panic color.
 */
export function VerificationNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--rule)] bg-[color:var(--background-2)] px-6 py-2">
        <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Pre-launch · Data under human verification — apply via official links only
        </p>
        <Link
          href="/methodology"
          className="editorial-link text-[11px] text-[color:var(--gold)]"
        >
          Methodology →
        </Link>
      </div>
    );
  }
  return (
    <div className="border-b border-[color:var(--rule)] bg-[color:var(--background-2)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[color:var(--foreground-dim)]">
          <span className="italic-display text-[color:var(--gold)]">Notice ·</span>
          <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
            Pre-launch edition
          </span>
          <span className="hidden sm:inline">
            Offers are sourced from public program pages and under human
            verification. Always apply via the official link.
          </span>
          <span className="sm:hidden">
            Offers under verification. Apply via official links.
          </span>
        </p>
        <Link
          href="/methodology"
          className="editorial-link shrink-0 text-[11px] text-[color:var(--gold)]"
        >
          How we verify →
        </Link>
      </div>
    </div>
  );
}
