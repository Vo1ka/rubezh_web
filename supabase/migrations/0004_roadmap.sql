-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Adds the Roadmap snapshot table — a versioned, structured read of the
-- Development Lead's Development Plan (milestones, recommended order, and
-- the current sprint), kept separate from Epics/Decisions because it's a
-- planning artifact with its own revision history, not a live tracker.

create table if not exists public.roadmap_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_version text not null,
  capacity_note text,
  milestones jsonb not null default '[]'::jsonb,
  recommended_order jsonb not null default '[]'::jsonb,
  next_sprint jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists roadmap_snapshots_created_at_idx
  on public.roadmap_snapshots (created_at desc);

alter table public.roadmap_snapshots enable row level security;
alter table public.roadmap_snapshots replica identity full;

drop policy if exists "roadmap snapshots are readable by anyone" on public.roadmap_snapshots;
create policy "roadmap snapshots are readable by anyone" on public.roadmap_snapshots for select using (true);
drop policy if exists "roadmap snapshots are insertable by anyone" on public.roadmap_snapshots;
create policy "roadmap snapshots are insertable by anyone" on public.roadmap_snapshots for insert with check (true);
drop policy if exists "roadmap snapshots are updatable by anyone" on public.roadmap_snapshots;
create policy "roadmap snapshots are updatable by anyone" on public.roadmap_snapshots for update using (true) with check (true);
drop policy if exists "roadmap snapshots are deletable by anyone" on public.roadmap_snapshots;
create policy "roadmap snapshots are deletable by anyone" on public.roadmap_snapshots for delete using (true);

alter publication supabase_realtime add table public.roadmap_snapshots;
