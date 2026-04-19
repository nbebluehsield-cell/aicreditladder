import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SITE_URL } from "@/lib/site-url";

/** High-intent phrases for search + AI retrieval (keep concise). */
const SITE_KEYWORDS = [
  "AI credits",
  "startup credits",
  "free AI API credits",
  "cloud credits for startups",
  "solo founder",
  "OpenAI credits",
  "AWS Activate",
  "Google Cloud credits",
  "verified AI programs",
  "developer credits",
] as const;

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "AI Credit Ladder — Verified startup AI credits on the frontier",
    template: "%s · AI Credit Ladder",
  },
  description:
    "Editorial index of verified AI API, IDE, and cloud credits for solo founders and early teams. Explore by stack, stage, or claim path — updated weekly.",
  applicationName: "AI Credit Ladder",
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: "AI Credit Ladder", url: SITE_URL }],
  creator: "AI Credit Ladder",
  publisher: "AI Credit Ladder",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AI Credit Ladder",
    title: "AI Credit Ladder — Startup AI credits, verified weekly",
    description:
      "Frontier-first ledger of AI and cloud credits. Filter by how you claim, what you’re building, and where you are on the runway.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Credit Ladder — verified startup AI and cloud credits for solo founders",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Credit Ladder — Verified startup AI credits",
    description:
      "Editorial index for builders: AI APIs, copilots, cloud credits — explore, verify, claim at the source.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "./",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrains.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteJsonLd />
        <AppShell />
        <a
          href="#main"
          className="skip-link focus-ring"
        >
          Skip to main content
        </a>
        <Header />
        <main
          id="main"
          tabIndex={-1}
          className="flex min-h-0 flex-1 flex-col pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] outline-none scroll-mt-[calc(var(--masthead-clearance)+0.5rem)]"
        >
          {children}
        </main>
        <ConsentBanner />
        <GoogleAnalytics />
        <AdSenseScript />
      </body>
    </html>
  );
}
