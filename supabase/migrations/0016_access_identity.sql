-- RW-16: the site now commits to the repo on a visitor's behalf, so the
-- server needs to know who that is, not just that they're let in. Same shape
-- as check_access_status: one exact token in, that row's email and status
-- out — still no way to list other people's rows.
create or replace function public.access_identity(p_token text)
returns table (email text, status text)
language sql
security definer
set search_path = public
stable
as $$
  select email, status from public.access_requests where token = p_token limit 1;
$$;

grant execute on function public.access_identity(text) to anon, authenticated;
