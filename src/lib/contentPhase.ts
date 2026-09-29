import type { DecisionRecord } from "./decisions";
import type { Note } from "./notes";

// Snapshot of Content_Phase_Development_Plan_2026-09-29.md (docs/). The plan
// itself is static; task and blocker states on /content-phase are derived
// live from the Kanban cards ("<code> — …" titles) and /decisions records.

export const PLAN_SOURCE = "Content Phase Development Plan, 29.09.2026";
export const PLAN_GATE = "READY WITH BLOCKERS";

export type FoundationItem = {
  title: string;
  description: string;
  source: string;
  // "partial" = built but with a known tail; `doneWhen` flips it to done
  // once that Kanban task is closed.
  state: "done" | "partial";
  doneWhen?: string;
};

export const FOUNDATION: FoundationItem[] = [
  {
    title: "Боевой пайплайн",
    description: "Урон, гард, блок, аффиксы предметов. Закрыто без остаточных замечаний.",
    source: "D-38 → D-44",
    state: "done",
  },
  {
    title: "Атрибуты и ресурсы",
    description: "HP / Mana / Energy, модель смерти, атрибуты персонажа.",
    source: "D-01…D-44",
    state: "done",
  },
  {
    title: "Интеграция с Better Combat",
    description: "Анимация ближнего боя для любого нового оружия — бесплатно через адаптер.",
    source: "AN-02",
    state: "done",
  },
  {
    title: "Прерывание каста при попадании",
    description: "CastInterruptListener — контент использует готовый контракт.",
    source: "S-02 · D-44",
    state: "done",
  },
  {
    title: "Топология Great Tree",
    description: "348 / 377 / 858 подтверждено golden-fixture тестом. Черновой UI дерева готов.",
    source: "Sync Gate 1",
    state: "done",
  },
  {
    title: "Fireball и хотбар заклинаний",
    description: "Эталонное заклинание с презентацией (частицы + звук).",
    source: "README §1",
    state: "done",
  },
  {
    title: "iron_sword",
    description: "RpgItemProfile + weapon_attributes, протестирован вживую. Эталон для TTK.",
    source: "README §2",
    state: "done",
  },
  {
    title: "3 тестовых архетипа мобов",
    description: "Воин, стрелок, заговорённый воин (FIRE). Фикстуры, не production-контент.",
    source: "D-24, D-25",
    state: "done",
  },
  {
    title: "Контракт внешних мобов (RubezhApi)",
    description:
      "API, data map rubezh:combatants и 4 события. Сборка и тесты проходят, живой проверки в игре ещё не было.",
    source: "D-39 · 31c81c5",
    state: "partial",
    doneWhen: "M-01",
  },
  {
    title: "Зоны с уровнем",
    description: "Готовы как данные (кольца, JSON). Координаты ждут решения fixed vs procedural.",
    source: "D-28",
    state: "partial",
  },
  {
    title: "README/ТЗ под D-38/D-39",
    description: "Формулировка подтверждена TechLead 29.09. Осталось смёржить PR.",
    source: "/decisions",
    state: "partial",
  },
];

export type ContentMeter = {
  title: string;
  value: number;
  total: number;
  unit?: string;
  note: string;
};

export const METERS: ContentMeter[] = [
  {
    title: "Great Tree: узлы с эффектами",
    value: 60,
    total: 483,
    note: "На 24.09. Цель MVP — 5–8 подветок с полным эффектом (T-01), не все 34.",
  },
  {
    title: "Оружие первой волны",
    value: 1,
    total: 6,
    note: "iron_sword готов. Тяжёлое, лёгкое, лук и 2 катализатора — не начаты.",
  },
  {
    title: "Заклинания",
    value: 1,
    total: 2,
    note: "Fireball. Второе заклинание (S-01) ждёт катализатор W-04.",
  },
  {
    title: "Production-мобы",
    value: 0,
    total: 3,
    unit: "+ 3 тестовых",
    note: "Мобов не пишем сами — курируем сторонние моды через RubezhApi (M-01…M-05).",
  },
];

export type Priority = "P0" | "P1" | "P2" | "LATER";

export type PlanTask = {
  code: string;
  title: string;
  priority: Priority;
  deps: string[];
  // Closed by the plan itself — no Kanban card exists for these.
  closedInPlan?: string;
  // Waits on a human decision tracked in /decisions; unblocked once that
  // record is resolved (or removed).
  decision?: { id: string; label: string };
  hint?: string;
};

export type Workstream = {
  title: string;
  owner: string;
  tasks: PlanTask[];
};

export const WORKSTREAMS: Workstream[] = [
  {
    title: "Оружие",
    owner: "Инженер В",
    tasks: [
      { code: "W-01", title: "Тяжёлое оружие первой волны", priority: "P0", deps: [] },
      { code: "W-02", title: "Лёгкое оружие", priority: "P0", deps: [] },
      { code: "W-03", title: "Лук / дальнобойное", priority: "P1", deps: ["W-01"] },
      { code: "W-04", title: "Катализатор на школу", priority: "P1", deps: [], hint: "Блокирует S-01" },
    ],
  },
  {
    title: "Заклинания",
    owner: "Инженер В",
    tasks: [
      {
        code: "S-02",
        title: "Прерывание каста при попадании",
        priority: "P0",
        deps: [],
        closedInPlan: "CastInterruptListener, D-44",
      },
      { code: "S-01", title: "Второе заклинание", priority: "P1", deps: ["W-04"] },
    ],
  },
  {
    title: "Great Tree",
    owner: "Инженер В + Game Design",
    tasks: [
      {
        code: "T-01",
        title: "5–8 MVP-подветок",
        priority: "P0",
        deps: [],
        decision: { id: "26340d2d-445c-4ddd-8e8e-480c09513563", label: "PM: build≈подветка" },
      },
      { code: "T-02", title: "Слой notable-узлов", priority: "P2", deps: ["T-01"] },
      { code: "T-03", title: "Остальные ~29 подветок", priority: "LATER", deps: ["T-01"] },
    ],
  },
  {
    title: "Мобы",
    owner: "Курирование внешних модов",
    tasks: [
      { code: "M-01", title: "Живая проверка контракта D-39", priority: "P0", deps: [], hint: "Инженер Б" },
      {
        code: "M-04",
        title: "Множители band: boss",
        priority: "P0",
        deps: [],
        decision: { id: "ae516699-29d6-4db5-8bb3-8bc6b2ca63b4", label: "Game Design" },
      },
      { code: "M-02", title: "Отбор реальных мод-мобов", priority: "P1", deps: ["M-01"] },
      { code: "M-03", title: "Datapack-записи rubezh:combatants", priority: "P1", deps: ["M-02"] },
      { code: "M-05", title: "Стихийный урон у мобов (fire)", priority: "P1", deps: ["M-01"] },
    ],
  },
  {
    title: "Анимации",
    owner: "Инженер Б/В + TechLead",
    tasks: [
      {
        code: "AN-02",
        title: "Анимация ближнего боя",
        priority: "P0",
        deps: [],
        closedInPlan: "Через Better Combat",
      },
      { code: "AN-01", title: "Blockbench-мост: оценка TechLead", priority: "P0", deps: [] },
      { code: "AN-03", title: "Презентация каста 2-го заклинания", priority: "P1", deps: ["AN-01", "S-01"] },
    ],
  },
];

// §7 blockers, all recorded in /decisions.
export const BLOCKER_IDS: { id: string; owner: string; priority: Priority }[] = [
  { id: "7db410bf-40cf-48d7-9ad8-28731e560fbf", owner: "TechLead → любой dev", priority: "P0" },
  { id: "81b84bef-c151-428d-8329-329c0b3a2892", owner: "Инженер Б", priority: "P0" },
  { id: "ae516699-29d6-4db5-8bb3-8bc6b2ca63b4", owner: "Game Design", priority: "P0" },
  { id: "771a0f64-8fa2-43f8-89da-dc2566dcd0be", owner: "Dev Lead + GD, TechLead", priority: "P0" },
  { id: "68ebccd5-6a74-4a9d-b540-bc3fb8918898", owner: "PM / Founder", priority: "P1" },
  { id: "26340d2d-445c-4ddd-8e8e-480c09513563", owner: "PM", priority: "P1" },
  { id: "a2a63f45-b3bc-422e-b896-fbe156d094f7", owner: "Founder", priority: "P1" },
];

// A "decision" record is already a made decision; risks and open questions
// count as resolved once moved off their open/blocking statuses.
export function isRecordResolved(record: DecisionRecord | undefined) {
  if (!record) return true;
  if (record.type === "decision") return true;
  return record.status === "mitigated" || record.status === "closed" || record.status === "non_blocking";
}

export type TaskState = "done" | "in_progress" | "ready" | "needs_decision" | "waiting" | "later";

export const TASK_STATE_LABEL: Record<TaskState, string> = {
  done: "✓ Готово",
  in_progress: "В работе",
  ready: "Можно начинать",
  needs_decision: "Нужно решение",
  waiting: "Ждёт",
  later: "Later",
};

export type ResolvedTask = PlanTask & {
  state: TaskState;
  card: Note | undefined;
  pendingDeps: string[];
};

export function findCard(notes: Note[], code: string) {
  return notes.find((n) => n.title.startsWith(`${code} — `) || n.title.startsWith(`${code} `));
}

export function resolveTasks(notes: Note[], records: DecisionRecord[]): Map<string, ResolvedTask> {
  const all = WORKSTREAMS.flatMap((w) => w.tasks);
  const resolved = new Map<string, ResolvedTask>();

  const isDone = (task: PlanTask) =>
    Boolean(task.closedInPlan) || findCard(notes, task.code)?.status === "done";

  for (const task of all) {
    const card = findCard(notes, task.code);
    const pendingDeps = task.deps.filter((code) => {
      const dep = all.find((t) => t.code === code);
      return dep ? !isDone(dep) : false;
    });

    let state: TaskState;
    if (isDone(task)) state = "done";
    else if (card && (card.status === "in_progress" || card.status === "review")) state = "in_progress";
    else if (task.priority === "LATER") state = "later";
    else if (task.decision && !isRecordResolved(records.find((r) => r.id === task.decision!.id)))
      state = "needs_decision";
    else if (pendingDeps.length > 0) state = "waiting";
    else state = "ready";

    resolved.set(task.code, { ...task, state, card, pendingDeps });
  }
  return resolved;
}
