import { CONTACT_EMAIL } from "@/lib/contact-email";

export const metadata = { title: "Privacy" };

const LAST_UPDATED = "April 2026";

export default function Privacy() {
  return (
    <article>
      <p className="section-number mb-3">Legal</p>
      <h1 className="display-h2">Privacy.</h1>
      <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        Last updated {LAST_UPDATED}
      </p>

      <div className="mt-6 space-y-6 text-[15px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          This page explains what AI Credit Ladder collects, how we use it, and
          the choices you have. We keep it plain because it should be
          understandable without a lawyer.
        </p>

        <Section title="What we collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[color:var(--foreground)]">Email</strong>{" "}
              — when you sign in with a magic link or subscribe to the
              newsletter. We store the address, the consent text you agreed to,
              and the signup timestamp.
            </li>
            <li>
              <strong className="text-[color:var(--foreground)]">
                Usage data
              </strong>{" "}
              — aggregate page views and click events (e.g. which offers get
              viewed). We do not build advertising profiles from this.
            </li>
            <li>
              <strong className="text-[color:var(--foreground)]">
                Authentication cookies
              </strong>{" "}
              — required to keep you signed in. Handled by Supabase Auth.
            </li>
          </ul>
        </Section>

        <Section title="What we do with it">
          <ul className="list-disc space-y-2 pl-5">
            <li>Deliver the site and the weekly newsletter you opted into.</li>
            <li>Unlock the gated fields on offer pages for signed-in users.</li>
            <li>
              Measure what is read and clicked so we know which listings are
              useful.
            </li>
            <li>
              We do not sell your email, ever. We do not rent it. We do not
              cross-sell it to third parties.
            </li>
          </ul>
        </Section>

        <Section title="Third parties">
          <p>
            Our stack includes Supabase (database and auth), Vercel (hosting),
            and — when enabled — Google AdSense for ad inventory and an email
            sender (Resend or Postmark) for transactional mail. These
            providers see only what they need to deliver their service.
          </p>
          <p>
            External sites we link to (vendor credit programs) have their own
            policies. We do not control them.
          </p>
        </Section>

        <Section title="Cookies & advertising">
          <p>
            If and when AdSense is enabled, it may use cookies or similar
            technologies to personalise ads, and you can opt out via Google&apos;s{" "}
            <a
              className="editorial-link text-[color:var(--gold)]"
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Ad Settings
            </a>
            . Strictly-necessary cookies (auth) cannot be disabled without
            losing the ability to sign in.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>Unsubscribe from any newsletter with the link in the email.</li>
            <li>Request a full export or deletion of your data — email us.</li>
            <li>Sign out at any time via the header menu.</li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            Questions go to{" "}
            <a
              className="editorial-link text-[color:var(--gold)]"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            . We answer within a few business days.
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
