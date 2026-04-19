"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { PROJECT_TYPES } from "@/data/project-types";

/**
 * Lateral switcher for project-type pages.
 *
 * Sits sticky under the masthead so the reader can hop between the
 * nine project silos without losing scroll context — tap `chatbot`,
 * scan the ledger, tap `voice-app`, scan again, etc. Each link is
 * Next-prefetched on render so every swap feels instant.
 *
 * Editorial chip style (numbered `01`–`09`, gold underline for the
 * active one) mirrors the home-page grid so a reader coming from
 * `/#projects` recognises the row immediately.
 *
 * Deep-linking: if the active chip starts off-screen we auto-center
 * it in the scroll track on mount so users landing directly on
 * `/projects/b2b-internal` aren't staring at a row of "wrong" tabs.
 */
export function ProjectSwitcher({ activeSlug }: { activeSlug: string }) {
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const link = activeRef.current;
    if (!track || !link) return;

    const li = link.closest("li");
    if (!li) return;

    /* Horizontal center only — never call scrollIntoView on the chip: iOS /
       Safari will scroll the *window* and pull page content under sticky bars,
       clipping the hero. */
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const targetLeft = li.offsetLeft - (track.clientWidth - li.offsetWidth) / 2;
    const next = Math.max(0, Math.min(targetLeft, maxScroll));
    track.scrollTo({ left: next, behavior: "instant" });
  }, [activeSlug]);

  const activeProject = PROJECT_TYPES.find((p) => p.slug === activeSlug);

  return (
    <nav
      aria-label="Project types"
      className="project-switcher sticky top-[var(--masthead-clearance)] z-30 border-b border-[color:var(--rule)] bg-[color:var(--background)]/92 backdrop-blur-xl"
    >
      <div className="relative mx-auto w-full max-w-[1560px]">
        {/* Leading rail — eyebrow label anchors the row as editorial sub-nav,
         *  not a tab strip. Mirrors the "SORT / FILTERS" grammar on /explore. */}
        <div className="flex items-center gap-3 page-gutter-x">
          <span
            aria-hidden
            className="mono hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-2)] sm:inline"
          >
            Project
          </span>
          <div className="relative min-w-0 flex-1">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[color:var(--background)] to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[color:var(--background)] to-transparent"
            />
            <ul
              ref={trackRef}
              className="project-switcher__track flex gap-1 overflow-x-auto py-2.5"
              role="list"
            >
              {PROJECT_TYPES.map((p) => {
                const active = p.slug === activeSlug;
                return (
                  <li key={p.slug} className="shrink-0">
                    <Link
                      ref={active ? activeRef : undefined}
                      href={`/projects/${p.slug}`}
                      prefetch
                      aria-current={active ? "page" : undefined}
                      className={[
                        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] leading-none outline-none transition-colors duration-150",
                        active
                          ? "bg-[color:var(--gold-soft)] text-[color:var(--gold-bright)] ring-1 ring-inset ring-[color:var(--gold)]/40"
                          : "text-[color:var(--muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]",
                      ].join(" ")}
                    >
                      {p.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {activeProject && (
            <Link
              href="/explore"
              prefetch
              className="mono hidden shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--foreground)] hover:underline md:inline"
            >
              All programs →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
