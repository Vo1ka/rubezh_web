-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Change history for Kanban notes: an append-only log written by a trigger on
-- `notes`, so every insert/update/delete is captured regardless of which
-- client made it. `note_id` has no FK (and no cascade) so history survives
-- the note being deleted.

create table if not exists public.notes_history (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null,
  note_title text not null,
  section text not null,
  change_type text not null check (
    change_type in (
      'created', 'deleted', 'status_changed', 'priority_changed',
      'epic_changed', 'title_changed'
    )
  ),
  old_value text,
  new_value text,
  changed_at timestamptz not null default now()
);

create index if not exists notes_history_note_id_idx on public.notes_history (note_id, changed_at desc);
create index if not exists notes_history_section_idx on public.notes_history (section, changed_at desc);

alter table public.notes_history enable row level security;

drop policy if exists "notes history readable by anyone" on public.notes_history;
create policy "notes history readable by anyone" on public.notes_history for select using (true);
drop policy if exists "notes history insertable by anyone" on public.notes_history;
create policy "notes history insertable by anyone" on public.notes_history for insert with check (true);

create or replace function public.log_notes_history()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
    values (new.id, new.title, new.section, 'created', null, new.title);
    return new;
  elsif TG_OP = 'UPDATE' then
    if old.status is distinct from new.status then
      insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
      values (new.id, new.title, new.section, 'status_changed', old.status, new.status);
    end if;
    if old.priority is distinct from new.priority then
      insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
      values (new.id, new.title, new.section, 'priority_changed', old.priority, new.priority);
    end if;
    if old.epic_id is distinct from new.epic_id then
      insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
      values (new.id, new.title, new.section, 'epic_changed', old.epic_id::text, new.epic_id::text);
    end if;
    if old.title is distinct from new.title then
      insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
      values (new.id, new.title, new.section, 'title_changed', old.title, new.title);
    end if;
    return new;
  elsif TG_OP = 'DELETE' then
    insert into public.notes_history (note_id, note_title, section, change_type, old_value, new_value)
    values (old.id, old.title, old.section, 'deleted', old.title, null);
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists notes_log_history on public.notes;
create trigger notes_log_history
  after insert or update or delete on public.notes
  for each row
  execute function public.log_notes_history();

alter publication supabase_realtime add table public.notes_history;
