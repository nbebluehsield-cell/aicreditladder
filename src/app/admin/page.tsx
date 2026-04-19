import Link from "next/link";
import { Container } from "@/components/Container";
import { getOffers } from "@/lib/offers-source";

export default async function AdminHome() {
  const all = await getOffers();
  const unverified = all.filter((o) => !o.last_verified_at).length;
  const total = all.length;
  const solo = all.filter((o) => o.solo_founder_friendly === "yes").length;

  return (
    <Container className="py-12 sm:py-16">
      <p className="section-number mb-4">Dashboard</p>
      <h1 className="display-h2">Verification queue.</h1>
      <p className="mt-5 max-w-xl text-[14px] text-[color:var(--muted)]">
        {unverified} of {total} offers are awaiting human verification. Open
        each source URL, confirm today&apos;s terms, and mark it verified.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)] sm:grid-cols-4">
        <Stat k="Total offers" v={total.toString()} />
        <Stat k="Unverified" v={unverified.toString()} accent="gold" />
        <Stat k="Solo-friendly" v={solo.toString()} accent="teal" />
        <Stat
          k="Verified today"
          v={
            all.filter((o) => {
              if (!o.last_verified_at) return false;
              const d = new Date(o.last_verified_at);
              const today = new Date();
              return d.toDateString() === today.toDateString();
            }).length.toString()
          }
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/offers"
          className="rounded-full bg-[color:var(--gold)] px-5 py-2.5 text-[13px] font-medium text-black"
        >
          Open verification queue →
        </Link>
        <Link
          href="/admin/subscribers"
          className="rounded-full border border-[color:var(--rule-2)] px-5 py-2.5 text-[13px] font-medium text-[color:var(--foreground-dim)]"
        >
          View subscribers
        </Link>
      </div>
    </Container>
  );
}

function Stat({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: "gold" | "teal";
}) {
  const color =
    accent === "gold"
      ? "var(--gold)"
      : accent === "teal"
      ? "var(--teal)"
      : "var(--foreground)";
  return (
    <div className="bg-[color:var(--background)] p-5">
      <p className="eyebrow">{k}</p>
      <p className="num mt-3 text-[32px] tracking-tight" style={{ color }}>
        {v}
      </p>
    </div>
  );
}
