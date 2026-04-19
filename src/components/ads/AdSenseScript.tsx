"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { adSenseClientId } from "@/lib/ads";
import { readConsent } from "./ConsentBanner";

/**
 * Injects the AdSense loader exactly once, and only after the
 * visitor has accepted consent. Placed in the root layout.
 *
 * The `<ins>` elements rendered by <AdSlot> are inert until this
 * script has loaded and `(adsbygoogle = adsbygoogle || []).push({})`
 * is called for each slot.
 */
export function AdSenseScript() {
  const client = adSenseClientId();
  const [consent, setConsent] = useState<"yes" | "no" | "unset">("unset");

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

  if (!client || consent !== "yes") return null;

  return (
    <Script
      id="adsbygoogle-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
