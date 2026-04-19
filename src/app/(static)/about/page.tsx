export const metadata = { title: "About" };

export default function About() {
  return (
    <article>
      <p className="section-number mb-4">About</p>
      <h1 className="display-hero">
        The smartest founder
        <br />
        <span className="italic-display text-[color:var(--gold)]">
          quietly organized the market.
        </span>
      </h1>
      <div className="mt-7 space-y-5 text-[16px] leading-[1.65] text-[color:var(--foreground-dim)]">
        <p>
          AI Credit Ladder is a curated, verified index of startup AI and cloud
          credits — built for the solo founder or tiny team shipping an AI
          product <em>before</em> they have funding.
        </p>
        <p>
          Every offer is checked against the vendor&apos;s own page. We separate
          official claim from community commentary, timestamp every check, and
          flag offers that drift stale.
        </p>
        <p>
          The product is organized as a ladder — from the credits you can claim
          today as a solo builder, to the programs that unlock once you
          incorporate, to the partner-gated ones that open with traction.
        </p>
      </div>
    </article>
  );
}
