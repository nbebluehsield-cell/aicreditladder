"use client";

import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { readConsent } from "@/components/ads/ConsentBanner";
import { gaMeasurementId } from "@/lib/analytics";

/**
 * GA4 (gtag.js) — equivalent to Google’s embed:
 *   gtag/js?id=G-XXXXXXXXXX + dataLayer + gtag('js', new Date()) + gtag('config', …)
 *
 * Intentional differences from a raw site-wide snippet:
 *   1. Loads only after cookie consent (“Accept”) so analytics matches the
 *      privacy copy and EEA expectations (same gate as AdSense).
 *   2. `send_page_view: false` on first `config`, then `PageView` calls
 *      `gtag('config', id, { page_path })` on route/search changes — correct
 *      for the App Router (client navigations need explicit page hits).
 *
 * Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-N1KVEX5T3W` (or your property ID) in
 * Vercel / `.env.local`. `src/lib/analytics.ts` validates the `G-` format.
 */
function PageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.toString();
    const pagePath = q ? `${pathname}?${q}` : pathname;
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag !== "function") return;
    w.gtag("config", measurementId, { page_path: pagePath });
  }, [measurementId, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const id = gaMeasurementId();
  const [consent, setConsent] = useState<"yes" | "no" | "unset">("unset");

  useEffect(() => {
    const raf = requestAnimationFrame(() => setConsent(readConsent()));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as "yes" | "no" | undefined;
      if (detail) setConsent(detail);
    };
    window.addEventListener("acl:consent", onChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("acl:consent", onChange);
    };
  }, []);

  if (!id || consent !== "yes") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-inline" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageView measurementId={id} />
      </Suspense>
    </>
  );
}
