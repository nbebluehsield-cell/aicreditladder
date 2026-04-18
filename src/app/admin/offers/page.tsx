import Link from "next/link";
import { Container } from "@/components/Container";
import { Chip } from "@/components/ui/Chip";
import { SEED_OFFERS } from "@/data/seed";

export const metadata = { title: "Offers — Admin · AI Credit Ladder" };

export default function AdminOffersList() {
  const offers = [...SEED_OFFERS].sort((a, b) => {
    // unverified first, then by slug
    const av = a.last_verified_at ? 1 : 0;
    const bv = b.last_verified_at ? 1 : 0;
    return av - bv || a.slug.localeCompare(b.slug);
  });

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="section-number mb-3">Offers</p>
          <h1 className="display-h2">Verification queue.</h1>
          <p className="mt-3 max-w-xl text-[13px] text-[color:var(--muted)]">
            Offers without a <code>last_verified_at</code> need to be opened
            against their official page, confirmed, and marked verified.
          </p>
        </div>
        <span className="mono text-[11px] text-[color:var(--muted)]">
          {offers.length} total
        </span>
      </div>

      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[color:var(--rule-2)] text-[color:var(--muted)]">
            <Th>Offer</Th>
            <Th>Vendor</Th>
            <Th>Value</Th>
            <Th>Status</Th>
            <Th>Last verified</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => (
            <tr
              key={o.id}
              className="border-b border-[color:var(--rule)] hover:bg-[color:var(--surface)]/50"
            >
              <Td>
                <p className="display text-[16px]">{o.title}</p>
                <p className="mono text-[10.5px] text-[color:var(--muted-2)]">
                  {o.slug}
                </p>
              </Td>
              <Td>
                <span className="text-[color:var(--foreground-dim)]">{o.vendor}</span>
              </Td>
              <Td>
                <span className="num text-[color:var(--gold)]">
                  {o.value_display}
                </span>
              </Td>
              <Td>
                {o.last_verified_at ? (
                  <Chip tone="success" mono>Verified</Chip>
                ) : (
                  <Chip tone="danger" mono>Unverified</Chip>
                )}
              </Td>
              <Td>
                <span className="mono text-[11px] text-[color:var(--muted)]">
                  {o.last_verified_at ?? "—"}
                </span>
              </Td>
              <Td>
                <Link
                  href={`/admin/offers/${o.slug}`}
                  className="editorial-link text-[color:var(--gold)]"
                >
                  Review →
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="mono py-3 pr-4 text-[10.5px] font-normal uppercase tracking-[0.18em]">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-3 pr-4 align-top">{children}</td>;
}
