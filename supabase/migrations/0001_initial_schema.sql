-- ============================================================================
-- AI Credit Ladder — initial schema
--
-- Implements the data model described in PRD §7 and §8.
--
-- Design notes:
--   * Public (anonymous) reads return only non-gated fields via the
--     `offers_public` view. RLS on the base table restricts direct reads
--     so the anon key cannot unmask gated columns.
--   * Authenticated users get full reads via `offers_authenticated`.
--   * Mutations are service-role only — admin CMS uses a privileged client.
--   * `newsletter_subscribers` captures explicit consent text for GDPR.
-- ============================================================================

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────────────────
do $$ begin
  create type credit_type as enum ('ai_api', 'cloud', 'saas', 'mixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type offer_status as enum ('active', 'paused', 'expired', 'unclear');
exception when duplicate_object then null; end $$;

do $$ begin
  create type source_type as enum ('official', 'curated', 'community_reported');
exception when duplicate_object then null; end $$;

do $$ begin
  create type renewal_type as enum ('one_time', 'monthly', 'daily', 'annual', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type founder_stage as enum ('now', 'next', 'later');
exception when duplicate_object then null; end $$;

do $$ begin
  create type yes_no_unclear as enum ('yes', 'no', 'unclear');
exception when duplicate_object then null; end $$;

-- ─── Lookup tables ──────────────────────────────────────────────────────────
create table if not exists project_types (
  slug text primary key,
  label text not null,
  description text,
  position int not null default 0
);

-- ─── Core tables ────────────────────────────────────────────────────────────
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  website_url text,
  created_at timestamptz not null default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  vendor_id uuid references vendors(id) on delete set null,
  vendor_name text not null,
  logo_url text,
  official_url text not null,

  source_type source_type not null default 'curated',
  status offer_status not null default 'active',
  last_verified_at timestamptz,
  verification_confidence numeric(3, 2) check (
    verification_confidence is null
    or (verification_confidence >= 0 and verification_confidence <= 1)
  ),
  source_snapshot_url text,

  -- Value
  credit_type credit_type not null,
  credit_value_amount numeric,
  credit_value_currency text default 'USD',
  value_display text not null,
  duration text,
  renewal_type renewal_type not null default 'unknown',

  -- Eligibility
  geo_restrictions text[],
  company_stage text,
  funding_requirement text,
  solo_founder_friendly yes_no_unclear not null default 'unclear',
  requires_company_registration boolean not null default false,
  requires_corporate_domain boolean not null default false,
  requires_partner_referral boolean not null default false,
  requires_vc_backing boolean not null default false,

  -- Workflow
  application_url text not null,
  apply_time_minutes int,
  review_time_estimate text,
  difficulty_score int check (difficulty_score is null or difficulty_score between 1 and 5),

  -- Gated fields — withheld from anonymous users
  documents_needed text[],
  application_tips text,
  common_rejection_reasons text[],

  -- Usefulness
  best_for text[],
  eligible_products text[],
  restrictions text[],
  stack_fit_tags text[],

  -- Commercial
  sponsored boolean not null default false,
  sponsor_priority int,
  ad_slot_eligible boolean not null default true,

  -- Ladder
  founder_stage_fit founder_stage[] not null default '{}',
  project_types text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_status_idx on offers(status);
create index if not exists offers_stage_idx on offers using gin(founder_stage_fit);
create index if not exists offers_project_idx on offers using gin(project_types);
create index if not exists offers_last_verified_idx on offers(last_verified_at desc nulls last);

-- ─── Newsletter + users ─────────────────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  consent_text text not null,
  consented_at timestamptz not null default now(),
  source text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists saved_offers (
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references offers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, offer_id)
);

-- ─── Sponsor + ops ──────────────────────────────────────────────────────────
create table if not exists sponsor_campaigns (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references offers(id) on delete set null,
  sponsor_name text not null,
  sponsor_contact text,
  notes text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists verification_runs (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers(id) on delete cascade,
  verified_by uuid references auth.users(id) on delete set null,
  outcome text not null,
  notes text,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists click_events (
  id bigserial primary key,
  offer_id uuid references offers(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,
  referrer text,
  created_at timestamptz not null default now()
);

-- ─── Trigger to keep updated_at honest ──────────────────────────────────────
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists offers_touch on offers;
create trigger offers_touch before update on offers
  for each row execute function touch_updated_at();

-- ─── Public view: anonymous-safe projection of offers ───────────────────────
-- Gated fields are NULL at the SQL level so there's no path to leak them
-- from an anon key.
create or replace view offers_public as
  select
    id,
    slug,
    title,
    vendor_name,
    logo_url,
    official_url,
    source_type,
    status,
    last_verified_at,
    verification_confidence,
    credit_type,
    credit_value_amount,
    credit_value_currency,
    value_display,
    duration,
    renewal_type,
    geo_restrictions,
    company_stage,
    funding_requirement,
    solo_founder_friendly,
    requires_company_registration,
    requires_corporate_domain,
    requires_partner_referral,
    requires_vc_backing,
    application_url,
    apply_time_minutes,
    review_time_estimate,
    difficulty_score,
    null::text[]   as documents_needed,
    null::text     as application_tips,
    null::text[]  as common_rejection_reasons,
    best_for,
    eligible_products,
    restrictions,
    stack_fit_tags,
    sponsored,
    sponsor_priority,
    ad_slot_eligible,
    founder_stage_fit,
    project_types,
    created_at,
    updated_at
  from offers
  where status in ('active', 'unclear');

-- Authenticated view exposes everything (RLS on base table gates it).
create or replace view offers_authenticated as
  select * from offers where status in ('active', 'unclear');

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table offers enable row level security;
alter table newsletter_subscribers enable row level security;
alter table saved_offers enable row level security;
alter table sponsor_campaigns enable row level security;
alter table verification_runs enable row level security;
alter table click_events enable row level security;
alter table vendors enable row level security;

-- offers: nobody reads directly (force use of views). Service-role bypasses.
drop policy if exists "offers no direct read" on offers;
create policy "offers no direct read" on offers for select using (false);

-- vendors: public read
drop policy if exists "vendors public read" on vendors;
create policy "vendors public read" on vendors for select using (true);

-- newsletter: writes via server action only (service role). No public select.
drop policy if exists "newsletter no select" on newsletter_subscribers;
create policy "newsletter no select" on newsletter_subscribers for select using (false);

-- saved_offers: a user sees/mutates only their own.
drop policy if exists "saved_offers own read" on saved_offers;
create policy "saved_offers own read" on saved_offers for select using (auth.uid() = user_id);

drop policy if exists "saved_offers own write" on saved_offers;
create policy "saved_offers own write" on saved_offers for insert with check (auth.uid() = user_id);

drop policy if exists "saved_offers own delete" on saved_offers;
create policy "saved_offers own delete" on saved_offers for delete using (auth.uid() = user_id);

-- sponsor_campaigns / verification_runs / click_events: service-role only.
drop policy if exists "sponsor no public" on sponsor_campaigns;
create policy "sponsor no public" on sponsor_campaigns for select using (false);

drop policy if exists "verification no public" on verification_runs;
create policy "verification no public" on verification_runs for select using (false);

drop policy if exists "click no public" on click_events;
create policy "click no public" on click_events for select using (false);

-- Views are readable by everyone (the gating is inside the view).
grant select on offers_public to anon, authenticated;
grant select on offers_authenticated to authenticated;
grant select on project_types to anon, authenticated;
grant select on vendors to anon, authenticated;
