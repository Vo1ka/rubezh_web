-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Creates "playground_comments" so each playground note can have a thread of
-- replies underneath it, viewed on its own /playground/[id] page.

create table if not exists public.playground_comments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.playground_notes(id) on delete cascade,
  content text not null,
  author text,
  created_at timestamptz not null default now()
);

create index if not exists playground_comments_note_id_idx
  on public.playground_comments (note_id, created_at);

-- Same open-access model as playground_notes: no auth, gated at the Vercel edge instead.
alter table public.playground_comments enable row level security;
alter table public.playground_comments replica identity full;

drop policy if exists "playground comments are readable by anyone"
  on public.playground_comments;
create policy "playground comments are readable by anyone"
  on public.playground_comments for select
  using (true);

drop policy if exists "playground comments are insertable by anyone"
  on public.playground_comments;
create policy "playground comments are insertable by anyone"
  on public.playground_comments for insert
  with check (true);

drop policy if exists "playground comments are deletable by anyone"
  on public.playground_comments;
create policy "playground comments are deletable by anyone"
  on public.playground_comments for delete
  using (true);

alter publication supabase_realtime add table public.playground_comments;
