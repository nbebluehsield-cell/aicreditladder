import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

const ABOUT_PATH = "/about";

export const metadata: Metadata = {
  title: {
    absolute:
      "About — verified startup AI & cloud credits | AI Credit Ladder",
  },
  description:
    "Why AI Credit Ladder exists: one curated, verified index of startup AI API, IDE, and cloud credits for solo founders and small teams — sourced from official vendor pages, not forums or hearsay.",
  alternates: { canonical: `${SITE_URL}${ABOUT_PATH}` },
  openGraph: {
    url: `${SITE_URL}${ABOUT_PATH}`,
    title: "About AI Credit Ladder — verified credits for solo founders",
    description:
      "We built a single place to find real startup credits: checked against vendor sites, timestamped, and organized from easy claims to partner-gated programs.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About AI Credit Ladder",
    description:
      "Verified startup AI and cloud credits in one directory — built for founders before funding.",
  },
};

export default function About() {
  const year = new Date().getFullYear();

  return (
    <article>
      <p className="section-number mb-4">About</p>
      <h1 className="display-hero">
        Founders shouldn&apos;t rebuild
        <br />
        <span className="italic-display text-[color:var(--gold)]">
          the credit spreadsheet alone.
        </span>
      </h1>
      <div className="mt-7 space-y-5 text-[16px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          <strong className="font-medium text-[color:var(--foreground)]">
            AI Credit Ladder exists
          </strong>{" "}
          because startup AI and cloud credits are scattered across dozens of
          vendor sites, program PDFs, and blog posts — and solo founders do not
          have time to chase stale amounts or broken links while they ship.
        </p>
        <p>
          This site is a{" "}
          <strong className="font-medium text-[color:var(--foreground)]">
            curated, verified index
          </strong>{" "}
          of programs you can actually apply for: AI APIs, copilots, IDEs, and
          cloud credits aimed at early-stage builders, especially those working
          in English-language markets worldwide. Every listing is checked against
          the vendor&apos;s own official page; we separate that from community
          commentary, timestamp each review, and surface when an offer looks
          out of date.
        </p>
        <p>
          The experience is organized as a{" "}
          <strong className="font-medium text-[color:var(--foreground)]">
            ladder
          </strong>
          : credits you can claim soon as a solo builder, programs that open
          after you incorporate, and partner- or traction-gated options further
          up — so you can move in order instead of guessing where to start.
        </p>
      </div>

      <p className="mono mt-12 border-t border-[color:var(--rule-2)] pt-8 text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted-2)]">
        © {year} AI Credit Ladder. All rights reserved.
      </p>
    </article>
  );
}
