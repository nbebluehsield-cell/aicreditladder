import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--rule)]">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="display text-2xl leading-tight">AI Credit Ladder</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Reduce AI burn before funding. Curated credit intelligence for
            solo and early-stage AI founders.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[13px] sm:grid-cols-3">
          <FooterGroup title="Product">
            <FooterLink href="/explore">Explore</FooterLink>
            <FooterLink href="/stages/now">The Ladder</FooterLink>
            <FooterLink href="/newsletter">Weekly digest</FooterLink>
          </FooterGroup>
          <FooterGroup title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/methodology">How we verify</FooterLink>
            <FooterLink href="/sponsor">Sponsor</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterGroup>
          <FooterGroup title="Legal">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterGroup>
        </div>
      </Container>
      <div className="border-t border-[color:var(--rule)]">
        <Container className="flex items-center justify-between py-4">
          <p className="eyebrow">© {new Date().getFullYear()} AI Credit Ladder</p>
          <p className="eyebrow">Built for founders · not funded by VCs</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="flex flex-col gap-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[color:var(--foreground-dim)] transition hover:text-[color:var(--foreground)]"
      >
        {children}
      </Link>
    </li>
  );
}
