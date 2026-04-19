#!/usr/bin/env node
/**
 * Sync vendor brand logos into /public/logos/*.svg.
 *
 * Primary source: `simple-icons` (MIT). Every mark is re-emitted as an
 * SVG with the official brand hex as the fill so it reads on a white
 * tile. For brands simple-icons does not cover (trademarked / removed)
 * we ship a tiny hand-drawn wordmark fallback so the row always has a
 * recognizable stamp — no Google favicon hits, no console errors.
 *
 * Safe to re-run: overwrites existing files. Commit the output.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as si from "simple-icons";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "logos");

mkdirSync(OUT_DIR, { recursive: true });

/**
 * vendor slug (our internal) → simple-icons slug.
 * A `null` value means "no simple-icons entry — use custom fallback".
 */
const MAP = {
  "github": "github",
  "groq": null,
  "huggingface": "huggingface",
  "microsoft": null,
  "neon": null,
  "openai": null,
  "railway": "railway",
  "modal": "modal",
  "linear": "linear",
  "googlecloud": "googlecloud",
  "digitalocean": "digitalocean",
  "aws": null,
  "anthropic": "anthropic",
  "supabase": "supabase",
  "posthog": "posthog",
  "mongodb": "mongodb",
  "pinecone": null,
  "notion": "notion",
  "oracle": null,
  "vercel": "vercel",
  "elevenlabs": "elevenlabs",
  "together": null,
  "cloudflare": "cloudflare",
  "nvidia": "nvidia",
  "cursor": null,
  "windsurf": null,
  "codeium": null,
  "sourcegraph": null,
  "zed": null,
};

/** Convert a simple-icons slug to its exported variable name (siGithub, etc.). */
function siExportName(slug) {
  return "si" + slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Re-emit a simple-icons SVG with fill set to its brand hex. */
function brandedSvgFromSi(slug) {
  const ico = si[siExportName(slug)];
  if (!ico) throw new Error(`simple-icons: missing slug "${slug}"`);
  // simple-icons ships a single <path> with no fill; inject the brand
  // hex so the mark reads in color on a white ground.
  return ico.svg.replace(
    "<path ",
    `<path fill="#${ico.hex}" `,
  );
}

/**
 * Hand-drawn fallback marks for vendors simple-icons does not ship.
 * Each is a 24×24 viewBox, single-color, readable at 28px. Geometric
 * abstractions — not wordmarks — so they fit the "mark in a tile" look.
 */
const FALLBACKS = {
  "microsoft": {
    hex: "737373",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Microsoft</title><rect x="2" y="2" width="9" height="9" fill="#F25022"/><rect x="13" y="2" width="9" height="9" fill="#7FBA00"/><rect x="2" y="13" width="9" height="9" fill="#00A4EF"/><rect x="13" y="13" width="9" height="9" fill="#FFB900"/></svg>`,
  },
  "aws": {
    hex: "FF9900",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Amazon Web Services</title><path fill="#FF9900" d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .07.263v.375c0 .168-.063.256-.183.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.7 16.207c-2.626 1.94-6.442 2.968-9.722 2.968-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.558 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zm1.093-1.245c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.694-2.994z"/></svg>`,
  },
  "openai": {
    hex: "0D1117",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path fill="#0D1117" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.3 12.867l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.504 4.504 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.392.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/></svg>`,
  },
  "groq": {
    hex: "F55036",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Groq</title><g fill="none" stroke="#F55036" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2l5 5"/></g></svg>`,
  },
  "neon": {
    hex: "00E599",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Neon</title><g fill="none" stroke="#00E599" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V5l14 14V5"/></g></svg>`,
  },
  "pinecone": {
    hex: "000000",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Pinecone</title><path fill="#000000" d="M12 2l2.5 4.2-2.5 1.3-2.5-1.3L12 2zm0 7.5l3.2 2-3.2 1.7-3.2-1.7 3.2-2zm0 6l4 2.5L12 22l-4-4 4-2.5z"/></svg>`,
  },
  "oracle": {
    hex: "F80000",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Oracle</title><ellipse cx="12" cy="12" rx="10" ry="5.5" fill="none" stroke="#F80000" stroke-width="2.75"/></svg>`,
  },
  "together": {
    hex: "0F6FFF",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Together AI</title><circle cx="8" cy="12" r="4" fill="#0F6FFF"/><circle cx="16" cy="12" r="4" fill="#0F6FFF" opacity="0.55"/></svg>`,
  },
  "cursor": {
    hex: "000000",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Cursor</title><path fill="#000000" d="M4.6 2.6c-.5-.2-1 .2-.9.8l2.9 16.4c.1.6.9.8 1.2.2l2.4-5.8 5.9-1.6c.6-.2.7-1 .1-1.3L4.6 2.6z"/></svg>`,
  },
  "windsurf": {
    hex: "00B4A0",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Windsurf</title><g fill="none" stroke="#00B4A0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5c2 0 3-2 5.5-2s3.5 2 5.5 2 3-2 5.5-2 2 2 2.5 2"/><path d="M2.5 15.5c2 0 3-2 5.5-2s3.5 2 5.5 2 3-2 5.5-2 2 2 2.5 2"/></g></svg>`,
  },
  "codeium": {
    hex: "09B6A2",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Codeium</title><g fill="none" stroke="#09B6A2" stroke-width="2.3" stroke-linejoin="round"><path d="M12 3l8.5 5v8l-8.5 5-8.5-5V8z"/><path d="M8.5 11l3.5-2 3.5 2v3l-3.5 2-3.5-2z"/></g></svg>`,
  },
  "sourcegraph": {
    hex: "FF5543",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Sourcegraph</title><g fill="none" stroke="#FF5543" stroke-width="2.2" stroke-linecap="round"><path d="M6 7l5 4M13 13l5 4"/></g><circle cx="12" cy="12" r="2.5" fill="#FF5543"/><circle cx="5" cy="5.5" r="2.3" fill="#A112FF"/><circle cx="19" cy="18.5" r="2.3" fill="#00CBEC"/></svg>`,
  },
  "zed": {
    hex: "084CCC",
    svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Zed</title><g fill="none" stroke="#084CCC" stroke-width="2.4" stroke-linejoin="miter" stroke-miterlimit="4"><path d="M5.5 4.5h13M18.5 4.5L5.5 19.5M5.5 19.5h13"/></g></svg>`,
  },
};

let written = 0;

for (const [ourSlug, siSlug] of Object.entries(MAP)) {
  const outPath = resolve(OUT_DIR, `${ourSlug}.svg`);
  let svg;
  if (siSlug) {
    svg = brandedSvgFromSi(siSlug);
  } else {
    const fb = FALLBACKS[ourSlug];
    if (!fb) {
      console.warn(`skip ${ourSlug}: no simple-icons entry and no fallback`);
      continue;
    }
    svg = fb.svg;
  }
  writeFileSync(outPath, svg + "\n", "utf8");
  written++;
}

console.log(`synced ${written} logos → public/logos/`);
