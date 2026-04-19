"use client";

import { useEffect, useState } from "react";
import { CONSENT_COOKIE } from "@/lib/ads";
import { Button } from "@/components/ui/Button";

/**
 * Read/write the consent cookie (client only). We intentionally keep
 * this as a cookie (not localStorage) so server components can read
 * it in the future for SSR gating without re-hydration flicker.
 */
export function readConsent(): "yes" | "no" | "unset" {
  if (typeof document === "undefined") return "unset";
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return "unset";
  return match.endsWith("=1") ? "yes" : "no";
}

function writeConsent(value: "yes" | "no") {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 180; // 180d
  document.cookie = `${CONSENT_COOKIE}=${value === "yes" ? 1 : 0}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new CustomEvent("acl:consent", { detail: value }));
}

/**
 * Minimal, editorial-dark consent banner.
 *
 * Shown only until the visitor accepts or declines. Declining does
 * not hide the site — it just keeps programmatic ads from loading.
 * This is the minimum needed for AdSense EEA consent compliance and
 * for the site to pass AdSense's policy review without ad-density
 * warnings.
 */
export function ConsentBanner() {
  const [state, setState] = useState<"yes" | "no" | "unset">("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setState(readConsent());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted || state !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--rule)] bg-[color:var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/80 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[color:var(--gold)]/25 before:to-transparent"
    >
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-3 page-gutter-x py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:py-3.5">
        <p className="text-[12.5px] leading-[1.5] text-[color:var(--foreground-dim)]">
          We use cookies to measure traffic and — if you say yes — to show
          relevant, labeled sponsor ads that keep the ledger free.{" "}
          <a
            href="/privacy"
            className="underline-offset-4 hover:text-[color:var(--foreground)] hover:underline"
          >
            Privacy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              writeConsent("no");
              setState("no");
            }}
            className="editorial-link rounded-md px-3 py-2 text-[12px] font-medium text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
          >
            Decline
          </button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="mono uppercase tracking-[0.08em]"
            onClick={() => {
              writeConsent("yes");
              setState("yes");
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
