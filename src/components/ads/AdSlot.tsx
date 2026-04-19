"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  PLACEMENTS,
  adSenseClientId,
  isAdSensePlacementWired,
  slotIdFor,
  type PlacementKey,
} from "@/lib/ads";
import { readConsent } from "./ConsentBanner";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense surface — one component, three states:
 *
 *   1. Live ad      — publisher id + slot env + consent → `<ins class="adsbygoogle">`
 *   2. House pitch  — wired but no consent (or script still loading)
 *   3. House pitch  — env not wired → same frame, “direct sponsor” CTA
 *
 * `SponsorCard` elsewhere is first-party only; this component is the
 * programmatic (AdSense) integration.
 *
 * Usage:
 *   <AdSlot placement="home_inline" />
 */
export function AdSlot({ placement }: { placement: PlacementKey }) {
  const conf = PLACEMENTS[placement];
  const client = adSenseClientId();
  const slot = slotIdFor(placement);
  const wired = isAdSensePlacementWired(placement);

  const [consent, setConsent] = useState<"yes" | "no" | "unset">("unset");
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  const serveReal = wired && consent === "yes";

  useEffect(() => {
    const id = requestAnimationFrame(() => setConsent(readConsent()));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as "yes" | "no" | undefined;
      if (detail) setConsent(detail);
    };
    window.addEventListener("acl:consent", onChange);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("acl:consent", onChange);
    };
  }, []);

  useEffect(() => {
    if (!serveReal) {
      pushedRef.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      if (pushedRef.current || !insRef.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch {
        // AdSense not yet loaded — queue holds until script runs.
      }
    });
    return () => cancelAnimationFrame(id);
  }, [serveReal]);

  return (
    <aside
      data-ad-placement={placement}
      aria-label="Advertisement"
      className="border-t border-b border-[color:var(--rule-2)] bg-[color:var(--background-2)]/40"
    >
      <div className="mx-auto flex w-full max-w-[1560px] items-stretch gap-0 page-gutter-x">
        <div className="flex w-full flex-col">
          {/* Label strip — always visible. Consistent, never deceptive. */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1.5">
            <span className="mono text-[9.5px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Sponsored · Google AdSense
              <span className="text-[color:var(--muted-2)]"> · {conf.label}</span>
            </span>
            {!serveReal && (
              <Link
                href="/sponsor"
                className="mono text-[9.5px] uppercase tracking-[0.28em] text-[color:var(--gold)] underline-offset-4 hover:underline"
              >
                Direct sponsor →
              </Link>
            )}
          </div>

          {/* Surface */}
          {serveReal ? (
            <ins
              ref={insRef}
              className="adsbygoogle block"
              style={conf.style}
              data-ad-client={client!}
              data-ad-slot={slot!}
              data-ad-format={conf.format}
              data-full-width-responsive="true"
              {...(process.env.NODE_ENV === "development"
                ? ({ "data-adtest": "on" } as const)
                : {})}
            />
          ) : (
            <HouseAd placement={placement} wired={wired} consent={consent} />
          )}
        </div>
      </div>
    </aside>
  );
}

/**
 * Fallback when AdSense isn’t filling the slot: env missing, or consent
 * declined, or account still under review — same dimensions as live ads.
 */
function HouseAd({
  placement,
  wired,
  consent,
}: {
  placement: PlacementKey;
  wired: boolean;
  consent: "yes" | "no" | "unset";
}) {
  const pitch =
    placement === "offer_rail"
      ? "Your credit program in front of founders actively applying. Tasteful, labeled, never a pop-up."
      : "Reach AI founders the week they pick their stack. One native slot, week-clean reporting.";

  const statusBadge = !wired
    ? process.env.NODE_ENV === "development"
      ? "AdSense: add client + slot env"
      : "AdSense not configured"
    : consent === "no"
      ? "Accept cookies to load AdSense"
      : consent === "unset"
        ? "Loading…"
        : null;

  return (
    <div className="flex min-h-[96px] flex-wrap items-center justify-between gap-4 py-3">
      <p className="max-w-xl text-[13.5px] leading-[1.5] text-[color:var(--foreground-dim)]">
        <span className="italic-display text-[color:var(--foreground)]">
          Reach builders before funding.
        </span>{" "}
        {pitch}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/sponsor"
          className="mono inline-flex h-9 items-center border border-[color:var(--foreground)] px-3 text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--foreground)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
        >
          Inquire →
        </Link>
        {statusBadge && (
          <span className="mono max-w-[14rem] text-[9.5px] uppercase leading-snug tracking-[0.18em] text-[color:var(--muted-2)] sm:max-w-none">
            {statusBadge}
          </span>
        )}
      </div>
    </div>
  );
}
