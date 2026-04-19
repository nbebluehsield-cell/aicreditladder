export const metadata = { title: "Terms" };

const LAST_UPDATED = "April 2026";

export default function Terms() {
  return (
    <article>
      <p className="section-number mb-3">Legal</p>
      <h1 className="display-h2">Terms.</h1>
      <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        Last updated {LAST_UPDATED}
      </p>

      <div className="mt-6 space-y-6 text-[15px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          These are the rules for using AI Credit Ladder. By using the site you
          accept them. If you don&apos;t, please close the tab — no hard
          feelings.
        </p>

        <Section title="What we are">
          <p>
            AI Credit Ladder is an editorial index of third-party credit
            programs. We do not issue credits, process applications, or have a
            commercial relationship with most of the programs listed. We link
            you to the official source and let you apply there.
          </p>
        </Section>

        <Section title="Accuracy">
          <p>
            We verify listings on a cadence (see the{" "}
            <a
              className="editorial-link text-[color:var(--gold)]"
              href="/methodology"
            >
              Methodology
            </a>{" "}
            page) and stamp each record with a last-verified date. Programs
            change terms without notice. Always confirm on the vendor&apos;s
            official page before committing time. We are not liable for
            decisions made based on stale or misread information.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            Sign-in is via magic link. You are responsible for the inbox you
            sign in with. Don&apos;t share links. If you suspect misuse, email
            us and we&apos;ll invalidate the session.
          </p>
        </Section>

        <Section title="Newsletter">
          <p>
            Subscribing is opt-in and you can leave at any time with the link
            in every email. We may occasionally include a labelled sponsor
            slot; it is always clearly marked.
          </p>
        </Section>

        <Section title="Acceptable use">
          <ul className="list-disc space-y-2 pl-5">
            <li>Don&apos;t scrape the full dataset. Use the public views as intended.</li>
            <li>Don&apos;t impersonate vendors or us.</li>
            <li>Don&apos;t use the site to break any law that applies to you.</li>
          </ul>
        </Section>

        <Section title="Sponsored content">
          <p>
            Any sponsored placement is labelled. Sponsorship does not buy a
            better verification status — every row, sponsored or not, is held
            to the same verification bar.
          </p>
        </Section>

        <Section title="Disclaimer">
          <p>
            The site is provided &ldquo;as is&rdquo;. We do not guarantee
            availability, accuracy, approval outcomes, or fitness for a
            particular purpose. We are not liable for indirect or consequential
            damages arising from use of the site, to the maximum extent
            permitted by law.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms. Material changes will be posted on this
            page with a new &ldquo;Last updated&rdquo; date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions:{" "}
            <a
              className="editorial-link text-[color:var(--gold)]"
              href="mailto:hello@aicreditladder.com"
            >
              hello@aicreditladder.com
            </a>
            .
          </p>
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display-h3 mb-2 text-[color:var(--foreground)]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
