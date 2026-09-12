-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Creates the "notes" table backing the per-section kanban playground.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  section text not null check (
    section in ('analysis', 'project', 'testing', 'development', 'techlead')
  ),
  title text not null,
  content text,
  status text not null default 'backlog' check (
    status in ('backlog', 'in_progress', 'review', 'done')
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high')
  ),
  position integer not null default 0,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_section_status_idx
  on public.notes (section, status, position);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

-- No auth in this app: RLS is enabled but open to anyone with the anon key,
-- since access is gated separately at the Vercel edge (email allowlist).
alter table public.notes enable row level security;

drop policy if exists "notes are readable by anyone" on public.notes;
create policy "notes are readable by anyone"
  on public.notes for select
  using (true);

drop policy if exists "notes are insertable by anyone" on public.notes;
create policy "notes are insertable by anyone"
  on public.notes for insert
  with check (true);

drop policy if exists "notes are updatable by anyone" on public.notes;
create policy "notes are updatable by anyone"
  on public.notes for update
  using (true)
  with check (true);

drop policy if exists "notes are deletable by anyone" on public.notes;
create policy "notes are deletable by anyone"
  on public.notes for delete
  using (true);

-- Realtime: lets the sidebar and kanban board stay in sync across browsers.
-- FULL replica identity so DELETE events carry every column (needed for the
-- `section=eq.…` realtime filter to match on deletes, not just inserts/updates).
alter table public.notes replica identity full;
alter publication supabase_realtime add table public.notes;
