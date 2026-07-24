-- ============================================================
--  Sushi Date Invite — database schema
--  Run this in the Supabase SQL editor (or via psql) once,
--  against a fresh Supabase project.
-- ============================================================

create extension if not exists "pgcrypto";

-- One row per page load, used only to count total visits.
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  created_at timestamptz not null default now(),
  device_category text not null check (device_category in ('mobile', 'tablet', 'desktop')),
  user_agent text,
  referrer text,
  ip_hash text,
  ip_full inet
);

create index if not exists visits_created_at_idx on public.visits (created_at);
create index if not exists visits_session_id_idx on public.visits (session_id);

-- One row per submitted answer.
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  answer text not null check (answer in ('yes', 'no')),
  chosen_date date,
  created_at_utc timestamptz not null default now(),
  created_at_cairo text not null,
  device_category text not null check (device_category in ('mobile', 'tablet', 'desktop')),
  user_agent text,
  referrer text,
  ip_hash text,
  ip_full inet,
  is_test boolean not null default false
);

-- Prevent duplicate accidental submissions from the same page session.
create unique index if not exists responses_session_id_unique
  on public.responses (session_id)
  where is_test = false;

create index if not exists responses_created_at_idx on public.responses (created_at_utc);

-- One row per scene a visitor reaches (opening, prediction, reveal,
-- decision, yes, no) — lets the admin see how far each session got,
-- not just whether they answered.
create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  scene text not null check (scene in ('opening', 'prediction', 'reveal', 'decision', 'yes', 'no')),
  created_at timestamptz not null default now(),
  is_test boolean not null default false
);

create index if not exists page_events_created_at_idx on public.page_events (created_at);
create index if not exists page_events_session_id_idx on public.page_events (session_id);

-- Row Level Security: no client-side access whatsoever. All reads/writes
-- go through the server using the service role key, which bypasses RLS.
-- This blocks anon/public API access entirely.
alter table public.visits enable row level security;
alter table public.responses enable row level security;
alter table public.page_events enable row level security;

-- No policies are created intentionally — with RLS enabled and zero
-- policies, the anon/authenticated roles have no access at all.

-- ============================================================
--  Retention: automatically delete rows older than the
--  configured retention window (default 30 days). This function
--  is invoked by the app's /api/cleanup route (see README), which
--  should be triggered on a daily schedule (e.g. Vercel Cron).
-- ============================================================
create or replace function public.purge_old_rows(retention_days integer default 30)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.visits
    where created_at < now() - (retention_days || ' days')::interval;

  delete from public.responses
    where created_at_utc < now() - (retention_days || ' days')::interval;

  delete from public.page_events
    where created_at < now() - (retention_days || ' days')::interval;
end;
$$;
