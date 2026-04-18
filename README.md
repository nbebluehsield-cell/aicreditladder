# AI Credit Ladder

The fastest way for solo AI founders to find and claim free AI and cloud credits.

See [BLUEPRINT.md](./BLUEPRINT.md) for vision and strategy, and [PRD.md](./PRD.md) for the product spec.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4**
- **Supabase** (Postgres + Auth magic links)
- **Resend** (transactional + newsletter)
- **Vercel** (hosting)

## Getting started

```bash
cp .env.local.example .env.local
# Fill in Supabase values
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
src/
  app/              # Routes (App Router)
  lib/
    supabase/       # Browser + server Supabase clients
    types.ts        # Offer, ProjectType, ladder enums
```

Planned routes (v1):

- `/` — homepage with project-type entry
- `/explore` — full directory with filters
- `/offers/[slug]` — offer detail (soft-gated)
- `/projects/[slug]` — project-type landing pages
- `/stages/[slug]` — founder-stage landing pages (now/next/later)
- `/newsletter`, `/sponsor`, `/about`, `/methodology`
- `/admin` — internal CMS
