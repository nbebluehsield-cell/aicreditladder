export const metadata = { title: "Contact" };

/**
 * Contact — editorial pattern consistent with /auth/login and
 * /methodology. A stacked hero, then three labeled reasons to reach
 * out so a reader lands on the *right* inbox on the first try.
 */
export default function Contact() {
  return (
    <article>
      <p className="section-number mb-4">Contact</p>
      <h1 className="display-hero">
        Say
        <br />
        <span className="italic-display text-[color:var(--gold)]">
          hello.
        </span>
      </h1>

      <p className="mt-7 text-[16px] leading-[1.6] text-[color:var(--muted)]">
        We answer every message. Usually same day. Always from a human
        — never a ticketing system, never a bot.
      </p>

      <div className="mt-10 border-t border-[color:var(--rule-2)]">
        <Reason
          n="01"
          label="Tip a new offer"
          detail="Found a credit that should be on the ladder? Send the vendor page. We verify and credit you in the changelog."
          email="hello@aicreditladder.com"
        />
        <Reason
          n="02"
          label="Correct a listing"
          detail="Stale amount, changed eligibility, expired link — anything drifting. We re-check fast when readers flag."
          email="hello@aicreditladder.com"
        />
        <Reason
          n="03"
          label="Sponsor the ledger"
          detail="You run an AI or cloud credit program for early-stage founders. See the sponsor page for inventory."
          email="sponsor@aicreditladder.com"
        />
      </div>

      <p className="mt-10 text-[13px] text-[color:var(--muted)]">
        Press or partnerships: same address. Short is good.
      </p>
    </article>
  );
}

function Reason({
  n,
  label,
  detail,
  email,
}: {
  n: string;
  label: string;
  detail: string;
  email: string;
}) {
  return (
    <div className="flex items-baseline gap-5 border-b border-[color:var(--rule-2)] py-5 sm:gap-8">
      <span className="mono shrink-0 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold)]">
        § {n}
      </span>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div>
          <h3 className="display text-[20px] leading-tight">{label}</h3>
          <p className="mt-1 text-[14px] leading-[1.55] text-[color:var(--foreground-dim)]">
            {detail}
          </p>
        </div>
        <a
          href={`mailto:${email}`}
          className="mono editorial-link shrink-0 text-[11px] uppercase tracking-[0.2em] text-[color:var(--foreground-dim)] hover:text-[color:var(--gold)]"
        >
          {email} ↗
        </a>
      </div>
    </div>
  );
}
