-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- RW-11: Kanban <-> Epic Map linking. Lets a discipline Kanban note point at
-- the Epic it belongs to, so an Epic's detail page can show its in-flight
-- Kanban work and a Kanban card can show which Epic it serves.

alter table public.notes add column if not exists epic_id uuid references public.epics(id) on delete set null;

create index if not exists notes_epic_id_idx on public.notes (epic_id);
