import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { PROJECT_TYPES } from "@/data/project-types";
import { getOffersByProjectType } from "@/data/seed";

type Params = { slug: string };

export function generateStaticParams() {
  return PROJECT_TYPES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pt = PROJECT_TYPES.find((p) => p.slug === slug);
  return { title: pt ? `Best AI credits for ${pt.label} — AI Credit Ladder` : "Not found" };
}

export default async function ProjectTypePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pt = PROJECT_TYPES.find((p) => p.slug === slug);
  if (!pt) notFound();

  const offers = getOffersByProjectType(slug);

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--rule)]">
        <Container className="py-16 sm:py-20">
          <Link
            href="/#projects"
            className="eyebrow inline-flex items-center gap-2 mb-6 hover:text-[color:var(--foreground)]"
          >
            ← All project types
          </Link>
          <p className="section-number mb-4">Project · {pt.label}</p>
          <h1 className="display-h2 max-w-3xl">
            Credits for{" "}
            <span className="italic-display text-[color:var(--gold)]">{pt.label.toLowerCase()}</span>
            <br />
            builders.
          </h1>
          {pt.description && (
            <p className="mt-6 max-w-xl text-[15px] leading-[1.6] text-[color:var(--muted)]">
              {pt.description}.
            </p>
          )}
        </Container>
      </section>

      <section>
        <Container className="py-8 sm:py-12">
          {offers.length === 0 ? (
            <p className="eyebrow py-12 text-center">No matched offers yet</p>
          ) : (
            <div className="border-t border-[color:var(--rule)]">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
