/** GA4 Measurement ID (e.g. G-XXXXXXXXXX). Set in Vercel + .env.local. */
export function gaMeasurementId(): string | null {
  const v = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!v || !/^G-[A-Z0-9]+$/i.test(v)) return null;
  return v;
}
