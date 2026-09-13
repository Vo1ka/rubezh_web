-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Adds an email-gate for the whole site: a visitor submits their email and a
-- random token (kept in a cookie); they're let in only once someone flips
-- their row's status to 'approved' — which is done by hand in the Table
-- Editor here, not through the app. Deliberately no admin API/page for this:
-- it needs the anon key to stay unable to read other people's rows or
-- self-approve, and a one-person team doesn't need more than the table editor.

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists access_requests_token_idx on public.access_requests (token);

alter table public.access_requests enable row level security;

-- Anyone can file a request, but only as 'pending' — status/decided_at can't
-- be set at insert time (no column list in the check means it applies to the
-- row as submitted; the app never sends status, so the column default holds).
drop policy if exists "access requests are insertable by anyone" on public.access_requests;
create policy "access requests are insertable by anyone" on public.access_requests
  for insert with check (status = 'pending' and decided_at is null);

-- No select/update/delete policies for anon on purpose: nobody can list
-- emails or flip their own status to 'approved' through the API.

-- The only way the app can read a status back is this function, which
-- returns just the status for one exact token — no enumeration possible.
create or replace function public.check_access_status(p_token text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select status from public.access_requests where token = p_token limit 1;
$$;

grant execute on function public.check_access_status(text) to anon, authenticated;

alter table public.access_requests replica identity full;
alter publication supabase_realtime add table public.access_requests;
