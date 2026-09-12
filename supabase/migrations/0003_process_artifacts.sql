-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Adds Epic Map, Decisions/Risks/Open Questions log, and the document
-- version registry — the three structural pieces the note/meeting layer
-- can't express on its own.

-- ── Epics ────────────────────────────────────────────────────────────────
create table if not exists public.epics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  owner_section text check (
    owner_section is null or owner_section in
      ('analysis', 'project', 'testing', 'development', 'techlead')
  ),
  mvp_priority text not null default 'P1' check (
    mvp_priority in ('P0', 'P1', 'P2')
  ),
  status text not null default 'not_started' check (
    status in (
      'not_started', 'in_progress', 'blocked_design', 'blocked_technical',
      'blocked_product', 'needs_prototype', 'done'
    )
  ),
  risk_level text check (risk_level is null or risk_level in ('low', 'medium', 'high')),
  depends_on uuid[] not null default '{}',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists epics_set_updated_at on public.epics;
create trigger epics_set_updated_at
  before update on public.epics
  for each row
  execute function public.set_updated_at();

alter table public.epics enable row level security;
alter table public.epics replica identity full;

drop policy if exists "epics are readable by anyone" on public.epics;
create policy "epics are readable by anyone" on public.epics for select using (true);
drop policy if exists "epics are insertable by anyone" on public.epics;
create policy "epics are insertable by anyone" on public.epics for insert with check (true);
drop policy if exists "epics are updatable by anyone" on public.epics;
create policy "epics are updatable by anyone" on public.epics for update using (true) with check (true);
drop policy if exists "epics are deletable by anyone" on public.epics;
create policy "epics are deletable by anyone" on public.epics for delete using (true);

alter publication supabase_realtime add table public.epics;

-- ── Decisions / Risks / Open Questions ──────────────────────────────────
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('decision', 'risk', 'open_question')),
  title text not null,
  description text,
  status text,
  epic_id uuid references public.epics(id) on delete set null,
  related_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decisions_type_idx on public.decisions (type);

drop trigger if exists decisions_set_updated_at on public.decisions;
create trigger decisions_set_updated_at
  before update on public.decisions
  for each row
  execute function public.set_updated_at();

alter table public.decisions enable row level security;
alter table public.decisions replica identity full;

drop policy if exists "decisions are readable by anyone" on public.decisions;
create policy "decisions are readable by anyone" on public.decisions for select using (true);
drop policy if exists "decisions are insertable by anyone" on public.decisions;
create policy "decisions are insertable by anyone" on public.decisions for insert with check (true);
drop policy if exists "decisions are updatable by anyone" on public.decisions;
create policy "decisions are updatable by anyone" on public.decisions for update using (true) with check (true);
drop policy if exists "decisions are deletable by anyone" on public.decisions;
create policy "decisions are deletable by anyone" on public.decisions for delete using (true);

alter publication supabase_realtime add table public.decisions;

-- ── Document registry ────────────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  doc_key text not null,
  title text not null,
  version text not null,
  url text not null,
  changelog text,
  is_baseline boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists documents_doc_key_idx on public.documents (doc_key, created_at desc);

alter table public.documents enable row level security;
alter table public.documents replica identity full;

drop policy if exists "documents are readable by anyone" on public.documents;
create policy "documents are readable by anyone" on public.documents for select using (true);
drop policy if exists "documents are insertable by anyone" on public.documents;
create policy "documents are insertable by anyone" on public.documents for insert with check (true);
drop policy if exists "documents are updatable by anyone" on public.documents;
create policy "documents are updatable by anyone" on public.documents for update using (true) with check (true);
drop policy if exists "documents are deletable by anyone" on public.documents;
create policy "documents are deletable by anyone" on public.documents for delete using (true);

alter publication supabase_realtime add table public.documents;
