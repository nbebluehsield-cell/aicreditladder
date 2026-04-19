import { SITE_URL } from "@/lib/site-url";

/**
 * Organization + WebSite schema for crawlers (rich results, brand panel).
 * SearchAction targets /explore?q= — matches FilterTray search param `q`.
 */
export function SiteJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "AI Credit Ladder",
        url: SITE_URL,
        description:
          "Editorial index of verified startup AI and cloud credits — frontier-first, solo-founder readable.",
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/icon`,
          contentUrl: `${SITE_URL}/icon`,
          width: 32,
          height: 32,
          caption: "AI Credit Ladder ladder mark",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "AI Credit Ladder",
        description:
          "Verified AI API, IDE, and cloud credits for builders — explore by stack, stage, or claim path.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
        isAccessibleForFree: true,
        image: `${SITE_URL}/opengraph-image`,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/explore?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
