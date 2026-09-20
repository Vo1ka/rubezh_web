-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Links an Epic to a (repo, path) pair rather than a whole repo — rubezh_full
-- is a single Gradle multi-module monorepo, so "Epic -> repo" would point
-- every Epic at the same repo. A path is optional: null means "this whole
-- repo belongs to this Epic for now" (used for mine_boevka, a standalone
-- combat repo that will be merged into rubezh_full's combat/ tree later).
-- An Epic can have more than one link (e.g. EPIC-005 touches both
-- combat/weapons and progression/ in rubezh_full).

create table if not exists public.epic_repos (
  id uuid primary key default gen_random_uuid(),
  epic_id uuid not null references public.epics(id) on delete cascade,
  repo_owner text not null,
  repo_name text not null,
  path text,
  label text,
  created_at timestamptz not null default now()
);

create index if not exists epic_repos_epic_id_idx on public.epic_repos (epic_id);
create unique index if not exists epic_repos_unique_idx
  on public.epic_repos (epic_id, repo_owner, repo_name, coalesce(path, ''));

alter table public.epic_repos enable row level security;
alter table public.epic_repos replica identity full;

drop policy if exists "epic repos are readable by anyone" on public.epic_repos;
create policy "epic repos are readable by anyone" on public.epic_repos for select using (true);
drop policy if exists "epic repos are insertable by anyone" on public.epic_repos;
create policy "epic repos are insertable by anyone" on public.epic_repos for insert with check (true);
drop policy if exists "epic repos are updatable by anyone" on public.epic_repos;
create policy "epic repos are updatable by anyone" on public.epic_repos for update using (true) with check (true);
drop policy if exists "epic repos are deletable by anyone" on public.epic_repos;
create policy "epic repos are deletable by anyone" on public.epic_repos for delete using (true);

alter publication supabase_realtime add table public.epic_repos;
