import { NewsletterForm } from "@/components/NewsletterForm";

/**
 * Sunday Digest — a quiet subscription band for the homepage.
 *
 * The promise is precise: one email a week, Sundays, three to five
 * freshly verified programs. Explicit cadence lowers the subscribe
 * barrier — people sign up for "every Sunday" more readily than for
 * "our newsletter."
 *
 * Visual grammar
 * ──────────────
 * - Single-line editorial band (like a publication footer)
 * - Mono cadence tag · italic serif promise · compact email field
 * - Sits above the site signature, below the ladder
 * - No exclamation marks. No count-ups. No social-proof clutter.
 */
export function SundayDigest() {
  return (
    <section
      aria-label="Sunday digest"
      className="border-t border-[color:var(--rule)]"
    >
      <div className="mx-auto w-full max-w-[1560px] page-gutter-x py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <p className="mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
              Sunday digest
            </p>
            <p className="mt-1.5 text-[16px] leading-[1.4] text-[color:var(--foreground)] sm:text-[17px]">
              One email,{" "}
              <span className="italic-display text-[color:var(--foreground-dim)]">
                every Sunday
              </span>
              . Three to five freshly verified programs. No pitch decks, no
              hot takes, no other days.
            </p>
          </div>

          <NewsletterForm source="home_sunday_digest" size="compact" />
        </div>
      </div>
    </section>
  );
}
