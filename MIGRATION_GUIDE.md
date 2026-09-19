# Инструкция по применению миграции 0010_proposals.sql

## Шаг 1: Откройте Supabase SQL Editor

1. Перейдите в ваш проект Supabase: https://supabase.com/dashboard/project/rhkiydcqbzmfuayygzbe
2. В левом меню выберите **SQL Editor**
3. Нажмите **New query**

## Шаг 2: Скопируйте и выполните миграцию

Скопируйте весь текст из файла `supabase/migrations/0010_proposals.sql` и вставьте в SQL Editor, затем нажмите **Run**.

Или выполните напрямую следующие команды:

```sql
-- Расширение owner на epics
alter table public.epics drop constraint if exists epics_owner_section_check;
alter table public.epics add constraint epics_owner_section_check check (
  owner_section is null or owner_section in (
    'analysis', 'project', 'testing', 'development', 'techlead',
    'founder', 'game_design', 'product_manager', 'product_lead'
  )
);

-- Owner на decisions
alter table public.decisions add column if not exists owner text;
alter table public.decisions drop constraint if exists decisions_owner_check;
alter table public.decisions add constraint decisions_owner_check check (
  owner is null or owner in (
    'analysis', 'project', 'testing', 'development', 'techlead',
    'founder', 'game_design', 'product_manager', 'product_lead'
  )
);

-- Таблица proposals
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
  decision_id uuid references public.decisions(id) on delete set null,
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

-- Backlink from decisions
alter table public.decisions add column if not exists proposal_id uuid references public.proposals(id) on delete set null;
```

## Шаг 3: Проверьте применение

После выполнения проверьте, что таблица создана:

```sql
select count(*) from public.proposals;
```

Должно вернуться `0` (таблица пуста, но существует).

## Шаг 4: Протестируйте функциональность

1. Откройте http://localhost:3000/proposals
2. Создайте тестовое Предложение
3. Переведите его в статус "На валидации"
4. Проверьте, что агент вернул вердикт (должны появиться verdict_rationale и verdict_references)

## Переменные окружения

Убедитесь, что в `.env.local` настроены:

```
ANTHROPIC_API_KEY=sk-star-...
ANTHROPIC_BASE_URL=https://ai.starimg.r
```

Без этого агент-валидатор не будет работать.
