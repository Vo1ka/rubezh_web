-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Creates the "playground_notes" table for the free-form developer playground:
-- no title, no status, no discipline — just a wall of notes anyone can post and remove.

create table if not exists public.playground_notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists playground_notes_created_at_idx
  on public.playground_notes (created_at desc);

-- Defined here too (not just in 0001_notes.sql) so this migration doesn't
-- depend on that one having run first.
create or replace function public.set_updated_at()
returns trigger as $func$
begin
  new.updated_at = now();
  return new;
end;
$func$ language plpgsql;

drop trigger if exists playground_notes_set_updated_at
  on public.playground_notes;
create trigger playground_notes_set_updated_at
  before update on public.playground_notes
  for each row
  execute function public.set_updated_at();

-- Same open-access model as notes/meetings: no auth, gated at the Vercel edge instead.
alter table public.playground_notes enable row level security;
alter table public.playground_notes replica identity full;

drop policy if exists "playground notes are readable by anyone"
  on public.playground_notes;
create policy "playground notes are readable by anyone"
  on public.playground_notes for select
  using (true);

drop policy if exists "playground notes are insertable by anyone"
  on public.playground_notes;
create policy "playground notes are insertable by anyone"
  on public.playground_notes for insert
  with check (true);

drop policy if exists "playground notes are updatable by anyone"
  on public.playground_notes;
create policy "playground notes are updatable by anyone"
  on public.playground_notes for update
  using (true)
  with check (true);

drop policy if exists "playground notes are deletable by anyone"
  on public.playground_notes;
create policy "playground notes are deletable by anyone"
  on public.playground_notes for delete
  using (true);

alter publication supabase_realtime add table public.playground_notes;
