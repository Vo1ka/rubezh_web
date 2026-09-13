-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Adds individual Development Task / Spike cards (F-1, CF-2, SPK-1, ...) from
-- the Development Plan's Task Map, each addressable by its own slug with the
-- full spec text — not just the one-line summary shown in the Roadmap timeline.

create table if not exists public.roadmap_tasks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null,
  title text not null,
  kind text not null default 'task' check (kind in ('task', 'spike')),
  epic_id uuid references public.epics(id) on delete set null,
  status text,
  fields jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roadmap_tasks_slug_idx on public.roadmap_tasks (slug);
create index if not exists roadmap_tasks_epic_id_idx on public.roadmap_tasks (epic_id);

drop trigger if exists roadmap_tasks_set_updated_at on public.roadmap_tasks;
create trigger roadmap_tasks_set_updated_at
  before update on public.roadmap_tasks
  for each row
  execute function public.set_updated_at();

alter table public.roadmap_tasks enable row level security;
alter table public.roadmap_tasks replica identity full;

drop policy if exists "roadmap tasks are readable by anyone" on public.roadmap_tasks;
create policy "roadmap tasks are readable by anyone" on public.roadmap_tasks for select using (true);
drop policy if exists "roadmap tasks are insertable by anyone" on public.roadmap_tasks;
create policy "roadmap tasks are insertable by anyone" on public.roadmap_tasks for insert with check (true);
drop policy if exists "roadmap tasks are updatable by anyone" on public.roadmap_tasks;
create policy "roadmap tasks are updatable by anyone" on public.roadmap_tasks for update using (true) with check (true);
drop policy if exists "roadmap tasks are deletable by anyone" on public.roadmap_tasks;
create policy "roadmap tasks are deletable by anyone" on public.roadmap_tasks for delete using (true);

alter publication supabase_realtime add table public.roadmap_tasks;
