# Ads & Sponsorship — exact setup

Everything you need to turn the ad surfaces on, in the order you should do it.
Aligned to BLUEPRINT §11 (tasteful, labeled, never displaces official results).

There are **three** monetization surfaces on the site. They are separate systems — do not conflate them.

| # | Surface       | Source            | Where                                              | Controlled by                          |
|---|---------------|-------------------|----------------------------------------------------|----------------------------------------|
| 1 | Programmatic  | Google AdSense    | Mid-homepage, mid-explore, offer-detail rail       | Env vars + AdSense dashboard           |
| 2 | Native sponsor| First-party       | Top of homepage ledger                             | `src/data/sponsors.ts`                 |
| 3 | Newsletter    | First-party       | Sunday Digest (one line)                           | `src/data/sponsors.ts` (`tier: newsletter`) |

Until anything is configured, every surface renders a labeled **house ad** pointing at `/sponsor`. There is no broken-looking empty space at any point.

---

## 1. Phase 1 — Google AdSense (day-one monetization)

### 1.1 Prerequisites — don't skip these, reviewers actually check

AdSense rejects ~60% of first-time applicants for policy/site-quality reasons. Ours is built for approval, but confirm before you apply:

- [ ] Site deployed on a **real public domain** (`aicreditladder.com`, not Vercel preview URL).
- [ ] Privacy page live at `/privacy` (already exists — real copy, not placeholder).
- [ ] Terms page live at `/terms` (already exists).
- [ ] About / Methodology / Contact pages live (they are).
- [ ] At least ~20–30 offer pages indexed. We ship with 25 seed offers; make sure they're generated at build time.
- [ ] No broken links, no "lorem ipsum", no placeholder copy.
- [ ] Mobile Core Web Vitals pass — run Lighthouse, all green.
- [ ] Consent banner visible to EU traffic (already wired in `src/app/layout.tsx`).

If any box above is unchecked, fix it **before** applying. Re-applying after a rejection takes weeks.

### 1.2 Apply

1. Go to https://adsense.google.com → **Get started**.
2. Enter the domain `aicreditladder.com` (no `https://`, no path).
3. Select country and accept the Terms.
4. On the **Connect your site** screen AdSense gives you a `ca-pub-XXXXXXXXXXXXXXXX` id. **Copy it.**
5. AdSense will ask you to verify ownership. Pick the **AdSense code snippet** option. The snippet looks like:

   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```

   You do **not** need to paste that manually. Instead:

   - Open `.env.local` and set:

     ```
     NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
     ```

   - Deploy. `src/components/ads/AdSenseScript.tsx` will inject the loader once a visitor accepts consent — AdSense's crawler ignores consent gates and still sees it.

6. Back in AdSense, click **Request review**. Expect **3–14 days** (sometimes longer). You'll get an email either way.

### 1.3 Create ad units (you can do this before approval)

While waiting for approval, pre-create the three units so the site is ready the moment approval lands.

For each placement listed below:

1. AdSense dashboard → **Ads** → **By ad unit** → **Create new ad unit** → **Display ads**.
2. Use the exact name from the "AdSense unit name" column so analytics stay readable.
3. Set type per the table. Leave everything else default.
4. Click **Create**. AdSense shows a code snippet containing `data-ad-slot="1234567890"`. **Copy the 10-digit slot id.**
5. Paste it into the corresponding env var.

| Placement key    | AdSense unit name             | Type    | Env var                                         |
|------------------|--------------------------------|---------|--------------------------------------------------|
| `home_inline`    | `ACL — Home · Inline`         | Display, responsive, fluid layout | `NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE`     |
| `explore_inline` | `ACL — Explore · Inline`      | Display, responsive, fluid layout | `NEXT_PUBLIC_ADSENSE_SLOT_EXPLORE_INLINE`  |
| `offer_rail`     | `ACL — Offer · Rail`          | Display, responsive, auto layout  | `NEXT_PUBLIC_ADSENSE_SLOT_OFFER_RAIL`      |

Final `.env.local` should look like:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_EXPLORE_INLINE=2345678901
NEXT_PUBLIC_ADSENSE_SLOT_OFFER_RAIL=3456789012
```

Deploy. Ads will serve automatically once:

1. AdSense approves the account, **AND**
2. The visitor has clicked **Accept** in the consent banner.

### 1.4 Post-approval sanity check

1. Load the site in an incognito window. Accept consent.
2. Scroll to the homepage ledger — you should see a real ad after the "Now" stage, not the house ad.
3. View an offer detail — real ad below the tips grid.
4. Check `/explore` — real ad after the 10th row (only when ≥12 rows match).
5. AdSense dashboard → **Reports** → confirm impressions within 1 hour.

If after 24 hours you see blanks, check:

- `ads.txt` at `https://aicreditladder.com/ads.txt`. AdSense will give you a line to add. Do **not** deploy the site without it — revenue will silently zero.

### 1.5 `ads.txt` — required

Create `public/ads.txt` (static file, served at `/ads.txt`) with the line AdSense gives you in the dashboard (**Sites → aicreditladder.com → Check ads.txt status**). It looks like:

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

Commit and deploy. Re-check the status in AdSense — it should flip to **Authorized** within a day.

---

## 2. Phase 2 — Media.net (once AdSense is stable)

Add Media.net in parallel with AdSense for better fill rates on long-tail pages. **Do not do this before AdSense approval** — running a second network too early can spook AdSense reviewers.

1. Apply at https://www.media.net/publishers/.
2. After approval, they'll hand you a `customer_id` and a code snippet per slot.
3. Extend the `PLACEMENTS` registry in `src/lib/ads.ts` to carry a second provider, and branch `AdSlot` to render the Media.net snippet when AdSense has no fill. (This is a ~30-line change — we'll do it together once your Media.net account lands.)

Not needed for launch.

---

## 3. Phase 3 — Ezoic (250k MAU+)

Ignore until traffic justifies it. When the time comes, Ezoic replaces the loader, not the markup — `<AdSlot>` stays.

---

## 4. Direct sponsors — first-party, curated

This is the highest-margin path and the one the Blueprint wants us to lean on over time.

### 4.1 Inbound

The `/sponsor` page is already live and carries: inventory description, rules, pricing note, `michael@couch.cx` contact. Link it from the newsletter footer and the `AdSlot` house ad (both already wired).

### 4.2 Running a sponsor

Once a sponsor is signed:

1. Open `src/data/sponsors.ts`.
2. Add an object to `SPONSORS`:

   ```ts
   {
     id: "modal-2026-04",
     vendor: "Modal",
     domain: "modal.com",
     headline: "Serverless GPUs for AI builders. $500 free + startup credits.",
     amountDisplay: "$500 + credits",
     cta: "Claim",
     href: "https://modal.com/signup?utm_source=aicreditladder&utm_medium=sponsor&utm_campaign=ladder-home",
     activeFrom: "2026-04-01",
     activeTo: "2026-05-01",
     tier: "homepage",
   }
   ```

3. Commit and deploy. `SponsorCard` picks the first sponsor whose window covers today.
4. At the end of the window, leave the entry in the file (for historical reference) — `activeSponsor()` will no longer return it.

### 4.3 Rules (enforce these yourself, not Google's problem)

- Every sponsor must also belong in the ledger on its own merits — if a founder wouldn't care, the brand doesn't belong.
- No more than **one** active homepage sponsor at a time.
- Max **one** sponsor line per Sunday Digest.
- If a sponsor pushes messaging that's hypey, rewrite it or drop the deal.

---

## 5. Consent & compliance

- Banner is in `src/components/ads/ConsentBanner.tsx`. Cookie `acl_consent=1` means yes.
- Until consent is `yes`, the AdSense loader is not injected. This is the simplest route to GDPR/EEA compliance without a full CMP.
- When we need a full CMP (for IAB TCF 2.2, required for some EU advertisers), we'll swap this banner for a certified CMP like Didomi or Osano — the AdSlot API stays the same.

---

## 6. Quick reference — wiring summary

```
src/
  lib/ads.ts                         ← placement registry, env resolvers
  components/
    ads/
      AdSlot.tsx                     ← programmatic surface + house fallback
      SponsorCard.tsx                ← first-party native sponsor row
      ConsentBanner.tsx              ← cookie banner
      AdSenseScript.tsx              ← one-time loader, consent-gated
  data/
    sponsors.ts                      ← direct sponsor deals

# Placements currently live
src/app/page.tsx                     ← SponsorCard + home_inline AdSlot
src/app/offers/[slug]/page.tsx       ← offer_rail AdSlot
src/app/explore/page.tsx             ← explore_inline AdSlot
src/app/layout.tsx                   ← ConsentBanner + AdSenseScript

# Static
public/ads.txt                       ← MUST be added once AdSense gives the line
```

---

## 7. Common questions

**Q: Can I preview how real ads will look before AdSense approves?**
No, not safely. AdSense serves blank until approved, and loading the loader before approval risks a policy strike. The house ads are the design reference; real ads inherit the same frame.

**Q: A visitor declined consent. What shows?**
The house ad. Clean, on-brand. No revenue, but no broken layout and no policy risk.

**Q: Can I turn ads off globally?**
Remove `NEXT_PUBLIC_ADSENSE_CLIENT_ID` from the environment. Every slot reverts to house ads instantly. No code change needed.

**Q: A sponsor paid but I don't want to ship code — can marketing do it?**
Not yet. `src/data/sponsors.ts` is code. Next step (tracked separately): move to a `sponsors` Supabase table so the admin CMS can run them. Until then, PR-based is fine and gives you a natural review step.
