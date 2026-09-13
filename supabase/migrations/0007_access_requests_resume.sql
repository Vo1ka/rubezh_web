-- Run this once in the Supabase SQL Editor, after 0006_access_requests.sql.
--
-- Fixes a UX bug in the email gate: the token lives only in a browser
-- cookie, so anyone who loses it (cleared cookies, different browser or
-- device, a Vercel preview vs. production domain) lands back on
-- /request-access, resubmits the same email, and — before this migration —
-- got a brand new 'pending' row every time. Approving one row never
-- affected the others, so the same person could end up "approved" in the
-- table while the token sitting in their current browser still points at a
-- different, unapproved row.
--
-- This adds an RPC that looks up an existing row for the email first and
-- hands back its token/status instead of blindly inserting a duplicate; it
-- only creates a new row when the email truly has none yet. The app's
-- request-access page is switched to call this instead of inserting
-- directly.

create or replace function public.request_or_resume_access(p_email text)
returns table(token text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_token text;
  v_status text;
begin
  select ar.token, ar.status
    into v_token, v_status
  from public.access_requests ar
  where lower(ar.email) = v_email
  order by
    case ar.status when 'approved' then 0 when 'pending' then 1 else 2 end,
    ar.requested_at desc
  limit 1;

  if v_token is null then
    v_token := gen_random_uuid()::text;
    v_status := 'pending';
    insert into public.access_requests (email, token, status)
    values (p_email, v_token, v_status);
  end if;

  return query select v_token, v_status;
end;
$$;

grant execute on function public.request_or_resume_access(text) to anon, authenticated;
