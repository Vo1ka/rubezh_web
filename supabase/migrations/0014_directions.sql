-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- RW-13: direction tags. Directions themselves live in directions.yaml in
-- Vo1ka/rubezh_full (RW-12), not in this database, so the tags are plain ids
-- with no foreign key — an id that disappears from the registry is flagged by
-- the site as "направление не найдено" instead of silently dropping the link.
--
-- A Kanban card belongs to exactly one direction (one person, one area);
-- Epics, Decisions, Proposals and Documents can span several (e.g. D-38 is
-- both combat and weapons).

-- ── Kanban cards: one direction ─────────────────────────────────────────
alter table public.notes add column if not exists direction text;
alter table public.notes drop constraint if exists notes_direction_format_check;
alter table public.notes add constraint notes_direction_format_check
  check (direction is null or direction ~ '^[a-z0-9_-]+$');
create index if not exists notes_direction_idx on public.notes (direction);

-- ── Epics, Decisions, Proposals, Documents: one or more ──────────────────
alter table public.epics     add column if not exists directions text[] not null default '{}';
alter table public.decisions add column if not exists directions text[] not null default '{}';
alter table public.proposals add column if not exists directions text[] not null default '{}';
alter table public.documents add column if not exists directions text[] not null default '{}';

-- GIN so "everything tagged combat" (directions @> '{combat}') stays an index lookup.
create index if not exists epics_directions_idx     on public.epics     using gin (directions);
create index if not exists decisions_directions_idx on public.decisions using gin (directions);
create index if not exists proposals_directions_idx on public.proposals using gin (directions);
create index if not exists documents_directions_idx on public.documents using gin (directions);

-- ── Initial tagging of existing records (10.10.2026) ─────────────────────
-- Only directions present in directions.yaml are used. Records about areas the
-- registry doesn't cover yet (progression / Great Tree, multiplayer,
-- retention, the animation pipeline) and project-wide records are left
-- untagged on purpose. Guards (= '{}' / is null) keep a re-run from
-- overwriting tags edited on the site.

update public.epics e set directions = v.dirs
from (values
  ('1da56b60-842e-4b22-9ef5-852453110bff'::uuid, '{structures}'::text[]),            -- EPIC-001 Curated Region & Exploration
  ('da494c15-920f-4ce0-a761-a682af874a87', '{combat}'),                             -- EPIC-002 Core Combat System
  ('d512e0b5-2a9c-429d-b7a2-e15673fd0b50', '{combat}'),                             -- EPIC-003 Combat Network Sync
  ('18489361-2586-489c-bbd7-e576f9e89646', '{mobs}'),                               -- EPIC-004 Custom Mobs
  ('715f182f-0beb-4bd2-a717-0c30dff430d3', '{combat,weapons_armor}'),               -- EPIC-005 Build & Ability Progression
  ('61a71136-48cf-4d24-ae8d-8134bdbfa136', '{crafting}'),                           -- EPIC-006 Survival & Crafting Loop
  ('8dddb901-8527-455f-9d9d-03c1dd842f0b', '{lore}'),                               -- EPIC-007 Lore Delivery
  ('ab2df8cb-bd95-489d-a456-b1045c0014d1', '{mobs,combat}')                         -- EPIC-008 Boss Encounter
  -- EPIC-009, -010, -011 (multiplayer), EPIC-012 (retention): no direction in the registry yet
) as v(id, dirs)
where e.id = v.id and e.directions = '{}';

update public.notes n set direction = v.dir
from (values
  ('98bd2d4b-bbdf-4324-9065-1a5cd0251b2f'::uuid, 'weapons_armor'),  -- Разные виды вооружения
  ('e190f341-08fd-4108-9fae-1c46948d223c', 'weapons_armor'),        -- W-01 Тяжёлое оружие
  ('e6a8847a-2cb1-4871-b247-f4c52932c9a4', 'weapons_armor'),        -- W-02 Лёгкое оружие
  ('f685d484-dae5-44f9-8267-9dce16a72d78', 'weapons_armor'),        -- W-03 Лук / дальнобойное
  ('c52edf2f-62ea-4676-8f19-d5b6b83511ac', 'weapons_armor'),        -- W-04 Катализатор на школу
  ('8f2e7a86-96ca-4588-8c27-4d16a0ae3656', 'mobs'),                 -- M-01 Проверка контракта D-39
  ('729edf76-5958-4c5f-a643-644713b0159a', 'mobs'),                 -- M-02 Отбор мод-мобов
  ('05a8e628-d08a-4907-8d7b-27819b6779c2', 'mobs'),                 -- M-03 Datapack rubezh:combatants
  ('9508fff9-6cb1-4c12-8149-e081a7d886bd', 'mobs'),                 -- M-04 Множители band: boss
  ('f5c0b8e4-8f6c-495d-b278-e02e99769421', 'mobs'),                 -- M-05 Стихийный урон у мобов
  ('ee77d617-8795-4826-a806-b1d70f28b197', 'combat'),               -- S-01 Второе заклинание
  ('f25078da-8094-4143-b643-308eb8e719a2', 'combat')                -- AN-03 Презентация каста
  -- T-01..T-03 (Great Tree) and AN-01 (animation pipeline): no direction in the registry yet
) as v(id, dir)
where n.id = v.id and n.direction is null;

update public.decisions d set directions = v.dirs
from (values
  ('f523a83b-1043-4a66-bd0e-0e3c0192081a'::uuid, '{combat}'::text[]),  -- Защитный инструмент боя
  ('41de27ef-a2d6-4ecb-92cb-ac384929e12b', '{combat}'),                -- Порог success/failure Spike 1
  ('dec151d9-e9b4-4ce4-92b4-58fa9a1ebab1', '{combat}'),                -- Спайк: custom combat vs Epic Fight
  ('7db410bf-40cf-48d7-9ad8-28731e560fbf', '{combat}'),                -- README/ТЗ mine_boevka ↔ D-38/D-39
  ('81b84bef-c151-428d-8329-329c0b3a2892', '{mobs,combat}'),           -- Контракт D-39 не проверен в игре
  ('ae516699-29d6-4db5-8bb3-8bc6b2ca63b4', '{mobs}'),                  -- Множители band: boss
  ('3a1d87a0-fbdf-4b22-954c-74bdbb0bccb4', '{crafting}'),              -- Глубина production chains
  ('68ebccd5-6a74-4a9d-b540-bc3fb8918898', '{structures}')             -- Fixed vs procedural world (D-28)
) as v(id, dirs)
where d.id = v.id and d.directions = '{}';

update public.proposals p set directions = v.dirs
from (values
  ('afa087f9-6ba0-4dcc-b206-957ee3635701'::uuid, '{combat}'::text[]),  -- Спайк: custom combat vs Epic Fight
  ('92230642-5f24-4e0d-8378-5f76a968437f', '{weapons_armor}')          -- Легендарный меч Frostbourne
) as v(id, dirs)
where p.id = v.id and p.directions = '{}';

update public.documents doc set directions = '{lore,structures}'
where doc.id = 'f430b692-983a-4fb8-be08-b6fcc95af581' and doc.directions = '{}';  -- World Design Brief v0.1
