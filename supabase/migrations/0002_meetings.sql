-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Creates the "meetings" table for logging team discussions and decisions.

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date not null default current_date,
  attendees text,
  summary text,
  decisions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meetings_date_idx
  on public.meetings (meeting_date desc);

drop trigger if exists meetings_set_updated_at on public.meetings;
create trigger meetings_set_updated_at
  before update on public.meetings
  for each row
  execute function public.set_updated_at();

-- Same open-access model as notes: no auth, gated at the Vercel edge instead.
alter table public.meetings enable row level security;
alter table public.meetings replica identity full;

drop policy if exists "meetings are readable by anyone" on public.meetings;
create policy "meetings are readable by anyone"
  on public.meetings for select
  using (true);

drop policy if exists "meetings are insertable by anyone" on public.meetings;
create policy "meetings are insertable by anyone"
  on public.meetings for insert
  with check (true);

drop policy if exists "meetings are updatable by anyone" on public.meetings;
create policy "meetings are updatable by anyone"
  on public.meetings for update
  using (true)
  with check (true);

drop policy if exists "meetings are deletable by anyone" on public.meetings;
create policy "meetings are deletable by anyone"
  on public.meetings for delete
  using (true);

alter publication supabase_realtime add table public.meetings;
