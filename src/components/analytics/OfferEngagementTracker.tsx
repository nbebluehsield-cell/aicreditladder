"use client";

import { useEffect } from "react";
import { GA_EVENTS } from "@/lib/analytics-events";
import { trackGaEvent } from "@/lib/gtag";

/** Offer detail impression (fires when this slug is shown; SPA navigations included). */
export function OfferEngagementTracker({
  offerSlug,
  vendor,
  offerTitle,
}: {
  offerSlug: string;
  vendor: string;
  offerTitle: string;
}) {
  useEffect(() => {
    trackGaEvent(GA_EVENTS.VIEW_OFFER, {
      offer_slug: offerSlug,
      vendor,
      offer_title: offerTitle,
    });
  }, [offerSlug, vendor, offerTitle]);

  return null;
}
