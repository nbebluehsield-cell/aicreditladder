import type { MetadataRoute } from "next";
import { PROJECT_TYPES } from "@/data/project-types";
import type { Offer } from "@/lib/types";
import { getOffers } from "@/lib/offers-source";
import { SITE_URL } from "@/lib/site-url";

const STAGES = ["now", "next", "later"] as const;

function lastMod(iso: string | null | undefined): Date {
  if (!iso) return new Date();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function entry(
  path: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  },
): MetadataRoute.Sitemap[0] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const offers = await getOffers();

  const staticPages: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/explore", { changeFrequency: "daily", priority: 0.95 }),
    entry("/newsletter", { changeFrequency: "weekly", priority: 0.85 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.75 }),
    entry("/methodology", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/contact", { changeFrequency: "yearly", priority: 0.55 }),
    entry("/sponsor", { changeFrequency: "monthly", priority: 0.5 }),
    entry("/terms", { changeFrequency: "yearly", priority: 0.35 }),
    entry("/privacy", { changeFrequency: "yearly", priority: 0.35 }),
  ];

  const projectPages = PROJECT_TYPES.map((p) =>
    entry(`/projects/${p.slug}`, {
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  const stagePages = STAGES.map((s) =>
    entry(`/stages/${s}`, {
      changeFrequency: "weekly",
      priority: 0.65,
    }),
  );

  const offerPages = offers.map((o: Offer) =>
    entry(`/offers/${o.slug}`, {
      changeFrequency: "weekly",
      priority: 0.72,
      lastModified: lastMod(o.last_verified_at),
    }),
  );

  return [...staticPages, ...projectPages, ...stagePages, ...offerPages];
}
