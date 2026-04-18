"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };

export function HeaderNav({
  nav,
  userEmail,
  isAdmin,
}: {
  nav: NavItem[];
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-0.5 text-sm md:flex">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded px-3 py-1.5 text-[13px] text-[color:var(--foreground-dim)] transition hover:text-[color:var(--foreground)] focus-ring"
          >
            {n.label === "Ladder" && (
              <span className="mr-1.5 text-[10px] text-[color:var(--teal)]">●</span>
            )}
            {n.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className="rounded px-3 py-1.5 text-[13px] text-[color:var(--gold)] transition focus-ring"
          >
            Admin
          </Link>
        )}
        <span className="mx-2 h-4 w-px bg-[color:var(--rule-2)]" />

        {userEmail ? (
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-[color:var(--rule-2)] px-3.5 py-1.5 text-[12px] font-medium text-[color:var(--foreground-dim)] transition hover:border-[color:var(--rule-3)] focus-ring"
              title={userEmail}
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full border border-[color:var(--gold)] px-3.5 py-1.5 text-[12px] font-medium text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-black focus-ring"
          >
            Sign in
          </Link>
        )}
      </nav>

      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full focus-ring md:hidden"
      >
        <div className="relative h-4 w-5">
          <span
            className={cn(
              "absolute left-0 top-1 block h-[1.5px] w-5 bg-[color:var(--foreground)] transition-transform",
              open && "translate-y-[5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 bottom-1 block h-[1.5px] w-5 bg-[color:var(--foreground)] transition-transform",
              open && "-translate-y-[5px] -rotate-45",
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-14 overflow-hidden border-t border-[color:var(--rule)] bg-[color:var(--background)]/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out md:hidden",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="display border-b border-[color:var(--rule)] py-2 text-2xl text-[color:var(--foreground)]"
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="display border-b border-[color:var(--rule)] py-2 text-2xl text-[color:var(--gold)]"
            >
              Admin
            </Link>
          )}
          {userEmail ? (
            <form action={signOut} className="mt-4">
              <button
                type="submit"
                className="w-full rounded-full border border-[color:var(--rule-2)] px-5 py-3 text-[13px] font-medium"
              >
                Sign out ({userEmail})
              </button>
            </form>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-[color:var(--gold)] px-5 py-3 text-center text-[13px] font-medium text-black"
            >
              Sign in →
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
