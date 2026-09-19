-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- RW-1: Proposals — a third, intermediate state between a raw idea and an
-- Epic/Decision. RW-2: extends the owner vocabulary beyond the five
-- discipline Kanban sections to real accountable roles (Founder, Game
-- Design, Product Manager, Product Lead), so a validator verdict's
-- recommended owner has somewhere structural to land.

-- ── Owner vocabulary on epics ───────────────────────────────────────────
alter table public.epics drop constraint if exists epics_owner_section_check;
alter table public.epics add constraint epics_owner_section_check check (
  owner_section is null or owner_section in (
    'analysis', 'project', 'testing', 'development', 'techlead',
    'founder', 'game_design', 'product_manager', 'product_lead'
  )
);

-- ── Owner on decisions (previously untracked structurally) ───────────────
alter table public.decisions add column if not exists owner text;
alter table public.decisions drop constraint if exists decisions_owner_check;
alter table public.decisions add constraint decisions_owner_check check (
  owner is null or owner in (
    'analysis', 'project', 'testing', 'development', 'techlead',
    'founder', 'game_design', 'product_manager', 'product_lead'
  )
);

-- ── Proposals ────────────────────────────────────────────────────────────
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  proposed_by text,
  owner text check (
    owner is null or owner in (
      'analysis', 'project', 'testing', 'development', 'techlead',
      'founder', 'game_design', 'product_manager', 'product_lead'
    )
  ),
  epic_id uuid references public.epics(id) on delete set null,
  status text not null default 'new' check (
    status in (
      'new', 'validating', 'approved', 'rejected',
      'blocked_product', 'blocked_design', 'blocked_technical', 'needs_prototype'
    )
  ),
  -- RW-3 verdict, written by the validator agent. The agent never writes to
  -- `status` — only these fields. A human decides what happens to status.
  verdict text check (
    verdict is null or verdict in (
      'aligned', 'product_issue', 'design_issue', 'technical_decision',
      'needs_prototype', 'out_of_scope'
    )
  ),
  verdict_rationale text,
  verdict_references text,
  verdict_owner text,
  verdict_at timestamptz,
  verdict_error text,
  -- RW-4: backlink once promoted to a Decision.
  decision_id uuid references public.decisions(id) on delete set null,
  -- RW-5: backlink to the Playground note this was raised from, if any.
  source_note_id uuid references public.playground_notes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at
  before update on public.proposals
  for each row
  execute function public.set_updated_at();

alter table public.proposals enable row level security;
alter table public.proposals replica identity full;

drop policy if exists "proposals are readable by anyone" on public.proposals;
create policy "proposals are readable by anyone" on public.proposals for select using (true);
drop policy if exists "proposals are insertable by anyone" on public.proposals;
create policy "proposals are insertable by anyone" on public.proposals for insert with check (true);
drop policy if exists "proposals are updatable by anyone" on public.proposals;
create policy "proposals are updatable by anyone" on public.proposals for update using (true) with check (true);
drop policy if exists "proposals are deletable by anyone" on public.proposals;
create policy "proposals are deletable by anyone" on public.proposals for delete using (true);

alter publication supabase_realtime add table public.proposals;

-- ── Backlink from decisions to the proposal that produced them (RW-4) ────
alter table public.decisions add column if not exists proposal_id uuid references public.proposals(id) on delete set null;
