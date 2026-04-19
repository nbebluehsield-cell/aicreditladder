"use client";

import { useEffect, useState } from "react";

/**
 * Countdown to the next Sunday 5:00am Pacific.
 *
 * We treat "5am PT" as 12:00 UTC Sunday during Pacific Daylight Time
 * (Mar–Nov). Off-DST drift is ±1h for one half the year — good enough
 * for a typographic ticker. If the site ever internationalizes we'll
 * swap this for a server-rendered value.
 *
 * Updates every 30 seconds — tight enough to feel alive, lazy enough
 * to be invisible to the CPU profile.
 */
export function NextSundayCountdown({
  prefix = "Next issue in",
}: {
  prefix?: string;
}) {
  const [label, setLabel] = useState<string>("—");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const target = nextSundayTarget(now);
      const ms = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(ms / 86_400_000);
      const hours = Math.floor((ms % 86_400_000) / 3_600_000);
      const mins = Math.floor((ms % 3_600_000) / 60_000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${mins}m`);
      setLabel(parts.join(" "));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {prefix}{" "}
      <span className="tabular-nums text-[color:var(--foreground)]">{label}</span>
    </span>
  );
}

function nextSundayTarget(now: Date): Date {
  // Next Sunday at 12:00 UTC (= 5am PDT, 4am PST).
  const target = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0),
  );
  const day = target.getUTCDay(); // 0 = Sunday
  const daysUntilSunday = (7 - day) % 7;
  target.setUTCDate(target.getUTCDate() + daysUntilSunday);
  if (target.getTime() <= now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 7);
  }
  return target;
}
