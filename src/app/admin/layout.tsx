import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { isAdmin, getUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const metadata = { title: "Admin — AI Credit Ladder" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/admin");
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <main className="flex-1">
      <div className="border-b border-[color:var(--rule)] bg-[color:var(--background-2)]">
        <Container className="flex h-12 items-center justify-between">
          <nav className="flex items-center gap-5 text-[12px]">
            <Link
              href="/admin"
              className="mono uppercase tracking-[0.2em] text-[color:var(--gold)]"
            >
              Admin
            </Link>
            <Link
              href="/admin/offers"
              className="text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]"
            >
              Offers
            </Link>
            <Link
              href="/admin/subscribers"
              className="text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]"
            >
              Subscribers
            </Link>
            <Link
              href="/"
              className="text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]"
            >
              ← Public site
            </Link>
          </nav>
          <form action={signOut}>
            <button
              type="submit"
              className="mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]"
            >
              {user.email} · sign out
            </button>
          </form>
        </Container>
      </div>
      {children}
    </main>
  );
}
