"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { BrandMark } from "./BrandMark";

/**
 * Masthead — mark + wordmark lockup. “AI Credit” + “Ladder” read as one
 * phrase: tight sidebearings, no wide gap between the two spans.
 */
export function HomeLogo({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(8);
    }
    if (pathname === "/") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        const dirty =
          window.location.search.length > 0 || window.location.hash.length > 0;
        if (dirty) router.replace("/", { scroll: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Link
      href="/"
      prefetch
      onClick={handleClick}
      aria-label="AI Credit Ladder — home"
      className={cn(
        "group focus-ring inline-flex min-h-11 min-w-0 flex-1 items-center gap-1 rounded-sm outline-none transition-opacity duration-150 ease-out hover:opacity-90 active:scale-[0.985] sm:min-h-0 sm:flex-none sm:gap-1.5",
        className,
      )}
    >
      <BrandMark
        size={40}
        className="h-10 w-10 shrink-0 text-foreground sm:h-10 sm:w-10"
      />

      <span className="wordmark-lockup inline-flex min-w-0 items-baseline whitespace-nowrap leading-none">
        <span className="display text-[19px] tracking-[-0.04em] text-foreground sm:text-[20px] lg:text-[22px]">
          AI Credit
        </span>
        <span className="display pl-[0.06em] text-[19px] tracking-[-0.04em] text-gold sm:pl-[0.07em] sm:text-[20px] lg:text-[22px]">
          Ladder
        </span>
      </span>
    </Link>
  );
}
