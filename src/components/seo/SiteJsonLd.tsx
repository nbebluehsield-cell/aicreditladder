import { SITE_URL } from "@/lib/site-url";
import { SITE_ORG_DESCRIPTION } from "@/lib/site-seo";

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
        description: SITE_ORG_DESCRIPTION,
        knowsAbout: [
          "Startup company",
          "Cloud computing",
          "Artificial intelligence",
          "Solo entrepreneur",
        ],
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
        description: SITE_ORG_DESCRIPTION,
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
