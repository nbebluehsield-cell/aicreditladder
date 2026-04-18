export const metadata = { title: "How we verify — AI Credit Ladder" };

export default function Methodology() {
  return (
    <article>
      <p className="section-number mb-4">Methodology</p>
      <h1 className="display-h2">How we verify.</h1>
      <div className="mt-10 space-y-6 text-[16px] leading-[1.7] text-[color:var(--foreground-dim)]">
        <p>
          Every listing is sourced from the vendor&apos;s own page. We record a
          source URL on each offer and re-check it on a cadence:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Featured offers — weekly</li>
          <li>Active offers — monthly minimum</li>
          <li>Sponsored placements — before and during the campaign</li>
        </ul>
        <p>
          We check URL availability, content hash changes, keyword drift (credit
          amount, eligibility, expired language), and broken application links.
          When something changes, we mark the offer stale and review.
        </p>
        <p>
          Confidence meters show our certainty per listing. Community experience
          reports are presented as commentary — never as claim.
        </p>
      </div>
    </article>
  );
}
