import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = {
  title: "The Digest — AI Credit Ladder",
  description:
    "Every Sunday: 3–5 newly verified AI and cloud credit offers, one deeper comparison, and zero hype.",
};

export default function Newsletter() {
  return (
    <article>
      <p className="section-number mb-4">The Digest</p>
      <h1 className="display-h2">
        Every Sunday, credits
        <br />
        <span className="italic-display text-[color:var(--foreground-dim)]">
          worth claiming.
        </span>
      </h1>
      <p className="mt-10 text-[16px] leading-[1.7] text-[color:var(--foreground-dim)]">
        3–5 newly verified offers. One deeper comparison. No hype. No scraped
        junk. Built for the founder optimizing burn.
      </p>
      <NewsletterForm />
      <p className="eyebrow mt-4">Magic link · Unlocks depth · No spam</p>
    </article>
  );
}
