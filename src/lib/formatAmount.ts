import type { Offer } from "@/lib/types";

export type FormattedAmount = {
  /** e.g. "Up to" when `value_display` began with that — kept for accuracy to vendor copy */
  qualifier: string | null;
  /** Primary figure: precise USD under $1M (`$350,000`), compact `$1.5M` at/above $1M */
  main: string;
  /** Second line: time horizon, product bucket, etc. */
  unit: string;
};

/**
 * Parse an offer into a two-line amount: qualifier + main (tabular), then unit.
 *
 * When `credit_value_amount` is set, `main` is derived from that number so the
 * headline matches structured data. Under $1M we use comma-separated dollars
 * (`$350,000`) instead of `$350K` for clarity. The unit line is taken from the
 * remainder of `value_display` after the dollar figure, or `duration` if empty.
 */
export function formatAmount(o: Offer): FormattedAmount {
  const rawFull = o.value_display.trim();
  const upTo = /^Up to\s/i.test(rawFull);
  const raw = rawFull.replace(/^Up to\s*/i, "").trim();
  const unitMatch = raw.match(/^\$[\d,]+(?:\.\d+)?\+?\s*(.*)$/);
  let unit = (unitMatch?.[1] ?? "").trim();

  unit = unit.replace(/^in\s+/i, "").replace(/\s+credits?$/i, "").trim();

  const amt = o.credit_value_amount;

  /* Tiered programs (e.g. AWS Activate): lead with the solo-founder floor in
   * `value_display`, keep `credit_value_amount` at the max for sorting. */
  const fromTiered =
    /^From\s+(\$[\d,]+(?:\.\d+)?)\s+(.+)$/i.exec(rawFull);
  if (fromTiered) {
    let rest = fromTiered[2].trim();
    if (o.duration && !rest.includes(o.duration)) {
      rest = rest ? `${rest} · ${o.duration}` : o.duration;
    }
    return {
      qualifier: "From",
      main: fromTiered[1],
      unit: rest,
    };
  }

  if (typeof amt === "number" && amt > 0) {
    const main = formatUsdFromNumber(amt);
    if (!unit && o.duration) {
      unit = o.duration;
    }
    return {
      qualifier: upTo ? "Up to" : null,
      main,
      unit,
    };
  }

  return { qualifier: null, main: raw, unit: "" };
}

function formatUsdFromNumber(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${trimZero(v)}M`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

function trimZero(v: number): string {
  const s = v.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}
