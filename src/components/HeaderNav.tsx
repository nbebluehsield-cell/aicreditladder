"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import { HomeLogo } from "./HomeLogo";

type NavItem = { href: string; label: string };

function navActive(pathname: string, href: string): boolean {
  if (href === "/newsletter") return pathname.startsWith("/newsletter");
  if (href === "/methodology") return pathname.startsWith("/methodology");
  if (href === "/about") return pathname.startsWith("/about");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Segmented Weekly / Method / About rail — full width on small screens so
 * tap targets stay 44px+ without crowding the wordmark.
 */
export function HeaderNavRail({
  nav,
  className,
}: {
  nav: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "inline-flex w-full min-w-0 items-stretch rounded-[10px] border border-[color:var(--rule-2)] bg-[color:var(--surface)]/55 p-0.5 shadow-[inset_0_1px_0_rgba(242,236,224,0.04)] sm:w-auto sm:items-center sm:rounded-[11px] sm:p-1",
        className,
      )}
      role="tablist"
      aria-label="Site sections"
    >
      {nav.map((n) => {
        const active = navActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            prefetch
            role="tab"
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-[7px] px-3 py-2.5 text-[13px] font-medium tracking-[0.01em] transition-colors duration-150 sm:min-h-0 sm:flex-initial sm:justify-start sm:rounded-lg sm:px-3.5 sm:py-2 sm:text-[13px]",
              active
                ? "bg-[color:var(--background)] text-[color:var(--foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                : "text-[color:var(--foreground-dim)] hover:bg-[color:var(--surface-2)]/70 hover:text-[color:var(--foreground)]",
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}

export function HeaderAuth({
  userEmail,
  isAdmin,
  className,
}: {
  userEmail: string | null;
  isAdmin: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 sm:gap-3",
        className,
      )}
    >
      {isAdmin && (
        <Link
          href="/admin"
          prefetch
          className={cn(
            "focus-ring inline-flex min-h-11 items-center rounded-md px-2.5 py-2 text-[12px] font-medium text-[color:var(--gold)] transition hover:bg-[color:var(--gold-soft)] sm:min-h-9 sm:px-3 sm:text-[13px]",
            pathname.startsWith("/admin") &&
              "underline decoration-[color:var(--gold)] underline-offset-4",
          )}
        >
          Admin
        </Link>
      )}

      <span
        aria-hidden
        className="hidden h-7 w-px shrink-0 bg-[color:var(--rule-2)] sm:block"
      />

      {userEmail ? (
        <form action={signOut} className="inline-flex">
          <button
            type="submit"
            className="mono focus-ring min-h-11 rounded-lg border border-[color:var(--rule-2)] bg-[color:var(--surface)]/40 px-3 py-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--muted)] transition hover:border-[color:var(--rule-3)] hover:text-[color:var(--foreground)] sm:min-h-9 sm:text-[11px]"
            title={userEmail}
          >
            Sign out
          </button>
        </form>
      ) : (
        <Link
          href="/auth/login"
          prefetch
          className="mono focus-ring inline-flex min-h-[44px] min-w-[5.5rem] items-center justify-center rounded-lg border border-[color:var(--gold)] bg-[color:var(--gold)]/12 px-4 py-2 text-[10.5px] uppercase tracking-[0.15em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-[color:var(--background)] sm:min-h-9 sm:min-w-0 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}

/**
 * Masthead — mobile: logo + auth on one row, full-width section rail below.
 * sm+: single row, logo | rail | auth (with divider).
 */
export function HeaderMasthead({
  nav,
  userEmail,
  isAdmin,
}: {
  nav: NavItem[];
  userEmail: string | null;
  isAdmin: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <HomeLogo className="min-w-0 flex-1" />
          <HeaderAuth userEmail={userEmail} isAdmin={isAdmin} />
        </div>
        <HeaderNavRail nav={nav} />
      </div>

      <div className="hidden min-w-0 items-center justify-between gap-6 sm:flex">
        <HomeLogo />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:gap-5">
          <HeaderNavRail nav={nav} className="flex-none" />
          <HeaderAuth userEmail={userEmail} isAdmin={isAdmin} />
        </div>
      </div>
    </>
  );
}
