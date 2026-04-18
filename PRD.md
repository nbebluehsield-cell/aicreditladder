# AI Credit Ladder — Product Requirements

Reference: see `BLUEPRINT.md` for vision, positioning, and strategy. This document specifies what ships.

---

## 1. Product goals

**Primary**

- Aggregate the best free AI/cloud/startup credits in one place
- Help users quickly assess eligibility and effort
- Capture user emails via low-friction auth + newsletter signup
- Build a reusable media asset for SEO, social sharing, and sponsorship

**Secondary**

- Weekly newsletter around new/updated credit opportunities
- Sponsor-friendly audience of AI founders and builders
- Light sponsor inventory (placements + newsletter sponsorships)
- Defensible data layer around startup programs and application guidance

**Non-goals for v1**

- No automatic claiming or submission on behalf of users
- No web-scale crawling platform
- No community / comments / forum features
- No heavy CRM product

---

## 2. Crisp MVP definition

AI Credit Ladder is a beautifully designed, mobile-first directory of **25–50 verified AI/cloud credit offers** for startups, with:

- structured eligibility metadata
- project-type and founder-stage filtering
- soft-gated advanced details behind magic-link auth
- newsletter capture
- lightweight sponsor system
- admin CMS

---

## 3. Information architecture

**Site sections**

1. Homepage
2. Directory / Explore
3. Offer detail pages
4. Project-type landing pages
5. Founder-stage landing pages
6. Comparison / guide pages
7. Newsletter / alerts landing page
8. Sponsor with us
9. About / methodology / trust
10. Legal: Privacy, Terms, Contact

**Homepage modules**

- Hero: "Free AI Credits for Solo Founders and Early-Stage Startups" with dual CTA: *Explore credits* / *See credits for your project*
- Project-type selector tiles (AI coding tool · chatbot · voice · video · image · workflow automation · RAG · agent · B2B internal AI)
- Featured offers
- "Best for solo founders" rail
- "No VC required" rail
- "Highest value" rail
- "Fastest approvals" rail
- Gated preview section
- Newsletter CTA
- Subtle sponsor strip
- "Recently verified" social proof block

**Offer detail page sections**

- Program summary
- Credit amount + display string
- Category (AI API / cloud / startup perk / model access)
- Eligibility summary
- Solo-founder-friendly: yes / no / unclear
- VC-backed required: yes / no
- Application difficulty (1–5)
- Estimated time to apply
- Estimated response time
- What you need before applying
- What credits can be used for
- Limitations / gotchas
- Official source link
- Last verified date
- Notes / tips
- Best-fit project types
- Founder-stage fit (Now / Next / Later)

---

## 4. Features

**v1 essentials (ship-blocking)**

- Searchable directory of offers
- Filter + sort
- Offer detail pages
- Project-type filtering and project-type landing pages
- "Unlock full details" auth gate (server-enforced)
- Magic-link email auth
- Auto-subscribe to newsletter during signup with explicit consent text
- Admin CMS (CRUD + verification status)
- Last-verified metadata exposed on every offer
- Sponsor placement support
- AdSense integration (approval-ready page structure, privacy/terms/about pages live)
- Basic analytics

**v1.1**

- Saved offers
- Email alerts (new programs, expiring opportunities)
- "Best matches for you" onboarding quiz
- Filter presets: "Solo founder only" · "No VC required"

**v2**

- Application tracker
- User-submitted updates and experiences
- Community verification signals
- API / feed for partners
- Personalized weekly digest

---

## 5. Filters (v1)

- Solo-founder-friendly
- No VC required
- Credit type: AI / cloud / SaaS / mixed
- Easy to apply (difficulty ≤ 2)
- Fast approval (review ≤ 7d)
- Project type (multi-select)
- Founder stage (Now / Next / Later)
- Company registration required (yes / no)
- Corporate domain required (yes / no)
- Geo

---

## 6. Gating strategy

Soft wall. Server-enforced — never CSS blur alone.

**Anonymous users see:** card, logo, value band, category, status, 2–3 top public fields, summary.
**Authenticated users unlock:** full eligibility breakdown, application tips, estimated review time, gotchas, documents needed, compare mode.

Signup flow language must include explicit newsletter opt-in consent.

---

## 7. Taxonomy / offer schema

**Core**

- `id`, `slug`, `title`, `vendor`, `logo_url`, `official_url`
- `source_type` — official / curated / community-reported
- `status` — active / paused / expired / unclear
- `last_verified_at`, `verification_confidence`

**Value**

- `credit_type` — AI API / cloud / SaaS / mixed
- `credit_value_amount`, `credit_value_currency`, `value_display`
- `duration`, `renewal_type` — one-time / monthly / daily / annual / unknown

**Eligibility**

- `geo_restrictions`
- `company_stage`
- `funding_requirement`
- `solo_founder_friendly`
- `requires_company_registration`
- `requires_corporate_domain`
- `requires_partner_referral`
- `requires_vc_backing`

**Workflow**

- `application_url`
- `apply_time_minutes`
- `review_time_estimate`
- `difficulty_score` (1–5)
- `documents_needed`
- `application_tips` *(gated)*
- `common_rejection_reasons` *(gated)*

**Usefulness**

- `best_for` — LLM apps / inference / prototyping / video gen / devtools / infra
- `eligible_products`
- `restrictions`
- `stack_fit_tags`

**Commercial**

- `sponsored`, `sponsor_priority`, `ad_slot_eligible`

**Ladder**

- `founder_stage_fit` — now / next / later (multi)
- `project_types` (multi, via map table)

---

## 8. Data model (Supabase / Postgres)

**Primary tables**

- `offers`
- `offer_sources`
- `offer_updates`
- `vendors`
- `users`
- `saved_offers`
- `newsletter_subscribers`
- `submission_tips`
- `sponsor_campaigns`
- `page_impressions`
- `click_events`

**Support tables**

- `project_types`
- `offer_project_type_map`
- `founder_stages`
- `offer_founder_stage_map`
- `eligibility_tags`
- `offer_tag_map`
- `audit_log`
- `verification_runs`

---

## 9. User flows

**Flow A — Discovery → signup**

1. User lands from search/social
2. Sees featured credit cards and filters
3. Clicks an appealing offer
4. Sees partial detail page with locked advanced detail
5. Enters email for magic link
6. Auth completes
7. Full content unlocks
8. Optionally saves offers and joins alerts

**Flow B — Newsletter signup**

1. User sees alert CTA: "Get new credits weekly"
2. Enters email
3. Receives magic link / welcome email
4. Starts receiving weekly digest

**Flow C — Project-type entry**

1. User lands on homepage
2. Selects project tile (e.g. "Voice app")
3. Lands on project-type page with best-fit offers
4. Same gating and signup flow as Flow A

**Flow D — Admin refresh**

1. Admin sees stale or flagged records
2. Opens source URL, compares facts
3. Updates structured fields
4. Marks last verified date
5. Publishes changes

---

## 10. Refresh / verification system

**Cadence**

- Re-check all active offers once per month (minimum)
- Re-check featured offers weekly
- Re-check sponsored placements before and during campaign

**Automated checks**

- URL availability
- Page content hash / major change detection
- Keyword drift (credit amount, eligibility, expired language)
- Broken application links

**Manual checks**

- Confirm amount and terms
- Confirm eligibility nuance
- Confirm whether offer still applies to startups vs general users

---

## 11. Admin requirements

- Create / edit / archive offers
- Mark verification status and confidence
- Preview public pages (anon + authed views)
- Manage sponsor modules and campaigns
- Export subscribers
- Track top-clicked offers
- Flag stale records and surface verification queue

---

## 12. Email strategy

**Core emails**

- Magic-link sign-in
- Welcome
- Weekly credits digest
- New offer alert
- Sponsored newsletter slot

**Newsletter structure**

- 3–5 newly verified offers
- 1 deeper comparison or guide
- Max 1 sponsor placement in early issues

**Voice:** concise, useful, signal-rich.

---

## 13. Monetization (v1)

- Google AdSense on homepage, directory, comparison pages, guides
- No ads / very light ads on auth wall
- One native sponsor slot on homepage
- One sponsor slot in newsletter
- Direct sponsor inquiry page live from launch

**Rules:** sponsored results labeled · sponsored offers still relevant · trust beats short-term RPM · official results never buried.

**AdSense approval prerequisites (must ship before launch):**

- Privacy Policy
- Terms of Service
- About page
- Contact page
- Clean navigation
- Original, non-thin editorial pages
- Clear source attribution
- Fast mobile UX
- Restrained ad density

---

## 14. Technical stack

- **Frontend:** Next.js
- **Styling:** Tailwind + component system
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth (magic links)
- **CMS/Admin:** internal admin UI in same app
- **Email:** Resend or Postmark
- **Analytics:** GA4 + PostHog (or Plausible)
- **Jobs/Cron:** Supabase scheduled functions / GitHub Actions
- **Hosting:** Vercel

Rationale: fast to ship, strong fit for auth-gated content, easy editorial workflow, easy SEO control, cheap and flexible.

---

## 15. Success metrics

**Acquisition**

- Organic landing pages indexed
- CTR from search/social
- Referrals from Reddit / X / Indie Hackers

**Activation**

- Visitor → email signup rate
- Visitor → unlocked detail conversion
- Clicks to official application pages

**Retention**

- Newsletter open rate
- Returning visitor rate
- Saved offers per user

**Revenue**

- Sponsor inquiries
- Sponsorship fill rate
- Revenue per 1,000 visitors / per 1,000 subscribers

---

## 16. Out of scope for v1

- User comments / community forum
- Application tracker
- Extensive personalization beyond project-type match
- Browser extension
- Account dashboard beyond saved offers

---

## 17. Open questions

- Should sponsored listings be available at launch or after initial audience validation?
- Should user-saved offers ship in MVP or v1.1?
- Should the first release include broader startup perks (non-AI) or stay AI/cloud only?
