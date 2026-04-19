import { gaMeasurementId } from "@/lib/analytics";

/**
 * Fire a GA4 event only when gtag is on the page (after consent + GA load).
 * Params should be strings/numbers for predictable reporting.
 */
export function trackGaEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): void {
  if (typeof window === "undefined") return;
  if (!gaMeasurementId()) return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  if (!params) {
    w.gtag("event", name);
    return;
  }
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    cleaned[k] = typeof v === "boolean" ? v : typeof v === "number" ? v : String(v);
  }
  w.gtag("event", name, cleaned);
}
