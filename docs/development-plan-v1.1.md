# RUBEZH

DEVELOPMENT PLAN v1.1

Подготовлено: Development Lead · 13.09.2026 · Статус: READY WITH BLOCKERS

Источники: RUBEZH Development Handoff Brief v1.0 (12.09.2026) + MVP Epic Map v2.0 (12.09.2026) + Game Design Review: Epic Decomposition v2.0 (12.09.2026) — оба получены 13.09.2026

Настоящий документ — v1.1 Development Plan, пересобранный после получения MVP Epic Map v2.0 и Game Design Review: Epic Decomposition v2.0 (оба отсутствовали в пакете на момент v1.0). Он не пересматривает продуктовые, дизайнерские или архитектурные решения — он организует их выполнение: что делать, в каком порядке, кто это делает, что от чего зависит и когда результат готов к интеграции и QA.

ЧТО ИЗМЕНИЛОСЬ ОТНОСИТЕЛЬНО v1.0: Блокер «MVP Epic Map v2.0 / Game Design Review v2.0 отсутствуют» — закрыт (раздел 15, строка RESOLVED). Разделы 3, 5 (Parent Epic/Scope у CF-*, C1-1, C7-1, SPK-1), 7–9, 11, 15, 19, 21 обновлены. Обнаружено 2 новых CONFLICT DETECTED и 3 ESCALATION — см. врезку сразу после Executive Summary и раздел 15. Одна ранее ORPHAN-задача (EPIC-003) получила полное описание. Одна ранее неверная зависимость исправлена: EPIC-004 (Custom Mobs) блокирован готовностью CF-2/CF-3, а не решением по защитному инструменту, как считалось в v1.0.

# 1. Executive Summary

### Текущее состояние

Проект находится в состоянии pre-implementation: ни один из предоставленных материалов не описывает существующую кодовую базу или уже реализованные компоненты (см. раздел 3 «Current Project State» — статус UNKNOWN). v1.0 плана строился только на RUBEZH Development Handoff Brief v1.0 (статус «APPROVED FOR PARTIAL HANDOFF»), который сам указывал на отсутствие MVP Epic Map v2.0 и Game Design Review: Epic Decomposition v2.0. Оба документа получены 13.09.2026 и включены в этот план (v1.1).

Получение обоих документов закрывает основной блокер v1.0 (независимая проверка графа зависимостей Epic'ов теперь возможна) и исправляет одну содержательную ошибку декомпозиции v1.0: EPIC-004 (Custom Mobs) оказался заблокирован готовностью базовых механик стамины/пойза в EPIC-002 (то есть CF-2/CF-3), а не решением по защитному инструменту, как трактовал v1.0. Одновременно интеграция Epic Map v2.0 и независимого Game Design Review вскрыла 2 новых CONFLICT DETECTED и 3 ESCALATION, которые не были и не могли быть видны на материале одного Handoff Brief — см. врезку ниже и раздел 15.

### Цель ближайшего этапа

Не изменилась по составу относительно v1.0 (Epic Map v2.0 подтверждает, что именно этот объём не заблокирован): Foundation-слой, Combat Foundation (без DefensiveToolSystem), границу WeaponArchetype/WeaponInstance (EPIC-002/EPIC-005), content-треки EPIC-001/EPIC-007, Spike 2 и Spike 3 (Tier A), техническую оценку FTB Teams для EPIC-009 — и подготовить (без формального запуска) Spike 1 (EPIC-003). Дополнительно теперь можно раньше начинать EPIC-004 (Custom Mobs) — см. выше.

### Главные технические задачи

Поднять Foundation (mod skeleton NeoForge 1.21.1 + player data layer + data-driven config pipeline) как основу для всего остального — Critical Path.

Параллельно реализовать 4 компонента Combat Foundation (CombatStateMachine, StaminaSystem, PoiseSystem, WeaponArchetypeRegistry) и зафиксировать интерфейс WeaponArchetype/WeaponInstance.

Начать content-треки EPIC-001 (Region) и EPIC-007 (Lore Proto-Layer) — Epic-level scope теперь известен по Epic Map v2.0; Feature-level всё ещё ждёт декомпозиции Product Manager'а.

Провести Spike 2 (survival-архитектура для EPIC-006, non-blocking) и Spike 3 (Tier A failure-state); подготовить, но не запускать формально Spike 1 (EPIC-003 Combat Network Sync) до фиксации порога success/failure.

Провести дешёвую техническую оценку FTB Teams для EPIC-009 — независимо от исхода PRODUCT ESCALATION о самом существовании этого Epic'а.

### Главные риски

DESIGN ESCALATION (Blocking по Game Design Review): ни один Epic не определяет, что теряет игрок при смерти/провале — без этого EPIC-002/EPIC-006 не проверяемы как risk/reward системы.

2 CONFLICT DETECTED, требующие решения Product Manager/Product Lead (Trophy→Gear владение; статус EPIC-012 в MVP vs Later) — см. раздел 15.

10 зафиксированных блокеров (было 7 в v1.0; 1 закрыт получением документов, добавлено 4 новых) — несколько требуют решения Founder/Game Design без указанного срока.

EPIC-006: риск scope creep по глубине production chains, теперь как одна из 4 названных осей риска (билды/мобы/лор/production chains), подтверждено независимо Game Design Review.

Team capacity по-прежнему не указана — `CAPACITY UNKNOWN` (раздел 17); пользователь подтвердил, что принесёт её позже, датировка спринтов остаётся отложенной.

## CONFLICT DETECTED / ESCALATIONS из интеграции Epic Map v2.0

Полные карточки — в разделе 15 (Development Blockers), таблицы блокеров BLOCKED/CONFLICT/ESCALATION. Сводка:

CONFLICT-1 — Trophy→Gear Upgrade: Epic Map v2.0 текстуально относит его к EPIC-006, но уже принятая техническая архитектура (Handoff Brief §5 п.4) и Game Design Review v2.0 §2.2 независимо сходятся на EPIC-005. Решение — за Product Manager.

CONFLICT-2 — EPIC-012: числится в MVP (P2), но обоснован post-MVP server-track контекстом, явно вынесенным в Later (самим Epic Map v2.0 §8, подтверждено Game Design Review §2.6). Решение — за Product Lead.

DESIGN ESCALATION — failure-state (что теряет игрок при смерти/провале) не имеет Epic-владельца ни в одном Scope/Success Criteria (Game Design Review §2.3, Blocking). Механизм (Tier A) уже строится по принятому техническому решению; продуктовое содержание — нет.

PRODUCT ESCALATION — EPIC-009 не описывает ни одного player decision на масштабе MVP (Game Design Review §2.4); риск, что Epic не заслуживает отдельного статуса.

TECHNICAL ESCALATION — точный триггер старта EPIC-004/EPIC-005 неоднозначен между двумя разделами самой Epic Map (§7 Blocked Work vs §7 Parallel Work); требует подтверждения Tech Lead.

# 2. Development Principles

Архитектура не пересматривается Development Lead'ом. Все решения раздела 5 Brief («Ключевые технические решения, уже принятые») закрыты и не переоткрываются в рамках этого плана.

Явные блокеры (раздел 3 Brief) не обходятся явочным порядком. Пока блокер не закрыт ответственной стороной, связанная задача остаётся BLOCKED, а не переинтерпретируется.

Отсутствующий источник — не повод придумывать содержимое. Где решение зависит от MVP Epic Map v2.0 или Game Design Review v2.0 (оба отсутствуют), задача помечается NEEDS INVESTIGATION, а не декомпозируется на основе предположений.

Foundation первым. Ни один workstream, зависящий от mod skeleton / player data layer / config pipeline, не начинается до готовности соответствующего Foundation-компонента.

Ранняя интеграция вместо параллельной изоляции. Для команды такого масштаба не допускается длительная независимая работа без промежуточных integration points (раздел 11).

Никакого busy work: каждая задача в разделах 5 и 18 обоснована прямой ссылкой на конкретный пункт Brief.

Capacity и сроки не выдумываются. Где ёмкость команды неизвестна — используется CAPACITY UNKNOWN; оценка сложности — только Small/Medium/Large/Very Large с уровнем уверенности (High/Medium/Low).

Любое отклонение от Technical Architecture в процессе разработки оформляется как TECHNICAL DEVIATION и передаётся Tech Lead — не принимается молча на уровне кода.

# 3. Current Project State

| Аспект | Состояние |
| --- | --- |
| Кодовая база | Не описана ни в одном предоставленном материале — UNKNOWN. Для целей плана принято допущение «greenfield start»; если существующий код есть, необходимо сообщить Development Lead до старта Foundation-задач во избежание дублирования. |
| Уже реализованные компоненты | UNKNOWN — нет данных. |
| Что зафиксировано как решённое и разрешено к работе | См. раздел 2 и раздел 5 Brief → раздел 5 этого плана «Development Task Map». |
| Что явно не готово к работе | 10 блокеров (было 7 в v1.0 — 1 закрыт получением Epic Map v2.0/GD Review, 4 новых добавлено) → раздел 15 «Development Blockers». |
| MVP Epic Map v2.0 | ПОЛУЧЕН 13.09.2026 и включён в этот план (v1.1). Структурная выжимка — раздел 19 (MVP Traceability); полные Epic-level данные использованы по всему плану. |
| Game Design Review: Epic Decomposition v2.0 | ПОЛУЧЕН 13.09.2026. Вскрыл 2 CONFLICT DETECTED и 3 ESCALATION — см. врезку в разделе 1 (Executive Summary) и раздел 15. |
| Актуальные источники истины (обновлено) | RUBEZH Product Definition v4 (12.09.2026, APPROVED); RUBEZH Technical Architecture & Implementation Plan v1.1 (12.09.2026, APPROVED); MVP Epic Map v2.0 (12.09.2026, заменяет v1.0 Epic Map); Game Design Review: Epic Decomposition v2.0 (12.09.2026). Более ранние версии (Product Definition v2, Technical v1.0/v2.0, Technical Feasibility & Dependency Assessment v1.0, MVP Epic Map v1.0) — черновые/суперседед, не являются источником истины. |
| Feature-level декомпозиция | Ещё не проведена. Epic Map v2.0 §13 явно называет её следующим шагом ПОСЛЕ согласования Epic Map (Product Manager, не Development Lead). Задачи в разделе 5 покрывают Epic-level старт там, где он уже возможен. |

# 4. Development Workstreams

Численность и состав команды не указаны в материалах (CAPACITY UNKNOWN). Согласно принципу планирования для малой команды, работа сгруппирована в 3 workstream + роль Development Lead поверх всех; для команды из 3 человек предполагается временная специализация — один и тот же человек может закрывать несколько ролей (§14 инструкции Development Lead).

## WORKSTREAM A — Foundation & Combat Systems

Owner role: Systems Developer, при участии Minecraft Mod Developer для интеграции с NeoForge.

Задачи: F-1, F-2, F-3, CF-1, CF-2, CF-3, CF-4, CF-5.

Зависимости: ничего не блокирует старт (раздел 2 Brief).

Integration points: M1, M2, M3.

Блокеры: DefensiveToolSystem (BL-1) явно исключён из объёма workstream до отдельного решения Founder/Game Design.

## WORKSTREAM B — Content Tracks

Owner role: Content / Integration Developer.

Задачи: C1-1 (EPIC-001 Region), C7-1 (EPIC-007 Lore Proto-Layer).

Зависимости: технически ничего не блокирует старт (раздел 2 Brief), но глубина декомпозиции ограничена отсутствием MVP Epic Map v2.0 / Game Design Review v2.0.

Integration points: M4.

Блокеры: нет технических; есть блокер по глубине декомпозиции — см. NEEDS INVESTIGATION в разделе 5.

## WORKSTREAM C — Technical Spikes & Investigation

Owner role: любой Systems / Minecraft Mod Developer, назначаемый по ситуации (временная специализация, §14 инструкции).

Задачи: SPK-1 (только подготовка), SPK-2, SPK-3, EV-1.

Зависимости: запуск SPK-1 блокирован (порог success/failure не зафиксирован).

Integration points: результаты спайков определяют объём EPIC-005/EPIC-006 и будущей Tier B задачи.

Development Lead поверх всех workstream'ов: координация, code review, architecture compliance, агрегация блокеров, коммуникация эскалаций к Tech Lead / Founder / Game Design.

# 5. Development Task Map

Ниже — полные Development Task card для всего объёма, разрешённого к старту прямо сейчас (раздел 2 Brief), плюс отдельные Spike-карточки. Задачи, которые Brief называет, но не описывает достаточно для формулировки Implementation Scope / Acceptance Criteria без домысливания, вынесены в раздел 18 «Development Backlog» как строки без полной карточки — во избежание фиктивной декомпозиции (§32 инструкции: «никакого busy work»).

## 5.1 Foundation

| F-1 — Mod Skeleton (NeoForge 1.21.1) | F-1 — Mod Skeleton (NeoForge 1.21.1) |
| --- | --- |
| Parent Epic | Foundation (базовый слой, вне нумерации Epic) |
| Parent Feature | Project Foundation |
| Technical System | Platform / Mod Bootstrap |
| Component | NeoForge mod entry point, базовые registries, сборка проекта |
| Purpose | Обеспечить компилируемый базовый каркас мода на NeoForge 1.21.1, на котором строятся все остальные системы. |
| Implementation Scope | Инициализация mod-проекта под NeoForge 1.21.1; базовая структура регистраций и точка входа мода; smoke-test совместимости стека зависимостей (явно требуется §6.1 Brief). Конкретный состав build tooling/CI не описан в источниках — NEEDS INVESTIGATION. |
| Dependencies | Нет (первая задача Foundation-слоя) |
| Blocked By | — |
| Blocks | F-2, F-3, CF-1…CF-5, C1-1, C7-1, SPK-2, EV-1 — фактически весь остальной backlog |
| Parallel With | — |
| Recommended Developer Type | Minecraft Mod Developer |
| Complexity | Medium — Confidence: Medium (детали build/CI не описаны в пакете) |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Проект собирается под NeoForge 1.21.1; мод загружается в dev-окружении без ошибок; smoke-test совместимости стека пройден. |
| Technical Notes | §6.1 Brief явно требует включить smoke-test совместимости стека в этот этап, до старта Combat Foundation. |
| QA Requirements | Build проходит локально (и в CI, если настроен); ручная проверка запуска клиента/сервера. |
| Integration Requirements | Integration Point M1 — Core Build Compiles. |
| Definition of Done | Код реализован; build проходит; smoke-test совместимости стека пройден; нет известных critical ошибок запуска; готово к старту зависимых задач. |
| Status | READY |

| F-2 — Player Data Layer | F-2 — Player Data Layer |
| --- | --- |
| Parent Epic | Foundation |
| Parent Feature | Project Foundation |
| Technical System | Player State / Persistence |
| Component | Слой хранения и доступа к player-специфичным данным |
| Purpose | Обеспечить единый слой хранения игровых данных игрока, на который опираются Combat Foundation, Progression и будущие системы. |
| Implementation Scope | Persist/load player-специфичных данных, интеграция с жизненным циклом игрока NeoForge. Конкретная схема данных (состав полей, формат) не процитирована в Brief — NEEDS INVESTIGATION по Technical Architecture Plan v1.1 (полный текст вне пакета). |
| Dependencies | F-1 |
| Blocked By | F-1 |
| Blocks | CF-1, CF-2, CF-3, SPK-3 — все системы, читающие/пишущие player state |
| Parallel With | F-3 |
| Recommended Developer Type | Systems Developer |
| Complexity | Medium — Confidence: Low (схема данных не детализирована в доступных материалах) |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Данные игрока сохраняются и загружаются корректно между сессиями; слой доступен другим системам через определённый интерфейс. |
| Technical Notes | Полная спецификация схемы данных должна быть сверена с Technical Architecture Plan v1.1 — в Brief она не процитирована подробно. |
| QA Requirements | Тест сохранения/загрузки (relog, restart сервера); проверка отсутствия потери данных. |
| Integration Requirements | Integration Point M2 — Player State Works. |
| Definition of Done | Реализовано; build проходит; данные переживают relog/restart сервера; acceptance criteria выполнены; готово к QA. |
| Status | READY |

| F-3 — Data-Driven Config Pipeline | F-3 — Data-Driven Config Pipeline |
| --- | --- |
| Parent Epic | Foundation |
| Parent Feature | Project Foundation |
| Technical System | Content Configuration |
| Component | Загрузчик data-driven конфигурации контента |
| Purpose | Дать возможность описывать игровой контент (оружие, регионы, лут и т.п.) данными, а не хардкодом, для content-треков и Combat Foundation. |
| Implementation Scope | Пайплайн загрузки конфигурации данных для контента. Конкретный формат (JSON и т.п.), схема, наличие hot-reload не зафиксированы в Brief — NEEDS INVESTIGATION по Technical Architecture Plan v1.1. |
| Dependencies | F-1 |
| Blocked By | F-1 |
| Blocks | C1-1, C7-1, CF-4 (частично) |
| Parallel With | F-2 |
| Recommended Developer Type | Minecraft Mod Developer / Content-Integration Developer (совместно) |
| Complexity | Medium — Confidence: Low |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Контент можно описать данными без изменения кода; пайплайн загружает и валидирует минимум один тестовый датасет. |
| Technical Notes | Точный формат и схема конфигов должны быть уточнены по Technical Architecture Plan v1.1, недоступному в этом пакете. |
| QA Requirements | Тест загрузки валидного и невалидного конфига (ожидаемая явная ошибка на невалидном). |
| Integration Requirements | Integration Point M1. |
| Definition of Done | Реализовано; build проходит; тестовый датасет загружается; готово к использованию content-треками и CF-4. |
| Status | READY |

## 5.2 Combat Foundation

| CF-1 — CombatStateMachine | CF-1 — CombatStateMachine |
| --- | --- |
| Parent Epic | EPIC-002 — Core Combat System, No-Roll Timing-Based (частично — без DefensiveToolSystem) |
| Parent Feature | Combat Foundation |
| Technical System | Combat |
| Component | Combat state machine |
| Purpose | Управлять состояниями боя независимо от выбора защитного инструмента (§6.1 Brief). |
| Implementation Scope | Базовые боевые состояния и переходы между ними на уровне ядра системы; исключает логику DefensiveToolSystem (блок/парирование/позиционирование) — явно вынесено за рамки (разделы 2 и 3 Brief). Полный список состояний/переходов не процитирован в Brief — NEEDS INVESTIGATION по Technical Architecture Plan v1.1. |
| Dependencies | F-2 |
| Blocked By | F-2 |
| Blocks | CF-2, CF-3, CF-5, SPK-1 (для эксперимента), BL-1 (когда снимется блокер по защитному инструменту) |
| Parallel With | — |
| Recommended Developer Type | Systems Developer |
| Complexity | Large — Confidence: Low (полная спецификация состояний не в пакете) |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Базовые боевые состояния, не зависящие от защитного инструмента, реализованы и тестируемы изолированно; система явно не содержит логики DefensiveToolSystem. |
| Technical Notes | Принятое решение (раздел 5 Brief, п.2): строить Combat Foundation до решения по защитному инструменту. Не расширять состояния под предположения о будущем инструменте — это TECHNICAL DEVIATION, если произойдёт. |
| QA Requirements | Unit-тесты переходов состояний; сценарии перехода без участия defensive tool. |
| Integration Requirements | Integration Point M3 — First Combat Prototype. |
| Definition of Done | Реализовано; соответствует принятому решению об исключении DefensiveToolSystem; build проходит; unit-тесты переходов проходят; готово к QA по не-defensive сценариям. |
| Status | READY |

| CF-2 — StaminaSystem | CF-2 — StaminaSystem |
| --- | --- |
| Parent Epic | EPIC-002 — Core Combat System |
| Parent Feature | Combat Foundation |
| Technical System | Combat |
| Component | Ресурсная система выносливости |
| Purpose | Управлять ресурсом выносливости, используемым боевыми действиями. |
| Implementation Scope | Расход/восстановление stamina, привязка к player data layer и к CombatStateMachine. Конкретные формулы/скорости восстановления не зафиксированы в Brief — NEEDS INVESTIGATION. |
| Dependencies | F-2, CF-1 (интеграция с состояниями боя) |
| Blocked By | F-2 |
| Blocks | Полноценные боевые действия, зависящие от stamina (в т.ч. будущий DefensiveToolSystem). v1.1: вместе с CF-3 — прямой gate для старта EPIC-004 (Custom Mobs), см. Epic Map v2.0 §7 Blocked Work. |
| Parallel With | CF-3, CF-4 |
| Recommended Developer Type | Systems Developer |
| Complexity | Medium — Confidence: Medium |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Stamina расходуется и восстанавливается предсказуемо; интегрируется с CombatStateMachine. |
| Technical Notes | Конкретные балансные значения — предмет отдельной content/balancing задачи, не входят в эту задачу. |
| QA Requirements | Тест расхода/восстановления в разных состояниях боя. |
| Integration Requirements | Integration Point M3. |
| Definition of Done | Реализовано; build проходит; интеграция с CF-1 подтверждена; готово к QA. |
| Status | READY |

| CF-3 — PoiseSystem | CF-3 — PoiseSystem |
| --- | --- |
| Parent Epic | EPIC-002 — Core Combat System |
| Parent Feature | Combat Foundation |
| Technical System | Combat |
| Component | Poise / stagger система |
| Purpose | Управлять устойчивостью к прерыванию действий при получении урона. |
| Implementation Scope | Расчёт poise, порог stagger, привязка к player data layer и CombatStateMachine. Конкретные пороги/формулы не зафиксированы в Brief — NEEDS INVESTIGATION. |
| Dependencies | F-2, CF-1 |
| Blocked By | F-2 |
| Blocks | Полноценные боевые действия, зависящие от stagger-механики. v1.1: вместе с CF-2 — прямой gate для старта EPIC-004 (Custom Mobs), см. Epic Map v2.0 §7 Blocked Work. |
| Parallel With | CF-2, CF-4 |
| Recommended Developer Type | Systems Developer |
| Complexity | Medium — Confidence: Medium |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Poise накапливается/сбрасывается по урону; стаггер триггерится корректно; интеграция с CombatStateMachine подтверждена. |
| Technical Notes | — |
| QA Requirements | Тест стаггера при разных источниках урона. |
| Integration Requirements | Integration Point M3. |
| Definition of Done | Реализовано; build проходит; интеграция подтверждена; готово к QA. |
| Status | READY |

| CF-4 — WeaponArchetypeRegistry | CF-4 — WeaponArchetypeRegistry |
| --- | --- |
| Parent Epic | EPIC-002 — Core Combat System (владеет weapon archetypes; граничит с EPIC-005, который владеет weapon progression — граница подтверждена Game Design Review v2.0 §2.1) |
| Parent Feature | Combat Foundation |
| Technical System | Combat / Weapons |
| Component | Реестр архетипов оружия |
| Purpose | Обеспечить реестр архетипов оружия, независимый от конкретных экземпляров оружия (WeaponInstance, EPIC-005). |
| Implementation Scope | Регистрация и хранение архетипов оружия (тип, базовые характеристики уровня архетипа) через Data-Driven Config Pipeline (F-3). |
| Dependencies | F-1, F-3 |
| Blocked By | F-1, F-3 |
| Blocks | CF-5, BL-3 (EPIC-005 полная реализация) |
| Parallel With | CF-2, CF-3 |
| Recommended Developer Type | Systems Developer / Minecraft Mod Developer (регистрация через NeoForge registries) |
| Complexity | Medium — Confidence: Medium |
| Priority | P0 — Critical Path |
| Acceptance Criteria | Минимум один тестовый архетип регистрируется и читается из data-driven конфига. |
| Technical Notes | Граница с EPIC-005 (WeaponInstance) фиксируется отдельно в CF-5. |
| QA Requirements | Тест регистрации/чтения архетипа. |
| Integration Requirements | Integration Point M3. |
| Definition of Done | Реализовано; build проходит; тестовый архетип регистрируется корректно; готово к QA. |
| Status | READY |

| CF-5 — WeaponArchetype / WeaponInstance Interface | CF-5 — WeaponArchetype / WeaponInstance Interface |
| --- | --- |
| Parent Epic | Граница EPIC-002 (weapon archetypes) / EPIC-005 (weapon progression) |
| Parent Feature | Combat Foundation |
| Technical System | Combat / Weapons |
| Component | Archetype–Instance контракт |
| Purpose | Зафиксировать программный контракт между архетипом оружия (EPIC-002) и экземпляром оружия внутри билда (EPIC-005), чтобы обе стороны разрабатывались независимо. |
| Implementation Scope | Интерфейс/контракт WeaponArchetype ↔ WeaponInstance — принят как рабочее решение, кодируется сразу, не дожидаясь формального утверждения PM (раздел 2 Brief, §22 техплана). Полная реализация WeaponInstance/Build Progression (EPIC-005) — вне объёма этой задачи. v1.1: Game Design Review v2.0 §2.1 независимо приходит к той же границе (EPIC-002 = фиксированные боевые глаголы архетипа, EPIC-005 = экземпляр/ветка внутри билда), но отмечает, что сама Epic Map нигде не формулирует эту границу текстом (раздел 5 карты её не рассматривает) — это разрыв в продуктовой документации, не в самом техническом решении; технической работе (CF-5) он не мешает, но Product Manager должен внести её явно в Epic Map / Feature Map. |
| Dependencies | CF-4 |
| Blocked By | CF-4 |
| Blocks | BL-3 (EPIC-005 полная реализация) |
| Parallel With | — |
| Recommended Developer Type | Systems Developer |
| Complexity | Small/Medium — Confidence: Medium |
| Priority | P0 — Critical Path (разблокирует параллельную работу по EPIC-005 позже) |
| Acceptance Criteria | Интерфейс определён и компилируется; покрыт минимальным тестовым использованием (архетип + заглушка instance). |
| Technical Notes | Явно помечено как «принято как рабочее решение» — не ждать формального sign-off PM для старта (раздел 2 Brief). |
| QA Requirements | Тест соответствия заглушки instance интерфейсу. |
| Integration Requirements | Integration Point M3. |
| Definition of Done | Реализовано; build проходит; заглушка instance проходит по интерфейсу; готово к QA. |
| Status | READY |

## 5.3 Content Tracks

| C1-1 — EPIC-001 — Curated Region & Exploration (S0–S1) | C1-1 — EPIC-001 — Curated Region & Exploration (S0–S1) |
| --- | --- |
| Parent Epic | EPIC-001 (Curated Region & Exploration, S0–S1) |
| Parent Feature | Feature-декомпозиция ещё не проведена (Epic Map v2.0 §13: это следующий шаг после согласования Epic Map) — эта задача покрывает Epic-level старт, не Feature-детализацию |
| Technical System | Content / World |
| Component | Регион S0(+частично S1): курируемое размещение среды/структур, точки размещения находок и environmental storytelling (сама методика подачи — в C7-1/EPIC-007) |
| Purpose | Один играбельный регион с курируемой визуальной идентичностью и скрытым лором — тестирует пилар «авторский мир» (Epic Map v2.0, EPIC-001). |
| Implementation Scope | v1.1: теперь известно из Epic Map v2.0 — регион S0 (+ частично S1); курируемое размещение среды/структур; точки размещения находок. Out of Scope (по Epic Map): S2+, полный production-artbook, несколько регионов. Feature-уровень (конкретные структуры/POI) ещё не декомпозирован — это следующий шаг Product Manager'а, не Development Lead. |
| Dependencies | F-1, F-3 (config pipeline для контента). Epic Map v2.0: нет прямой epic-level зависимости. |
| Blocked By | F-1, F-3 |
| Blocks | C7-1 (лор физически размещается в этом регионе) |
| Parallel With | C7-1 (координационный риск, не блокер — см. Technical Notes), вся ветка Foundation/Combat Foundation |
| Recommended Developer Type | Content / Integration Developer |
| Complexity | Large — Confidence: Medium (Epic-level scope теперь известен; Feature-level ещё нет) |
| Priority | P0 (per Epic Map v2.0 — выше, чем оценивал v1.0 плана на основании одного Handoff Brief) |
| Acceptance Criteria | Игрок проходит S0–S1 без фарма ради уровня; качественная обратная связь подтверждает «это не generic-модпак» (Epic Map v2.0, Success Criteria). |
| Technical Notes | Game Design Review v2.0 §2 (общее, не 2.x-нумерованное): координационный риск с EPIC-007 — точки размещения находок (здесь) и методика подачи истории (C7-1) должны проектироваться ОДНОЙ итерацией, иначе левелдизайнер расставит точки интереса раньше, чем нарративный дизайнер решит, что там лежит. Это не design-разрыв, а риск координации between C1-1 и C7-1 — держать их в одном рабочем цикле, не изолированно. |
| QA Requirements | Плейтест на «не generic-модпак» фидбек; проверка отсутствия фарма ради уровня как основного пути прохождения. |
| Integration Requirements | Integration Point M4 — Content Integrated. |
| Definition of Done | Реализовано в объёме, согласованном на Epic-level; build проходит; координация с C7-1 подтверждена; готово к QA по доступным Feature. Полный DoD по каждой Feature — после Feature-декомпозиции (не в этом плане). |
| Status | READY |

| C7-1 — EPIC-007 — Lore Delivery Proto-Layer | C7-1 — EPIC-007 — Lore Delivery Proto-Layer |
| --- | --- |
| Parent Epic | EPIC-007 (Lore Delivery Proto-Layer) |
| Parent Feature | Feature-декомпозиция ещё не проведена (см. C1-1) — эта задача покрывает Epic-level старт |
| Technical System | Content / Narrative |
| Component | Item-описания; environmental storytelling элементы, размещённые в регионе S0–S1; нарративный дизайн методики подачи |
| Purpose | Прото-слой лора — проверка методики подачи истории, не полный свод мира; тестирует H7, закрывает Hidden Scope, отмеченный в MVP Epic Map v1.0 (Epic Map v2.0, EPIC-007). |
| Implementation Scope | v1.1: теперь известно из Epic Map v2.0 — item-описания и environmental storytelling для региона S0–S1; сама методика подачи (не просто «текст для галочки»). Out of Scope: полный свод лора мира, production-artbook, диалоговая/квестовая система. |
| Dependencies | F-1, F-3, EPIC-001 (лор физически размещается в регионе — epic-level зависимость по Epic Map v2.0) |
| Blocked By | F-1, F-3, C1-1 (координационно, не блокирующе — см. Technical Notes) |
| Blocks | — |
| Parallel With | C1-1 (с оговоркой на координационный риск), вся ветка Foundation/Combat Foundation |
| Recommended Developer Type | Content / Integration Developer |
| Complexity | Medium — Confidence: Medium (Epic-level scope известен; Feature-level ещё нет) |
| Priority | P0 (per Epic Map v2.0) |
| Acceptance Criteria | Качественная обратная связь плейтестеров показывает любопытство, попытки самостоятельно связывать находки в историю (Epic Map v2.0, Success Criteria). |
| Technical Notes | Game Design Review v2.0: даже прото-слой требует выделенного нарративного дизайна — риск как недо-, так и переинвестирования относительно заявленного «прото» масштаба. Та же координация с C1-1, что описана там: точки размещения находок и методика подачи — одна итерация, не раздельно. |
| QA Requirements | Плейтест на любопытство/попытки связать находки в историю (качественный, не численный критерий). |
| Integration Requirements | Integration Point M4. |
| Definition of Done | Реализовано в объёме, согласованном на Epic-level; build проходит; координация с C1-1 подтверждена; готово к QA. Полный DoD по каждой Feature — после Feature-декомпозиции. |
| Status | READY |

## 5.4 Technical Evaluation

| EV-1 — EPIC-009 — техническая оценка FTB Teams | EV-1 — EPIC-009 — техническая оценка FTB Teams |
| --- | --- |
| Parent Epic | EPIC-009 |
| Parent Feature | Access / Permissions Foundation |
| Technical System | Permissions / Teams |
| Component | FTB Teams интеграция (оценочная) |
| Purpose | Оценить FTB Teams как основу EPIC-009 вместо кастомной permission-системы — принятое решение, обратимое при неудаче оценки (раздел 5 Brief, п.5). |
| Implementation Scope | Интеграционная оценка FTB Teams на минимальном тестовом сценарии. Согласно Brief техническая часть «дёшева и не блокирована» — это не полная декомпозиция EPIC-009 (та блокирована отдельно, см. BL-6). |
| Dependencies | F-1 |
| Blocked By | F-1 |
| Blocks | Косвенно влияет на объём BL-6, но не снимает его блокер (Founder «зачем») |
| Parallel With | SPK-2, C1-1, C7-1 |
| Recommended Developer Type | Minecraft Mod Developer |
| Complexity | Small/Medium — Confidence: Medium |
| Priority | P2 |
| Acceptance Criteria | FTB Teams интегрируется в тестовом сценарии; получен вывод «подходит / не подходит» с обоснованием. |
| Technical Notes | Если оценка отрицательна — решение об FTB Teams как основе EPIC-009 откатывается (явно указано как обратимое, раздел 5 Brief). v1.1: Game Design Review v2.0 §2.4 ставит под вопрос само существование EPIC-009 как отдельного Epic (Scope не описывает ни одного реального player decision на масштабе 2–4 без персистентной экономики) — рекомендует слить с EPIC-010 или перенести в Later при отсутствии ответа Founder. Эта оценка (EV-1) остаётся дешёвой и стоящей своих затрат независимо от исхода, но не должна перерастать в более крупную инвестицию до ответа Founder (см. ESCALATION в блокерах). |
| QA Requirements | Тест базового сценария teams/permissions. |
| Integration Requirements | Не Critical Path. |
| Definition of Done | Оценка завершена; вывод задокументирован; Development Plan обновлён по результату. |
| Status | READY |

## 5.5 Technical Spikes

| SPK-1 — Spike 1 — Combat Network Sync (H6) — go/no-go gate for EPIC-003 | SPK-1 — Spike 1 — Combat Network Sync (H6) — go/no-go gate for EPIC-003 |
| --- | --- |
| Parent Epic | EPIC-003 — Combat Network Synchronization (Coop-Scale) |
| Question | Работает ли выбранный подход к синхронизации боевого состояния по сети в приемлемых пределах задержки/рассинхронизации на масштабе стандартного мультиплеера/кооп (2–4 игрока)? |
| Why | Go/no-go гипотеза H6 (Epic Map v2.0, EPIC-003) — сниженная планка относительно v3 (не постоянный MMO-сервер, кооп-масштаб), но риск ещё не пройден. |
| Scope | Минимальный эксперимент синхронизации между клиентом и сервером на базовом наборе состояний CombatStateMachine (CF-1), на масштабе 2–4 участников. v1.1: теперь известно из Epic Map v2.0, что это Success Criteria именно EPIC-003, а не встроенный риск EPIC-002. |
| Success Criteria | Epic Map v2.0 даёт только качественный критерий: «играбельно при реалистичном пинге в масштабе кооп без критичных рассинхронизаций» — числовой порог, что считается «критичным», по-прежнему НЕ зафиксирован ни в одном документе (это НЕ закрыто получением Epic Map v2.0 — блокирует именно запуск спайка с формальной оценкой результата, не подготовку). |
| Output | Technical Decision по подходу к сетевой синхронизации боя. |
| Timebox | UNKNOWN (не указан в Brief) |
| Dependencies | CF-1 |
| Blocked By | БЛОКЕР: порог success/failure не зафиксирован — закрывают Tech Lead + инженер, проводящий спайк, до старта (раздел 3 Brief) |
| Recommended Developer Type | Systems Developer / Minecraft Mod Developer (сеть) |
| Complexity | Large — Confidence: Low |
| Priority | Подготовка — P0 (разрешена, раздел 2 Brief); формальный запуск — BLOCKED |
| Technical Notes | Разделение буквальное: раздел 2 Brief разрешает готовить и технически запускать; раздел 3 блокирует именно объективную оценку результата без порога. Не путать «запуск ради данных» с «запуск как формально оцениваемый спайк». |
| Status | SPIKE — подготовка READY, формальный запуск BLOCKED |

| SPK-2 — Spike 2 — Survival System Architecture (custom vs Create/Mekanism/AE2) | SPK-2 — Spike 2 — Survival System Architecture (custom vs Create/Mekanism/AE2) |
| --- | --- |
| Parent Epic | EPIC-006 — Survival & Crafting Loop (Technical Flag) |
| Question | Строить survival/production-систему кастомно или на основе существующих модов (Create/Mekanism/AE2)? |
| Why | Определяет архитектурный фундамент EPIC-006 и совместимость с боевым модом (Epic Map v2.0, EPIC-006 Technical Flag). |
| Scope | Оценка совместимости Create/Mekanism/AE2 с боевым модом на минимальном интеграционном сценарии (раздел 5 Brief, п.6). |
| Success Criteria | Не процитирован явно ни в Brief, ни в Epic Map v2.0 — NEEDS INVESTIGATION (уточнить у Tech Lead). |
| Output | Архитектурное решение для EPIC-006. v1.1: Epic Map v2.0 §12 explicitly называет этот вопрос non-blocking для старта дизайна EPIC-006 — EPIC-006 не входит в Blocked Work (§7), может стартовать параллельно с EPIC-004/005 уже сейчас. Это мягче, чем трактовал Development Plan v1.0 (там полная декомпозиция EPIC-006 считалась BLOCKED до этого спайка) — исправлено, см. BL-4. |
| Timebox | UNKNOWN |
| Dependencies | F-1 |
| Blocked By | F-1 |
| Recommended Developer Type | Minecraft Mod Developer (совместимость модов) |
| Complexity | Large — Confidence: Low |
| Priority | P1 |
| Technical Notes | Не блокирует старт EPIC-006 в целом (Epic Map v2.0 §12) — но должен завершиться до Feature-декомпозиции глубины production chains (см. Blocker по диапазону production chains). |
| Status | SPIKE — READY |

| SPK-3 — Spike 3 — Failure-State Transactional Mechanism (Tier A) | SPK-3 — Spike 3 — Failure-State Transactional Mechanism (Tier A) |
| --- | --- |
| Parent Epic | EPIC-002 / EPIC-006 (владелец Epic не назначен — см. DESIGN ESCALATION в блокерах) |
| Question | Как реализовать транзакционный механизм failure-state для Tier A (rollback / outright loss)? |
| Why | Failure-state — часть core loop (риск/потеря); Tier A явно не заблокирован и может строиться сейчас (раздел 2 Brief). |
| Scope | Строго Tier A (rollback / outright loss). Tier B (bloodstain-style: world-object, TTL, конкурентный доступ в коопе) явно исключён — отдельная, не оценённая задача, требующая design-решения (раздел 3 Brief, блокер №3). |
| Success Criteria | Не процитирован в Brief — NEEDS INVESTIGATION. |
| Output | Реализованный Tier A механизм + Technical Decision, явно документирующее границу с будущим Tier B. |
| Timebox | UNKNOWN |
| Dependencies | F-2 (player data layer); учитывает принятое решение — Trophy→Gear логика физически в Build/Progression data store, а не в Survival-системе (раздел 5 Brief, п.4) |
| Blocked By | F-2 |
| Recommended Developer Type | Systems Developer |
| Complexity | Medium/Large — Confidence: Low |
| Priority | P0 — Critical Path (часть core loop) |
| Technical Notes | Принятое решение (раздел 5 Brief, п.3): Tier A строится сейчас; Tier B — отдельная задача после design-решения и явно не переиспользует код Tier A. v1.1: Game Design Review v2.0 §2.3 (Blocking) фиксирует более фундаментальный пробел — ни один Epic в Epic Map v2.0 не описывает, ЧТО конкретно теряет игрок при смерти/провале, на уровне Scope/Success Criteria. Технически МЕХАНИЗМ (Tier A, транзакционный) уже принят и не меняется; но ПРОДУКТОВОЕ содержание (что теряется — трофеи? ресурсы? прогресс?) остаётся открытым и не может быть закрыто на уровне кода. Это не блокирует продолжение SPK-3 как инженерной задачи, но означает, что Acceptance Criteria этой задачи не могут быть окончательно закрыты до ответа Founder/Game Design — см. DESIGN ESCALATION в блокерах. |
| Status | READY — инженерная работа не блокирована; Acceptance Criteria по содержанию потери зависят от DESIGN ESCALATION (см. блокеры) |

# 6. Developer Assignment

Именной состав команды не предоставлен — назначение сделано по роли (§13 инструкции Development Lead), не по имени. Один и тот же человек может закрывать несколько ролей (§14).

| Роль | Задачи | Комментарий |
| --- | --- | --- |
| Minecraft Mod Developer | F-1, CF-4 (совместно), CF-5 (сеть/регистрация где применимо), SPK-1 (сеть), SPK-2, EV-1, C1-1/C7-1 (интеграция в мод, совместно) | NeoForge API, registries, networking, совместимость модов. |
| Systems Developer | F-2, CF-1, CF-2, CF-3, CF-4 (совместно), CF-5, SPK-1 (боевая логика), SPK-3 | Combat, ресурсные системы, game logic, player state. |
| Content / Integration Developer | F-3 (совместно), C1-1, C7-1 | Data-driven конфигурация, содержательное наполнение content-треков. |
| Development Lead | Координация всех workstream, code review, architecture compliance, интеграция, блокеры, эскалации | Не единственный reviewer для критических изменений, если состав команды это позволяет (§22). |

# 7. Dependency Map

## 7.1 Development Task level

| Задача | Blocked By | Blocks |
| --- | --- | --- |
| F-1 | — | F-2, F-3, CF-1…CF-5, C1-1, C7-1, SPK-2, EV-1 — фактически весь остальной backlog |
| F-2 | F-1 | CF-1, CF-2, CF-3, SPK-3 — все системы, читающие/пишущие player state |
| F-3 | F-1 | C1-1, C7-1, CF-4 (частично) |
| CF-1 | F-2 | CF-2, CF-3, CF-5, SPK-1 (для эксперимента), BL-1 (когда снимется блокер по защитному инструменту) |
| CF-2 | F-2 | Полноценные боевые действия, зависящие от stamina (в т.ч. будущий DefensiveToolSystem). v1.1: вместе с CF-3 — прямой gate для старта EPIC-004 (Custom Mobs), см. Epic Map v2.0 §7 Blocked Work. |
| CF-3 | F-2 | Полноценные боевые действия, зависящие от stagger-механики. v1.1: вместе с CF-2 — прямой gate для старта EPIC-004 (Custom Mobs), см. Epic Map v2.0 §7 Blocked Work. |
| CF-4 | F-1, F-3 | CF-5, BL-3 (EPIC-005 полная реализация) |
| CF-5 | CF-4 | BL-3 (EPIC-005 полная реализация) |
| C1-1 | F-1, F-3 | C7-1 (лор физически размещается в этом регионе) |
| C7-1 | F-1, F-3, C1-1 (координационно, не блокирующе — см. Technical Notes) | — |
| EV-1 | F-1 | Косвенно влияет на объём BL-6, но не снимает его блокер (Founder «зачем») |
| SPK-1 | БЛОКЕР: порог success/failure не зафиксирован — закрывают Tech Lead + инженер, проводящий спайк, до старта (раздел 3 Brief) | См. Output соответствующего спайка |
| SPK-2 | F-1 | См. Output соответствующего спайка |
| SPK-3 | F-2 | См. Output соответствующего спайка |

## 7.2 Epic level (MVP Epic Map v2.0, §6 Карта зависимостей)

Новое в v1.1 — авторитетный Epic-level граф зависимостей из самой Epic Map, а не выведенный Development Lead'ом из Handoff Brief. Task-level зависимости в 7.1 должны быть согласованы с этим графом; расхождений не найдено, кроме отмеченных в TECHNICAL ESCALATION (раздел 15).

| Epic | Dependencies | Priority |
| --- | --- | --- |
| EPIC-001 — Curated Region & Exploration (S0–S1) | — | P0 |
| EPIC-002 — Core Combat System (No-Roll, Timing-Based) | EPIC-003 | P0 |
| EPIC-003 — Combat Network Synchronization (Coop-Scale) | EPIC-002 | P0 (блокирующий гейт) |
| EPIC-004 — Custom Mobs (S0–S1) | EPIC-002 | P0 |
| EPIC-005 — Build & Ability Progression (5–8 билдов) | EPIC-002 | P0 |
| EPIC-006 — Survival & Crafting Loop | EPIC-001, EPIC-002, EPIC-004 | P0 |
| EPIC-007 — Lore Delivery Proto-Layer | EPIC-001 | P0 |
| EPIC-008 — Boss Encounter (адаптированный, кульминация региона) | EPIC-001, EPIC-002, EPIC-005 | P1 |
| EPIC-009 — Team Formation & Access (малая группа) | EPIC-010 | P1 |
| EPIC-010 — Coop Multiplayer Foundation (2–4 игрока) | EPIC-002, EPIC-003 | P1 |
| EPIC-011 — Risk-Free PvP Arena | EPIC-002, EPIC-003, EPIC-010 | P2 (COULD HAVE, stretch) |
| EPIC-012 — Rotational Retention Task | EPIC-001, EPIC-006 | P2 |

Исключено из MVP: Явно исключены из MVP Epic Map v2.0 (не понижены в приоритете, а полностью выведены в Later) — прямое следствие пивота «сборка > сервер» (раздел 12 Product Definition v4). Player Economy (NPC-скупщик + P2P-сделки); Player Specializations; Multiplayer Backend & Data Integrity (анти-дюп/UUID/team-ID/журнал).

# 8. Critical Path

v1.1: теперь построено на двух уровнях — Epic-level Critical Path, взятый непосредственно из MVP Epic Map v2.0 §7 (авторитетный источник, не вывод Development Lead'а), и Task-level путь, которым Development Lead переводит его в конкретные Development Task. Расхождение с v1.0 плана: EPIC-004 (Custom Mobs) переставлен раньше — он ждёт готовности CF-2/CF-3 (Epic Map v2.0 §7 Blocked Work), а не решения по защитному инструменту, как считалось в v1.0.

### Epic-level (MVP Epic Map v2.0 §7 — дословно)

1. Решение Founder/Game Design по защитному инструменту боя — без этого нельзя финализировать Core Combat.

2. Параллельно — технический спайк Combat Network Synchronization (EPIC-003) на сниженной (кооп) планке — go/no-go для H6.

3. Core Combat System (базовая реализация) — сразу вслед за пп. 1–2.

### Task-level (Development Lead — перевод в задачи)

Project Foundation  (F-1 → F-2, F-3)

↓

Combat Foundation  (CF-1 → CF-2 / CF-3 параллельно → CF-4 → CF-5)

↓

EPIC-004 (Custom Mobs, BL-2) — старт сразу после CF-2/CF-3 (v1.1 ИСПРАВЛЕНО, см. TECHNICAL ESCALATION насчёт точного триггера)

↓

[БЛОКЕР: защитный инструмент боя — Founder / Game Design]

↓

DefensiveToolSystem (BL-1) → полная реализация/стабилизация EPIC-002

↓

EPIC-005 полная реализация (BL-3) — параллельно с зрелостью EPIC-004, по Epic Map v2.0 §7 Parallel Work

↓

EPIC-008 Boss (BL-5) — после зрелости EPIC-001 / EPIC-002 / EPIC-005

↓

Integration → Vertical Slice

↓

MVP Candidate — Epic-level scope теперь известен (12 Epic, раздел 19); Feature-level decomposition остаётся следующим шагом Product Manager'а, не входит в этот план

↓

QA Candidate Build

Параллельно Critical Path, но независимо от неё: SPK-3 (Tier A failure-state) — часть core loop, готова к работе сразу после F-2, не ждёт защитный инструмент (хотя Acceptance Criteria по содержанию потери зависят от DESIGN ESCALATION, раздел 15). Content-треки (EPIC-001/EPIC-007) и SPK-2/EPIC-006, EV-1/EPIC-009, EPIC-010 идут отдельными ветками (раздел 9).

# 9. Parallel Work

F-2 и F-3 — параллельно, оба зависят только от F-1.

CF-2, CF-3, CF-4 — параллельно между собой после готовности своих зависимостей (F-2 / F-1+F-3).

C1-1 (EPIC-001) и C7-1 (EPIC-007) — параллельно друг другу (с оговоркой на координационный риск, Game Design Review) и параллельно всей ветке Foundation/Combat Foundation, начиная сразу после F-1/F-3.

SPK-2 (Survival Architecture, EPIC-006) и EV-1 (FTB Teams, EPIC-009) — параллельно ветке Foundation/Combat Foundation, начиная сразу после F-1.

SPK-3 (Tier A) — параллельно Combat Foundation, начиная сразу после F-2.

SPK-1 (Combat Network Sync, EPIC-003) — подготовка может идти параллельно после CF-1, но формальный запуск заблокирован (см. раздел 15).

v1.1 НОВОЕ: EPIC-004 (Custom Mobs) — параллельно с EPIC-005 (Build & Ability Progression) после готовности CF-2/CF-3 (Epic Map v2.0 §7 Parallel Work), а не после защитного инструмента.

v1.1 НОВОЕ: EPIC-006 (Survival & Crafting Loop) может стартовать параллельно с EPIC-004/EPIC-005, опираясь на EPIC-001/EPIC-002 (Epic Map v2.0 §7) — SPK-2 не является гейтом на этот старт.

v1.1 НОВОЕ: EPIC-010 (Coop Multiplayer Foundation) — параллельно с контентными треками, как только EPIC-003 подтверждён (Epic Map v2.0 §7).

# 10. Technical Spikes

Полные карточки спайков — в разделе 5.5. Сводка:

| ID | Вопрос | Timebox | Статус |
| --- | --- | --- | --- |
| SPK-1 | Работает ли выбранный подход к синхронизации боевого состояния по сети в приемлемых пределах задержки/рассинхронизации на масштабе стандартного мультиплеера/кооп (2–4 игрока)? | UNKNOWN (не указан в Brief) | SPIKE — подготовка READY, формальный запуск BLOCKED |
| SPK-2 | Строить survival/production-систему кастомно или на основе существующих модов (Create/Mekanism/AE2)? | UNKNOWN | SPIKE — READY |
| SPK-3 | Как реализовать транзакционный механизм failure-state для Tier A (rollback / outright loss)? | UNKNOWN | READY — инженерная работа не блокирована; Acceptance Criteria по содержанию потери зависят от DESIGN ESCALATION (см. блокеры) |

NEEDS INVESTIGATION: «Spike 4» упомянут в разделе 6 Brief (п.7, как предусловие для EPIC-009) но нигде не определён — ни вопрос, ни scope, ни success criteria. v1.1: MVP Epic Map v2.0 тоже не упоминает Spike 4 — получение Epic Map не закрыло этот вопрос. Требуется уточнение у Tech Lead прежде чем заводить его как полноценную SPIKE-задачу.

# 11. Integration Milestones

| Milestone | Определение | Состав |
| --- | --- | --- |
| M1 — Core Build Compiles | Базовый билд собирается и запускается. | F-1 (+ F-3 к моменту, когда контенту это нужно). |
| M2 — Player State Works | Данные игрока сохраняются/загружаются надёжно. | F-2. |
| M3 — First Combat Prototype | Боевые состояния работают без защитного инструмента. | CF-1, CF-2, CF-3, CF-4, CF-5. |
| M4 — Content Track Integrated | Первый проход content-треков интегрирован в билд. | C1-1 (EPIC-001), C7-1 (EPIC-007) — Epic-level scope теперь известен по Epic Map v2.0. |
| M5 — Vertical Slice | См. раздел 12. | Foundation + Combat Foundation + SPK-3 (Tier A) + минимальный контент EPIC-001/EPIC-007. |
| M6 — MVP Feature Complete | Epic-level состав MVP теперь известен (12 Epic, раздел 19) — Feature-level всё ещё NEEDS INVESTIGATION до декомпозиции Product Manager'ом. | Все 7 P0 Epic (001,002,003,004,005,006,007) зрелые + P1 Epic (008,009,010) в согласованном с Product Lead объёме; статус EPIC-011/012 зависит от решений в разделе 15. |
| M7 — QA Candidate Build | Билд, готовый к передаче QA (раздел 14). | Все Critical Path задачи в статусе DONE. |

# 12. Playable Build Plan

### Technical Prototype

M1 + M2: билд компилируется и запускается, данные игрока переживают relog/restart. Доказывает техническую возможность, не игровой цикл.

### Gameplay Prototype

M3: базовый боевой цикл работает без защитного инструмента — атака, расход/восстановление stamina, poise/stagger, смена архетипа оружия через WeaponArchetypeRegistry. Это ровно тот объём, который Brief разрешает к разработке уже сейчас (раздел 2 Brief).

### Vertical Slice

v1.1 ИСПРАВЛЕНО: Epic Map v2.0 теперь описывает каждый компонент цикла на Epic-level. Требует снятия минимум одного ключевого блокера (защитный инструмент боя, EPIC-002/BL-1) для полноценного цикла риск/награда, плюс SPK-3 (Tier A) и минимального контента EPIC-001/EPIC-007. Цикл ниже — тот же шаблон, что и в v1.0, но с реальными Epic вместо предположений:

Enter (регион S0, EPIC-001)

↓

Explore (курируемое размещение среды/структур + точки находок EPIC-001, environmental storytelling EPIC-007 — одна координационная итерация, GD Review)

↓

Fight (Combat Foundation, EPIC-002 без DefensiveToolSystem; кастомные мобы EPIC-004, как только готовы CF-2/CF-3)

↓

Risk (SPK-3 Tier A failure-state — механизм принят; продуктовое содержание потери открыто, см. DESIGN ESCALATION)

↓

Reward / Progress (Trophy→Gear — CONFLICT-1: текстуально в EPIC-006, по решению/GD Review принадлежит EPIC-005/Build Progression)

↓

Return (EPIC-001 region loop — соло-проход подтверждён Success Criteria EPIC-006: игрок проходит цикл выживания/крафта соло)

v1.1 РАЗРЕШЕНО: Explore/Return больше не NEEDS INVESTIGATION на Epic-level: EPIC-001 (Explore) и EPIC-006 (Return/соло-цикл) полностью описаны в Epic Map v2.0. Остаётся открытым только Feature-level наполнение (конкретные точки интереса, структуры) — это следующий шаг Product Manager'а (Epic Map v2.0 §13), не Development Lead.

### MVP Candidate

v1.1 РАЗРЕШЕНО: Epic-level состав MVP Candidate теперь известен — 12 Epic из MVP Epic Map v2.0 (раздел 7.2), из которых 7 P0 (EPIC-001…007) формируют ядро, 3 P1 (EPIC-008…010) — committed scope, 2 P2 (EPIC-011, EPIC-012) — stretch/условно (EPIC-012 под CONFLICT-2).

NEEDS INVESTIGATION: Feature-level состав MVP Candidate (конкретные функции внутри каждого Epic) по-прежнему не определён этим планом — Feature-декомпозиция Epic Map v2.0 (§13) ещё не проведена Product Manager'ом. Development Lead не подменяет это решение предположениями.

# 13. Code Review Strategy

Git workflow не описан ни в одном материале — конкретные названия веток/процесс не выдумываются (§21 инструкции). Предлагаются только принципы:

Feature isolation: каждая Development Task разрабатывается изолированно от остальной работы в процессе реализации.

Implementation → Code Review → Integration — обязательная последовательность для каждой существенной задачи (§22 инструкции).

Controlled integration: интеграция происходит на определённых Integration Points (раздел 11), а не непрерывно и бесконтрольно.

Build validation перед интеграцией: билд должен собираться и проходить базовые тесты до слияния.

Для команды из 3 человек: Development Lead не должен быть единственным reviewer для критических изменений (Combat Foundation, Player Data Layer, интерфейсы), если состав команды позволяет ротацию reviewer'а между остальными двумя разработчиками.

Conflict management и stable branch/build — принцип, а не конкретный workflow: на любой момент времени должна существовать стабильная точка сборки, к которой можно откатиться.

# 14. QA Handoff Plan

На момент составления плана ни одна задача не находится в статусе QA READY — весь объём pre-implementation. Прежде чем задача переходит в QA READY, для неё должно быть подготовлено:

Завершённая реализация (Implementation done).

Acceptance Criteria — как зафиксировано в карточке задачи (раздел 5).

Test instructions — конкретные шаги воспроизведения для QA.

Known limitations — то, что сознательно не реализовано (например, для CF-1: явное отсутствие DefensiveToolSystem — это ограничение, а не баг).

Relevant edge cases.

Build/version, к которому относится передача.

Dependencies, которые должны быть в этом билде одновременно.

Expected behavior — что именно QA должен увидеть при корректной работе.

Development Lead не выполняет роль QA, но отвечает за то, чтобы каждая задача была готова по списку выше до передачи.

# 15. Development Blockers

Первые 5 строк — прямо из Brief (раздел 3). Последние 2 строки добавлены этим планом на основании раздела 4 Brief (отсутствующие источники) и раздела 6 Brief (неописанный Spike 4 / EPIC-010).

| Blocker | Impact | Blocked Tasks | Owner | Required Decision | Priority |
| --- | --- | --- | --- | --- | --- |
| Защитный инструмент боя не выбран (блок / парирование / позиционирование) — Product Definition v4 §19/§112, Epic Map v2.0 EPIC-002 | Блокирует DefensiveToolSystem внутри EPIC-002 (BL-1) и полную реализацию/стабилизацию Core Combat. НЕ блокирует Foundation-часть EPIC-002 (CF-1…CF-5). Пока не останавливает текущий Critical Path — станет P0, когда Foundation/Combat Foundation будут готовы. | BL-1, (таймингом) BL-2, BL-3 | Founder / Game Design | Выбор конкретного инструмента защиты | P1 |
| Числовой порог success/failure для Spike 1 (EPIC-003) не зафиксирован ни в одном документе — Epic Map v2.0 подтверждает Success Criteria только качественно («без критичных рассинхронизаций») | Блокирует именно старт формально оцениваемого Spike 1 — без порога результат нельзя объективно оценить постфактум. Подготовка спайка не блокирована. | SPK-1 (запуск, не подготовка) | Tech Lead + инженер, проводящий спайк | Зафиксировать числовой порог успеха/неудачи (что считается «критичной» рассинхронизацией) | P2 |
| DESIGN ESCALATION — ни один Epic не владеет содержанием failure-state (что теряет игрок при смерти/провале) — Game Design Review v2.0 §2.3, Blocking | Core Principle Risk→Consequence→Reward не проверяем как risk/reward система без этого — только как combat-feel демо. МЕХАНИЗМ (Tier A, транзакционный) уже принят технически (SPK-3 продолжается), но ПРОДУКТОВОЕ содержание потери не зафиксировано ни в одном Epic Scope/Success Criteria. | Feature-декомпозиция EPIC-002/EPIC-006 как risk/reward систем; финальные Acceptance Criteria SPK-3 | Founder / Game Design (решение) → Product Manager (внести как Feature в EPIC-002 или EPIC-006, по рекомендации GD Review) | Зафиксировать, что конкретно теряет игрок при смерти в бою / провале ресурсного цикла | P1 |
| Tier A vs Tier B failure-state механики (§6.6 техплана) — конкретно Tier B не выбран | Блокирует Tier B (bloodstain-style: world-object, TTL, конкурентный доступ в коопе) — отдельная, не оценённая задача. Tier A уже строится параллельно (SPK-3), независимо от этого блокера. | Tier B (задача пока не заведена в backlog — появится после design-решения) | Founder / Game Design → отдельная оценка Tech Lead после решения | Design-решение по Tier B | P2 |
| PRODUCT ESCALATION — EPIC-009 не описывает ни одного player decision на масштабе MVP (2–4 игрока, без персистентной экономики) — Game Design Review v2.0 §2.4 | Блокирует полную декомпозицию EPIC-009 (BL-6). Риск теперь экзистенциальный: рекомендация GD Review — слить с EPIC-010 или перенести в Later при отсутствии ответа. Техническая оценка FTB Teams (EV-1) остаётся дешёвой и не блокирована. | BL-6 | Founder / Game Design | Дать конкретный ответ, что регулирует Team Formation на этом масштабе, либо согласиться на слияние/перенос Epic'а | P1↑ |
| Диапазон глубины production chains (EPIC-006) не зафиксирован — единственная из 4 осей scope creep (билды/мобы/лор/production chains) без рабочей оценки | Риск scope creep — не блокирует старт EPIC-006 (Epic Map v2.0 §7/§12 подтверждают non-blocking), но должно быть зафиксировано до Feature-декомпозиции EPIC-006 (BL-4). Подтверждено независимо Game Design Review v2.0 §2.7. | Feature-декомпозиция BL-4 (не старт Epic-level работы) | Product / Tech Lead | Зафиксировать диапазон глубины production chains, аналогично «5–8 билдов» / «2–4 моба» | P1 |
| CONFLICT-1 — Trophy→Gear Upgrade текстуально в EPIC-006 (Epic Map v2.0 §3), но владеет EPIC-005 по уже принятому техническому решению (Handoff Brief §5 п.4) и Game Design Review v2.0 §2.2 | Feature-декомпозиция EPIC-005/EPIC-006 рискует дублировать работу или оставить Trophy→Gear без чёткого владельца. Не блокирует Epic-level старт, только Feature-декомпозицию этих двух Epic. | Feature-декомпозиция BL-3 (EPIC-005) и BL-4 (EPIC-006) | Product Manager (правка текста Epic Map) + Tech Lead (подтвердить data store решение) | Формально закрепить Trophy→Gear Upgrade как feature в составе EPIC-005 | P2 |
| CONFLICT-2 — EPIC-012 числится в MVP (P2), но обоснован post-MVP server-track контекстом, явно вынесенным в Later (самим Epic Map v2.0 §8, подтверждено Game Design Review v2.0 §2.6) | Если EPIC-012 попадёт в Feature-декомпозицию как есть, работа над ним не будет проверяема как заявленный retention-сигнал. | BL-9 | Product Lead | Оставить EPIC-012 в MVP (переформулировав ценность под соло/кооп) или перенести в Later | P2 |
| TECHNICAL ESCALATION — точный триггер старта EPIC-004/EPIC-005 неоднозначен между §7 Epic Map v2.0 (Blocked Work: только CF-2/CF-3) и §7 (Parallel Work: «после стабилизации Core Combat», что может подразумевать полную реализацию) | Влияет на то, можно ли начинать BL-2 (EPIC-004) сразу после Combat Foundation, или нужно ждать решения по защитному инструменту тоже. | BL-2, BL-3 (точный момент старта) | Tech Lead | Подтвердить: «стабилизация Core Combat» = готовность CF-2/CF-3, или требует и решения по защитному инструменту | P1 |
| RESOLVED (13.09.2026) — MVP Epic Map v2.0 и Game Design Review v2.0 получены и включены в план v1.1 | Закрывает основной блокер Development Plan v1.0 (независимая проверка графа зависимостей Epic'ов теперь возможна — раздел 19). Полная Feature-level traceability по-прежнему не завершена, т.к. Feature-декомпозиция — следующий шаг Product Manager'а (Epic Map v2.0 §13), не входит в этот пакет. | — | Tech Lead / Product (закрыто) | — | OK |

# 16. Technical Risks

v1.1: строки ниже обновлены по итогам получения MVP Epic Map v2.0 и Game Design Review v2.0 (13.09.2026) — один риск v1.0 закрыт, четыре новых добавлены, остальные перенесены без изменений.

| Риск | Описание | Митигация |
| --- | --- | --- |
| Scope creep EPIC-006 | Диапазон глубины production chains — единственная из 4 осей scope creep (билды/мобы/лор/production chains) без рабочей оценки (подтверждено независимо Game Design Review v2.0 §2.7). | Не начинать Feature-декомпозицию EPIC-006 (BL-4) до фиксации диапазона Product/Tech Lead; SPK-2 explicitly non-blocking для старта Epic-level работы (Epic Map v2.0 §12). |
| v1.1 ЗАКРЫТО: неверифицируемый граф зависимостей | Ранее: MVP Epic Map v2.0 отсутствовала, граф зависимостей Epic'ов нельзя было проверить независимо. | Получена 13.09.2026 — граф зависимостей (раздел 7.2) теперь верифицируем по первоисточнику. Риск закрыт; Feature-level граф всё ещё не построен (следующий шаг PM). |
| Неоднозначность результата Spike 1 | Без числового порога success/failure результат Combat Network Sync (EPIC-003) нельзя объективно оценить постфактум — Epic Map v2.0 подтверждает только качественный критерий. | Формальный запуск SPK-1 заблокирован до фиксации порога; можно готовить технически, но не интерпретировать промежуточные результаты как финальную оценку. |
| Reversibility EPIC-009 / FTB Teams | Решение об FTB Teams как основе — принято, но explicitly обратимо при неудаче оценки. | EV-1 спроектирована как дешёвая оценка до принятия необратимых архитектурных решений вокруг неё. |
| Связка CombatStateMachine ↔ DefensiveToolSystem | Если решение Founder/Game Design по защитному инструменту потребует структурных изменений, уже написанный CF-1 может подвергнуться рефакторингу. | CF-1 explicitly ограничен рамками, не зависящими от инструмента (раздел 5 Brief, п.2); любое расширение до решения — TECHNICAL DEVIATION, требует эскалации Tech Lead. |
| v1.1 НОВОЕ: EPIC-009 может не заслуживать отдельного Epic | Game Design Review v2.0 §2.4: Scope не описывает ни одного реального player decision на масштабе 2–4 без персистентной экономики — риск, что весь Epic избыточен. | PRODUCT ESCALATION к Founder/Game Design (раздел 15); при отсутствии конкретного ответа — слияние с EPIC-010 или перенос в Later до начала Feature-декомпозиции BL-6. |
| v1.1 НОВОЕ: неопределённое содержание failure-state | Game Design Review v2.0 §2.3 (Blocking): ни один Epic не фиксирует, что теряет игрок при смерти/провале — риск/награда цикл непроверяем как система, только как combat-feel демо. | DESIGN ESCALATION к Founder/Game Design (раздел 15); SPK-3 продолжается как инженерная задача, но финальные Acceptance Criteria не закрываются до ответа. |
| v1.1 НОВОЕ: неясная граница EPIC-002/EPIC-005 в самой Epic Map | Game Design Review v2.0 §2.1: раздел 5 Epic Map вообще не рассматривает пару weapon archetypes (EPIC-002) / weapon progression (EPIC-005) — граница де-факто согласована (см. CF-5), но не зафиксирована текстом в продуктовом документе. | Не блокирует CF-4/CF-5 (уже кодируются по рабочему решению); Product Manager должен внести границу явно в Epic Map / Feature Map до Feature-декомпозиции EPIC-005. |
| v1.1 НОВОЕ: CONFLICT-1 / CONFLICT-2 не устранены до Feature-декомпозиции | Trophy→Gear (EPIC-005 vs EPIC-006) и EPIC-012 MVP/Later статус — оба explicitly оставлены как открытые вопросы в первоисточниках, не решены Development Lead. | Не начинать Feature-декомпозицию BL-3/BL-4 (Trophy→Gear) и BL-9 (EPIC-012) до решений Product Manager / Product Lead (раздел 15). |
| Team capacity unknown | Нет данных о численности/загрузке команды. | Раздел 17 использует только T-shirt сложность + confidence, без придуманных сроков; capacity должна быть предоставлена до планирования спринтов по датам. |

# 17. Capacity / Complexity

CAPACITY UNKNOWN: Состав команды, доступность и загрузка разработчиков не предоставлены ни в одном материале. Ниже — оценка сложности задач (Small/Medium/Large/Very Large) с уровнем уверенности (High/Medium/Low), без оценки сроков.

| ID | Задача | Complexity | Confidence |
| --- | --- | --- | --- |
| F-1 | Mod Skeleton (NeoForge 1.21.1) | Medium | Medium |
| F-2 | Player Data Layer | Medium | Low |
| F-3 | Data-Driven Config Pipeline | Medium | Low |
| CF-1 | CombatStateMachine | Large | Low |
| CF-2 | StaminaSystem | Medium | Medium |
| CF-3 | PoiseSystem | Medium | Medium |
| CF-4 | WeaponArchetypeRegistry | Medium | Medium |
| CF-5 | WeaponArchetype / WeaponInstance Interface | Small/Medium | Medium |
| C1-1 | EPIC-001 — Curated Region & Exploration (S0–S1) | Large | Medium |
| C7-1 | EPIC-007 — Lore Delivery Proto-Layer | Medium | Medium |
| EV-1 | EPIC-009 — техническая оценка FTB Teams | Small/Medium | Medium |
| SPK-1 | Spike 1 — Combat Network Sync (H6) — go/no-go gate for EPIC-003 | Large | Low |
| SPK-2 | Spike 2 — Survival System Architecture (custom vs Create/Mekanism/AE2) | Large | Low |
| SPK-3 | Spike 3 — Failure-State Transactional Mechanism (Tier A) | Medium/Large | Low |

# 18. Development Backlog

## 18.1 Полные Development Task (готовы к работе — карточки в разделе 5)

| ID | Task | Epic | System | Developer | Dependency | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-1 | Mod Skeleton (NeoForge 1.21.1) | Foundation | Platform / Mod Bootstrap | Minecraft Mod Developer | — | Medium | READY |
| F-2 | Player Data Layer | Foundation | Player State / Persistence | Systems Developer | F-1 | Medium | READY |
| F-3 | Data-Driven Config Pipeline | Foundation | Content Configuration | Minecraft Mod Developer | F-1 | Medium | READY |
| CF-1 | CombatStateMachine | EPIC-002 — Core Combat System | Combat | Systems Developer | F-2 | Large | READY |
| CF-2 | StaminaSystem | EPIC-002 — Core Combat System | Combat | Systems Developer | F-2 | Medium | READY |
| CF-3 | PoiseSystem | EPIC-002 — Core Combat System | Combat | Systems Developer | F-2 | Medium | READY |
| CF-4 | WeaponArchetypeRegistry | EPIC-002 — Core Combat System | Combat / Weapons | Systems Developer | F-1, F-3 | Medium | READY |
| CF-5 | WeaponArchetype / WeaponInstance Interface | Граница EPIC-002 | Combat / Weapons | Systems Developer | CF-4 | Small/Medium | READY |
| C1-1 | EPIC-001 — Curated Region & Exploration (S0–S1) | EPIC-001 | Content / World | Content | F-1, F-3 | Large | READY |
| C7-1 | EPIC-007 — Lore Delivery Proto-Layer | EPIC-007 | Content / Narrative | Content | F-1, F-3, C1-1 (координационно, не блокирующе — см. Technical Notes) | Medium | READY |
| EV-1 | EPIC-009 — техническая оценка FTB Teams | EPIC-009 | Permissions / Teams | Minecraft Mod Developer | F-1 | Small/Medium | READY |
| SPK-1 | Spike 1 — Combat Network Sync (H6) — go/no-go gate for EPIC-003 | SPIKE | — | Systems Developer | БЛОКЕР | Large | SPIKE |
| SPK-2 | Spike 2 — Survival System Architecture (custom vs Create/Mekanism/AE2) | SPIKE | — | Minecraft Mod Developer (совместимость модов) | F-1 | Large | SPIKE |
| SPK-3 | Spike 3 — Failure-State Transactional Mechanism (Tier A) | SPIKE | — | Systems Developer | F-2 | Medium/Large | SPIKE |

## 18.2 Заблокированные / не декомпозированные позиции (без полной карточки — см. §32 инструкции)

| ID | Task | Epic | System | Developer | Dependency | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BL-1 | DefensiveToolSystem (остаток EPIC-002) | EPIC-002 | Combat | TBD (Systems Developer) | Founder / Game Design: выбор защитного инструмента (блок / парирование / позиционирование) | UNKNOWN | BLOCKED |
| BL-2 | EPIC-004 — Custom Mobs (2–4 типа, S0–S1) | EPIC-004 | Combat / Mobs | TBD (Minecraft Mod Developer + Systems Developer) | v1.1 ИСПРАВЛЕНО: CF-2/CF-3 (базовые механики стамины/пойза в EPIC-002) per Epic Map v2.0 §7 Blocked Work — НЕ полная реализация защитного инструмента (BL-1), как трактовал v1.0 плана. См. TECHNICAL ESCALATION в блокерах насчёт точного триггера. | UNKNOWN (рабочая оценка 2–4 типа мобов, число требует подтверждения Founder/Game Design) | BACKLOG — готов к старту раньше, чем считалось в v1.0 |
| BL-3 | EPIC-005 — Build & Ability Progression (5–8 билдов) | EPIC-005 | Progression / Weapons | TBD (Systems Developer) | CF-5 (граница weapon archetypes/progression готова); EPIC-002 (Epic Map v2.0). Parallel Work §7: «после стабилизации Core Combat» — параллельно с EPIC-004. | UNKNOWN (Epic-level scope известен: 5–8 билдов, уровни ~1–25; Feature-level не декомпозирован) | BACKLOG |
| BL-4 | EPIC-006 — Survival & Crafting Loop | EPIC-006 | Survival / Production | TBD | EPIC-001, EPIC-002, EPIC-004 (Epic Map v2.0 §Epic Details). v1.1 ИСПРАВЛЕНО: НЕ входит в Blocked Work (§7) — может стартовать параллельно с EPIC-004/005 уже сейчас; SPK-2 (Create/Mekanism/AE2) — явно non-blocking технический вопрос (§12), не гейт на старт. Что действительно нужно до Feature-декомпозиции: диапазон глубины production chains (см. Blocker) и решение по Trophy→Gear (см. CONFLICT-1). | UNKNOWN | BACKLOG (мягче, чем BLOCKED в v1.0 плана) |
| BL-5 | EPIC-008 — Boss Encounter (адаптированный) | EPIC-008 | Combat / Boss | TBD | EPIC-001, EPIC-002, EPIC-005 (зрелость); мягкая тех.зависимость от EPIC-004 (Requires Technical Validation, если переиспользуется анимационный фреймворк мобов) | UNKNOWN | BACKLOG (sequenced, не блокирован открытым решением) |
| BL-6 | EPIC-009 — Team Formation & Access (малая группа) | EPIC-009 | Permissions / Teams | TBD | EPIC-010 (Epic Map v2.0). Founder: подтверждённое «зачем» (что регулирует допуск на масштабе 2–4 без персистентной экономики). | UNKNOWN | BLOCKED — v1.1: Game Design Review §2.4 повышает риск до экзистенциального: Epic может не заслуживать отдельного статуса вовсе (см. PRODUCT ESCALATION в блокерах) |
| BL-7 | EPIC-010 — Coop Multiplayer Foundation (2–4 игрока) | EPIC-010 | Networking / Multiplayer | TBD (Minecraft Mod Developer) | EPIC-002, EPIC-003 (Epic Map v2.0) | UNKNOWN | BACKLOG — v1.1 РАЗРЕШЕНО: Epic Map v2.0 полностью описывает этот Epic (в v1.0 плана он был известен только по номеру, без содержания). Параллельно с контентными треками, как только EPIC-003 подтверждён. |
| BL-8 | EPIC-011 — Risk-Free PvP Arena | EPIC-011 | Combat / PvP | TBD | EPIC-002, EPIC-003 (результат), EPIC-010 (готовность) | UNKNOWN | BACKLOG, P2 — Game Design Review §2.5: обоснование слабое (desync уже тестируется через EPIC-003/008), приоритет решает PM |
| BL-9 | EPIC-012 — Rotational Retention Task | EPIC-012 | Content / Retention | TBD | EPIC-001, EPIC-006 | UNKNOWN | CONFLICT DETECTED, P2 — см. CONFLICT-2: обоснование эпика принадлежит post-MVP server-track контексту, явно вынесенному в Later; ждёт решения Product Lead (оставить в MVP или перенести в Later), не решается Development Lead |
| BL-10 | EPIC-003 — Combat Network Synchronization, полная реализация (за пределами SPK-1 spike) | EPIC-003 | Combat / Networking | TBD (Systems Developer + Minecraft Mod Developer) | EPIC-002; исход SPK-1 (go/no-go) | UNKNOWN | BACKLOG — v1.1 РАЗРЕШЕНО: в v1.0 плана EPIC-003 был ORPHAN TASK (не упомянут в Handoff Brief вообще); Epic Map v2.0 подтверждает — это самостоятельный P0 Epic (блокирующий гейт), не просто риск внутри EPIC-002. |

# 19. MVP Traceability

v1.1 ПЕРЕСОБРАНО: MVP Epic Map v2.0 и Game Design Review v2.0 получены 13.09.2026 — цепочка Product Goal → MVP → Epic теперь верифицируема первоисточником для всех 12 Epic (не только тех, что были явно названы в Handoff Brief). Feature → Game System → Technical System → Development Task остаётся NEEDS INVESTIGATION там, где Feature-декомпозиция ещё не проведена Product Manager'ом (Epic Map v2.0 §13) — это следующий шаг вне этого плана, не предположение Development Lead. Три Epic из MVP Epic Map v1.0 (Player Economy, Player Specializations, Multiplayer Backend & Data Integrity) явно исключены из MVP Epic Map v2.0, не понижены — вывод в Later, следствие пивота «сборка > сервер».

| Development Task(s) | Epic (Epic Map v2.0) | User Value / MVP Role | Traceability выше Epic |
| --- | --- | --- | --- |
| F-1, F-2, F-3 | Foundation (вне нумерации Epic — инфраструктурный слой) | Косвенно поддерживает все Epic | Не отдельный Epic ни в одном источнике — инфраструктурный слой по определению. |
| CF-1…CF-5 | EPIC-002 — Core Combat System (частично, без DefensiveToolSystem) | Бой ощущается тяжёлым через тайминг/позиционирование, не dodge-roll (H1/H8) | Подтверждено Epic Map v2.0 полностью на Epic-level; Feature-level (веточная декомпозиция) — NEEDS INVESTIGATION. |
| C1-1 | EPIC-001 — Curated Region & Exploration (S0–S1) | Мир ощущается спроектированным с намерением | v1.1 РАЗРЕШЕНО: Epic-level purpose/scope/success criteria подтверждены Epic Map v2.0. Feature-level (конкретные POI/структуры) — NEEDS INVESTIGATION. |
| C7-1 | EPIC-007 — Lore Delivery Proto-Layer | Игрок находит фрагменты истории и сам связывает их | v1.1 РАЗРЕШЕНО: то же самое; координационная зависимость от EPIC-001 подтверждена GD Review. |
| EV-1 | EPIC-009 — Team Formation & Access (частично, техническая оценка) | Игрок может объединяться с друзьями без лишних ограничений | v1.1: PRODUCT ESCALATION — GD Review §2.4 ставит под вопрос, описывает ли Epic вообще player decision на масштабе MVP; см. раздел 15. |
| SPK-1 / BL-10 | EPIC-003 — Combat Network Synchronization (Coop-Scale) | Бой не рассинхронизируется в кооп-сессии | v1.1 РАЗРЕШЕНО: в v1.0 плана это был ORPHAN TASK. Epic Map v2.0 подтверждает — самостоятельный P0 Epic (блокирующий гейт), не встроенный риск EPIC-002. |
| SPK-2 / BL-4 | EPIC-006 — Survival & Crafting Loop | Выживание требует внимания наравне с боем | v1.1 ИСПРАВЛЕНО: подтверждён как равнозначный Product Pillar (не просто content-трек); CONFLICT-1 (Trophy→Gear) не закрыт — см. раздел 15. |
| SPK-3 | EPIC-002 / EPIC-006 (владелец failure-state content не назначен) | Риск ощутим — потеря при провале имеет вес | DESIGN ESCALATION — ни Epic Map, ни GD Review не называют явного владельца содержания failure-state; см. раздел 15. |
| BL-2 | EPIC-004 — Custom Mobs (S0–S1) | Враги реагируют на пойз/стамину/тайминги органично | v1.1 ИСПРАВЛЕНО: новое MUST HAVE в v4 (было Out of MVP в v3); зависимость — CF-2/CF-3, не защитный инструмент (см. TECHNICAL ESCALATION, раздел 15). |
| BL-3 | EPIC-005 — Build & Ability Progression (5–8 билдов) | Выбор билда ощутимо меняет подход к бою (H2) | Подтверждено Epic Map v2.0; владеет weapon progression (граница с EPIC-002 — GD Review §2.1) и, по CONFLICT-1, Trophy→Gear Upgrade. |
| BL-5 | EPIC-008 — Boss Encounter (адаптированный) | Запоминающаяся кульминация региона | Committed scope (SHOULD HAVE); зависит от зрелости EPIC-001/002/005, мягкая связь с EPIC-004. |
| BL-6 | EPIC-009 — Team Formation & Access | См. EV-1 выше | См. PRODUCT ESCALATION. |
| BL-7 | EPIC-010 — Coop Multiplayer Foundation (2–4 игрока) | Игра стабильно работает при совместном прохождении | v1.1 РАЗРЕШЕНО: в v1.0 плана — ORPHAN TASK (только номер без описания). Epic Map v2.0 полностью определяет Epic. |
| BL-8 | EPIC-011 — Risk-Free PvP Arena | Проба PvP-грани без риска для прогресса | P2/stretch; GD Review §2.5 — обоснование дублирует desync-проверку EPIC-003/008. |
| BL-9 | EPIC-012 — Rotational Retention Task | Причина зайти повторно | CONFLICT-2 — числится в MVP, но обоснование post-MVP; решение за Product Lead, см. раздел 15. |
| — | Исключены из MVP (раздел 4 плана): Player Economy, Player Specializations, Multiplayer Backend & Data Integrity | — | Явно выведены в Later Epic Map v2.0 — не ORPHAN, не задачи этого плана. |

# 20. Definition of Done

Общий (per-task DoD — в карточках раздела 5). Минимальный набор критериев (§9 инструкции):

Код реализован.

Соответствует Technical Architecture (в объёме, процитированном в Brief; там, где полный текст архитектуры недоступен — соответствие подтверждается на уровне принципов, не деталей).

Compilation/build проходит.

Нет известных критических ошибок.

Acceptance Criteria выполнены (если для задачи они помечены NEEDS INVESTIGATION — DoD не может считаться закрытым до их формулировки).

Необходимые tests добавлены.

Integration requirements выполнены (задача интегрирована на своём Integration Point, раздел 11).

Код готов к QA (см. раздел 14).

DONE используется только когда выполнены Implementation + Review + Integration + необходимая валидация (§26 инструкции) — не когда задача просто написана.

# 21. Recommended Development Order

v1.1 ИСПРАВЛЕНО: порядок ниже приводится в соответствие с §7 MVP Epic Map v2.0 (Critical Path / Parallel Work / Blocked Work — цитируется дословно в разделе 8.1), а не только с рекомендацией раздела 6 Handoff Brief v1.0. Главное изменение против v1.0: EPIC-004 (Custom Mobs) больше не привязан к решению по защитному инструменту — его гейт per Epic Map v2.0 это CF-2/CF-3 (см. TECHNICAL ESCALATION, раздел 15, по поводу точного момента для EPIC-005).

| # | Шаг | Почему именно так |
| --- | --- | --- |
| 1 | Foundation (F-1, F-2, F-3) + smoke-test совместимости стека. | Ничего не может начаться без Foundation (Dependency Map, раздел 7); риск несовместимости стека выявляется раньше всего дешевле всего. |
| 2 | Параллельно: Combat Foundation (CF-1…CF-5) + фиксация порога success/failure для Spike 1 → сам Spike 1 (подготовка) + Spike 3 (Tier A) + старт EPIC-001/EPIC-007 (координированно, GD Review) + техническая оценка EPIC-009 (EV-1). | Всё перечисленное явно не заблокировано (Epic Map v2.0 §7, Handoff Brief §2) и не зависит друг от друга — максимизирует параллельность при ограниченной команде. |
| 3 | v1.1 ИСПРАВЛЕНО: как только CF-2/CF-3 готовы — старт EPIC-004 (BL-2, Custom Mobs), НЕ дожидаясь решения по защитному инструменту. | Epic Map v2.0 §7 Blocked Work: единственный гейт EPIC-004 — базовые механики стамины/пойза, уже часть Combat Foundation из шага 2. В v1.0 плана это ошибочно связывалось с BL-1 — исправлено. |
| 4 | Параллельно с шагом 3: Founder/Game Design закрывают решение по защитному инструменту боя → полная реализация DefensiveToolSystem внутри EPIC-002 (BL-1). | Самый воздействующий блокер снимается независимо от старта EPIC-004; влияет на полную стабилизацию Core Combat и на момент старта EPIC-005 (см. TECHNICAL ESCALATION). |
| 5 | EPIC-005 (BL-3, Build & Ability Progression) — после готовности интерфейса CF-5; точный момент («стабилизация Core Combat») требует подтверждения Tech Lead (TECHNICAL ESCALATION, раздел 15). Не блокирует параллельную работу над EPIC-006. | Epic Map v2.0 §7 Parallel Work перечисляет EPIC-004 и EPIC-005 как параллельные после стабилизации Core Combat — но не уточняет, требует ли «стабилизация» и решения по защитному инструменту. |
| 6 | v1.1 ИСПРАВЛЕНО: EPIC-006 (BL-4, Survival & Crafting Loop) стартует параллельно с шагами 3–5, не дожидаясь Spike 2. | Epic Map v2.0 §7/§12: EPIC-006 explicitly НЕ входит в Blocked Work; SPK-2 (custom vs Create/Mekanism/AE2) — non-blocking технический вопрос, нужен только до Feature-декомпозиции, не до старта. До Feature-декомпозиции также требуется решение CONFLICT-1 (Trophy→Gear) и диапазон production chains (раздел 15). |
| 7 | EPIC-008 Boss (BL-5) — после зрелости EPIC-001/EPIC-002/EPIC-005; техническая валидация связи с EPIC-004 (мягкая зависимость, если переиспользуется анимационный фреймворк мобов). | Epic Map v2.0 §7 Blocked Work подтверждает эту зависимость дословно. |
| 8 | EPIC-010 (BL-7, Coop Multiplayer Foundation) — параллельно с контентными треками, как только EPIC-003 (Network Sync, SPK-1/BL-10) подтверждён → EPIC-009 (BL-6, Team Formation), при условии, что PRODUCT ESCALATION (раздел 15) даст «зачем» или решит слияние/перенос. | Epic Map v2.0 §7: EPIC-010 зависит от EPIC-003; EPIC-009 зависит от EPIC-010. GD Review повышает риск EPIC-009 до экзистенциального — порядок сохраняется, но объём EPIC-009 может измениться до старта. |
| 9 | EPIC-011 (BL-8, PvP Arena) и EPIC-012 (BL-9, Retention Task) — по остаточной ёмкости, P2; EPIC-012 не берётся в работу до решения по CONFLICT-2 (Product Lead, раздел 15). | Оба явно вне Critical Path (Epic Map v2.0, приоритет P2); EPIC-012 дополнительно заблокирован нерешённым конфликтом MVP/Later статуса. |

# 22. Next Development Sprint / Iteration

### Goal

Foundation компилируется и проходит smoke-test; Combat Foundation функционален без защитного инструмента; content-треки EPIC-001/EPIC-007 стартовали; Spike 2 и Spike 3 (Tier A) в работе; порог success/failure для Spike 1 запрошен у Tech Lead.

### Tasks

F-1, F-2, F-3

CF-1, CF-2, CF-3, CF-4, CF-5

C1-1, C7-1 (старт, координированно — GD Review)

v1.1 НОВОЕ: как только CF-2/CF-3 готовы — старт EPIC-004 (BL-2, Custom Mobs), не дожидаясь решения по защитному инструменту (раздел 21, шаг 3).

SPK-2, SPK-3

EV-1

Не-код действие (перенесено из v1.0, всё ещё открыто): запросить у Tech Lead порог success/failure для Spike 1; запросить у Founder/Game Design решение по защитному инструменту.

v1.1 НОВОЕ, не-код действия по итогам Epic Map v2.0 / GD Review: (а) DESIGN ESCALATION — запросить у Founder/Game Design содержание failure-state (что теряет игрок при смерти/провале); (б) PRODUCT ESCALATION — запросить у Founder/Game Design конкретный player decision для EPIC-009 или согласие на слияние с EPIC-010/перенос в Later; (в) TECHNICAL ESCALATION — запросить у Tech Lead подтверждение точного триггера старта EPIC-005 (CF-2/CF-3 vs полная стабилизация с защитным инструментом); (г) запросить у Product Manager решение по CONFLICT-1 (Trophy→Gear: EPIC-005 vs EPIC-006) и у Product Lead — по CONFLICT-2 (EPIC-012 MVP vs Later); (д) запросить у Product Manager формальное закрепление границы EPIC-002/EPIC-005 (weapon archetypes vs progression) текстом в Epic Map, поскольку GD Review §2.1 отмечает, что раздел 5 карты её не описывает.

### Dependencies

Все перечисленные задачи уже в статусе READY — дополнительных внешних зависимостей для их старта нет (раздел 2 Brief).

### Expected Build State

M1 и M2 достигнуты; M3 в процессе или близко к завершению; M4 стартовал.

### Validation

Build компилируется и проходит smoke-test совместимости стека.

Данные игрока переживают relog/restart сервера.

Unit-тесты переходов CombatStateMachine проходят для не-defensive сценариев.

Минимум один тестовый датасет (Region или Lore) загружается через config pipeline.

Архитектурное решение Spike 2 задокументировано.

Tier A механизм (Spike 3) проходит тесты rollback/outright loss без потери целостности данных.

### Exit Criteria

Все перечисленные задачи достигли минимум статуса CODE REVIEW; milestone M3 достигнут; таблица блокеров (раздел 15) пересмотрена совместно с Tech Lead/Founder на предмет изменения статуса; минимум 2 CONFLICT DETECTED и 3 ESCALATION из раздела 15 получили явный ответ или осознанно остаются открытыми на следующую итерацию (не молчаливо забыты).

# Final Development Gate

READY WITH BLOCKERS

v1.1 ПЕРЕСМОТРЕНО по итогам получения MVP Epic Map v2.0 и Game Design Review v2.0 (13.09.2026). Объём, необходимый для немедленного старта, теперь шире, чем в v1.0: Foundation, Combat Foundation (без DefensiveToolSystem), интерфейс WeaponArchetype/WeaponInstance, content-треки EPIC-001/EPIC-007 (координированно), EPIC-004 (Custom Mobs — как только готовы CF-2/CF-3, без ожидания решения по защитному инструменту), EPIC-006 (Survival & Crafting Loop, Epic-level старт), Spike 2, Spike 3 (Tier A) и техническая оценка FTB Teams (EV-1) — ни один из этих пунктов не имеет блокера и может начинаться сейчас.

Прежний блокер «MVP Epic Map v2.0 / Game Design Review v2.0 отсутствуют» закрыт (раздел 15, строка RESOLVED). Взамен из анализа обоих документов выявлены 2 новых CONFLICT DETECTED (Trophy→Gear владение; EPIC-012 MVP/Later статус) и 3 новых эскалации (DESIGN ESCALATION по содержанию failure-state; PRODUCT ESCALATION по обоснованности EPIC-009; TECHNICAL ESCALATION по точному триггеру старта EPIC-004/005) — все зафиксированы в разделе 15. Итого в плане 10 строк блокеров/конфликтов/эскалаций. Ни один из них не останавливает текущий Critical Path (Foundation → Combat Foundation → интерфейс оружия → EPIC-004/EPIC-006 Epic-level старт) — поэтому статус остаётся READY WITH BLOCKERS, а не BLOCKED, хотя состав блокеров изменился по сравнению с v1.0.

### Требуемые решения / эскалации

NEEDS PRODUCT DECISION / NEEDS DESIGN DECISION — защитный инструмент боя (Founder/Game Design); design-решение по Tier B (Founder/Game Design); v1.1 НОВОЕ — содержание failure-state, что теряет игрок при смерти/провале (DESIGN ESCALATION, Founder/Game Design); v1.1 НОВОЕ — конкретный player decision для EPIC-009 или согласие на слияние/перенос (PRODUCT ESCALATION, Founder/Game Design); v1.1 НОВОЕ — правка текста Epic Map по Trophy→Gear владению (CONFLICT-1, Product Manager); v1.1 НОВОЕ — судьба EPIC-012, MVP или Later (CONFLICT-2, Product Lead).

NEEDS TECHNICAL DECISION — числовой порог success/failure для Spike 1 (Tech Lead); диапазон глубины production chains EPIC-006 (Product/Tech Lead); v1.1 НОВОЕ — точный триггер старта EPIC-005: готовность CF-2/CF-3 или полная стабилизация Core Combat с защитным инструментом (TECHNICAL ESCALATION, Tech Lead).

NEEDS INVESTIGATION — Feature-level декомпозиция всех 12 Epic (Epic Map v2.0 §13) ещё не проведена Product Manager'ом; Development Lead не подменяет её предположениями. Содержание Spike 4 по-прежнему нигде не определено (ни Brief, ни Epic Map v2.0).
