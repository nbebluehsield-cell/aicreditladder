import Link from "next/link";
import { Container } from "./Container";
import { getUser, isAdmin } from "@/lib/auth";
import { HeaderNav } from "./HeaderNav";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/stages/now", label: "Ladder" },
  { href: "/newsletter", label: "Digest" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const user = await getUser();
  const admin = user ? await isAdmin() : false;
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--rule)] bg-[color:var(--background)]/80 backdrop-blur-xl">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded focus-ring"
        >
          <LadderMark />
          <span className="display text-[17px] tracking-tight">
            AI Credit Ladder
          </span>
        </Link>

        <HeaderNav
          nav={NAV}
          userEmail={user?.email ?? null}
          isAdmin={admin}
        />
      </Container>
    </header>
  );
}

function LadderMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="3.5" y="2" width="1.5" height="18" rx="0.5" fill="currentColor" />
      <rect x="17" y="2" width="1.5" height="18" rx="0.5" fill="currentColor" />
      <rect x="3.5" y="15" width="15" height="1.3" rx="0.4" fill="#fbd24e" />
      <rect x="3.5" y="10.3" width="15" height="1.3" rx="0.4" fill="#f0b429" opacity="0.7" />
      <rect x="3.5" y="5.6" width="15" height="1.3" rx="0.4" fill="#f0b429" opacity="0.4" />
    </svg>
  );
}
