"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useContentPhaseNotes } from "@/hooks/useContentPhaseNotes";
import { useDecisions } from "@/hooks/useDecisions";
import { STATUS_OPTIONS } from "@/lib/decisions";
import {
  BLOCKER_IDS,
  FOUNDATION,
  METERS,
  PLAN_GATE,
  PLAN_SOURCE,
  TASK_STATE_LABEL,
  WORKSTREAMS,
  isRecordResolved,
  resolveTasks,
} from "@/lib/contentPhase";
import type { ResolvedTask, TaskState } from "@/lib/contentPhase";

const surface = { borderColor: "var(--color-surface-border)" };

const STATE_ORDER: TaskState[] = ["done", "in_progress", "ready", "needs_decision", "waiting", "later"];

// Same accent vocabulary as the Kanban/Proposals badges; "done" alone gets
// the solid forest surface so finished work reads first.
const STATE_STYLE: Record<TaskState, { card: CSSProperties; pill: CSSProperties; bar: string }> = {
  done: {
    card: { background: "var(--color-primary-bg)", borderColor: "var(--color-primary-bg)", color: "var(--color-primary-text)" },
    pill: { background: "var(--color-cream-100)", color: "var(--color-forest-950)" },
    bar: "var(--color-forest-800)",
  },
  in_progress: {
    card: { borderColor: "var(--badge-orange)", borderWidth: 2 },
    pill: { background: "var(--badge-orange)", color: "var(--badge-text)" },
    bar: "var(--badge-orange)",
  },
  ready: {
    card: { borderColor: "var(--color-forest-600)", borderWidth: 2 },
    pill: { background: "transparent", color: "var(--color-forest-800)", border: "1.5px solid var(--color-forest-600)" },
    bar: "var(--color-sage-400)",
  },
  needs_decision: {
    card: { borderLeftColor: "var(--badge-tomato)", borderLeftWidth: 4 },
    pill: { background: "var(--badge-tomato)", color: "var(--badge-text)" },
    bar: "var(--badge-tomato)",
  },
  waiting: {
    card: {},
    pill: { background: "transparent", color: "var(--badge-text)", border: "1.5px solid var(--badge-dark-orange)" },
    bar: "var(--badge-gold)",
  },
  later: {
    card: { borderStyle: "dashed", opacity: 0.7 },
    pill: { background: "transparent", color: "var(--color-body)", border: "1.5px dashed var(--color-body)" },
    bar: "#b9b8ad",
  },
};

const STATE_SUMMARY: Record<TaskState, string> = {
  done: "готово",
  in_progress: "в работе",
  ready: "можно начинать",
  needs_decision: "ждут решения",
  waiting: "ждут других задач",
  later: "отложено",
};

export default function ContentPhasePage() {
  const { notes, loading: notesLoading, error: notesError, configured } = useContentPhaseNotes();
  const { records, loading: recordsLoading, error: recordsError } = useDecisions();
  const [onlyDone, setOnlyDone] = useState(false);

  const tasks = useMemo(() => resolveTasks(notes, records), [notes, records]);
  const allTasks = [...tasks.values()];
  const counts = STATE_ORDER.map((state) => ({
    state,
    count: allTasks.filter((t) => t.state === state).length,
  }));

  const blockers = BLOCKER_IDS.map((b) => ({ ...b, record: records.find((r) => r.id === b.id) })).filter(
    (b) => b.record
  );
  const openBlockers = blockers.filter((b) => !isRecordResolved(b.record)).length;

  const loading = notesLoading || recordsLoading;
  const error = notesError ?? recordsError;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--color-title)]">Контент-фаза</h1>
          <p className="mt-1 max-w-2xl text-[var(--color-body)]">
            Что уже сделано и что дальше по плану контент-этапа. Статусы задач берутся вживую
            из Kanban (Разработка, ТехЛид) и из{" "}
            <Link href="/decisions" className="underline">
              Решений
            </Link>
            .
          </p>
        </div>
        <div
          className="rounded-lg border-2 px-4 py-2"
          style={{ borderColor: "var(--badge-dark-orange)", background: "#f7ecd2" }}
        >
          <p className="text-sm font-bold tracking-wide text-[var(--badge-text)]">{PLAN_GATE}</p>
          <p className="text-xs text-[var(--color-body)]">Final Development Gate</p>
        </div>
      </div>

      {!configured ? (
        <p className="text-sm text-[var(--color-body)]">Supabase не настроен — статусы задач недоступны.</p>
      ) : error ? (
        <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
      ) : null}

      <section className="flex flex-col gap-3" aria-label="Сводка">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {counts.map(({ state, count }) => (
            <div
              key={state}
              className="flex flex-col rounded-lg border p-3"
              style={
                state === "done"
                  ? STATE_STYLE.done.card
                  : { ...surface, background: "var(--color-secondary-bg)" }
              }
            >
              <span className="text-2xl font-bold tabular-nums">
                {loading ? "…" : state === "done" ? `${count} / ${allTasks.length}` : count}
              </span>
              <span className="text-xs" style={{ opacity: state === "done" ? 0.9 : 1 }}>
                {STATE_SUMMARY[state]}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex h-2.5 overflow-hidden rounded-full"
          style={{ background: "var(--color-secondary-bg)" }}
          role="img"
          aria-label={counts.map((c) => `${STATE_SUMMARY[c.state]}: ${c.count}`).join(", ")}
        >
          {counts.map(({ state, count }) =>
            count > 0 ? (
              <i
                key={state}
                className="block h-full"
                style={{ width: `${(count / allTasks.length) * 100}%`, background: STATE_STYLE[state].bar }}
              />
            ) : null
          )}
        </div>
      </section>

      <section
        className="flex flex-col gap-4 rounded-xl p-5 sm:p-6"
        style={{ background: "var(--color-primary-bg)", color: "var(--color-primary-text)" }}
        aria-labelledby="done-h"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Фундамент</p>
            <h2 id="done-h" className="text-xl font-bold">
              Уже сделано
            </h2>
          </div>
          <div className="flex gap-4 text-xs opacity-90">
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-3.5 w-3.5 rounded-full bg-[var(--color-cream-100)]" /> Готово
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-3.5 w-3.5 rounded-full border-2 border-dashed border-[var(--color-cream-100)]" />{" "}
              Построено, есть хвост
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDATION.map((item) => {
            const done =
              item.state === "done" || (item.doneWhen ? tasks.get(item.doneWhen)?.state === "done" : false);
            return (
              <div
                key={item.title}
                className="grid grid-cols-[26px_minmax(0,1fr)] gap-2.5 rounded-lg border p-3"
                style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.16)" }}
              >
                {done ? (
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[var(--color-cream-100)] text-sm font-bold text-[var(--color-forest-800)]">
                    ✓
                  </span>
                ) : (
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-dashed border-[var(--color-cream-100)] text-xs font-bold">
                    ½
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-5 opacity-85">{item.description}</p>
                  <p className="mt-1.5 font-mono text-[11px] opacity-70">{item.source}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="meters-h">
        <div>
          <h2 id="meters-h" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Объём контента
          </h2>
          <p className="text-xs text-[var(--color-body)]">Снимок плана на 29.09.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {METERS.map((m) => (
            <div
              key={m.title}
              className="flex flex-col gap-2 rounded-lg border bg-[var(--color-secondary-bg)] p-4"
              style={surface}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--color-title)]">{m.title}</h3>
                <span className="text-lg font-bold tabular-nums text-[var(--color-title)]">
                  {m.value}
                  <span className="text-sm font-medium text-[var(--color-body)]">
                    {m.unit ? ` ${m.unit}` : ` / ${m.total}`}
                  </span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-cream-100)]">
                <div
                  className="h-full rounded-full bg-[var(--color-forest-800)]"
                  style={{ width: `${(m.value / m.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[var(--color-body)]">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="ws-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ws-h" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Задачи по потокам
          </h2>
          <div className="flex gap-1">
            {[
              { value: false, label: "Все задачи" },
              { value: true, label: "Только готовое" },
            ].map((opt) => {
              const isActive = onlyDone === opt.value;
              return (
                <button
                  key={opt.label}
                  onClick={() => setOnlyDone(opt.value)}
                  aria-pressed={isActive}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]"
                      : "border text-[var(--color-secondary-text)]"
                  }`}
                  style={isActive ? undefined : { borderColor: "var(--color-secondary-border)" }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {WORKSTREAMS.map((ws) => {
            const wsTasks = ws.tasks.map((t) => tasks.get(t.code)!);
            const wsDone = wsTasks.filter((t) => t.state === "done").length;
            return (
              <div
                key={ws.title}
                className="grid grid-cols-1 gap-4 rounded-lg border bg-[var(--color-secondary-bg)] p-4 md:grid-cols-[180px_minmax(0,1fr)]"
                style={surface}
              >
                <div>
                  <h3 className="font-semibold text-[var(--color-title)]">{ws.title}</h3>
                  <p className="text-xs text-[var(--color-body)]">{ws.owner}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-forest-800)]">
                    {wsDone} из {wsTasks.length} готово
                  </p>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {wsTasks.map((task) => (
                    <TaskCard key={task.code} task={task} dimmed={onlyDone && task.state !== "done"} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="bl-h">
        <div>
          <h2 id="bl-h" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Блокеры
          </h2>
          <p className="text-xs text-[var(--color-body)]">
            {loading ? "Загрузка…" : `Открыто ${openBlockers} из ${blockers.length}. Статусы — из /decisions.`}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {blockers.map(({ id, owner, priority, record }) => {
            const resolved = isRecordResolved(record);
            const statusLabel =
              STATUS_OPTIONS[record!.type].find((s) => s.value === record!.status)?.label ?? "Без статуса";
            return (
              <Link
                key={id}
                href="/decisions"
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-lg border p-3 transition-colors hover:border-[var(--color-title)] sm:grid-cols-[minmax(0,1fr)_180px_auto_40px]"
                style={resolved ? STATE_STYLE.done.card : { ...surface, background: "var(--color-secondary-bg)" }}
              >
                <span className="min-w-0 text-sm font-semibold">
                  {resolved ? "✓ " : ""}
                  {record!.title}
                </span>
                <span className="text-xs opacity-80 max-sm:col-start-1 max-sm:row-start-2">{owner}</span>
                <span
                  className="justify-self-end rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide max-sm:row-start-1"
                  style={resolved ? STATE_STYLE.done.pill : STATE_STYLE.needs_decision.pill}
                >
                  {statusLabel}
                </span>
                <span className="justify-self-end font-mono text-xs font-semibold max-sm:col-start-2 max-sm:row-start-2">
                  {priority}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-[var(--color-body)]">
        Источник: {PLAN_SOURCE} — docs/Content_Phase_Development_Plan_2026-09-29.md. Задача считается
        готовой, когда её карточка «КОД — …» перенесена в «Готово» на Kanban.
      </p>
    </div>
  );
}

function TaskCard({ task, dimmed }: { task: ResolvedTask; dimmed: boolean }) {
  const style = STATE_STYLE[task.state];
  const isDone = task.state === "done";
  const detail = task.closedInPlan
    ? task.closedInPlan
    : task.state === "needs_decision"
      ? `Решение: ${task.decision!.label}`
      : task.pendingDeps.length > 0 && task.state !== "done"
        ? `← ${task.pendingDeps.join(", ")}`
        : (task.hint ?? "");

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold">{task.code}</span>
        <span
          className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
          style={style.pill}
        >
          {TASK_STATE_LABEL[task.state]}
        </span>
      </div>
      <h4 className="text-sm font-semibold leading-snug">{task.title}</h4>
      <div className="flex items-center justify-between gap-2 text-[11.5px]" style={{ opacity: isDone ? 0.85 : 1 }}>
        <span className={isDone ? "" : "text-[var(--color-body)]"}>{detail}</span>
        <span className={`font-mono ${isDone ? "" : "text-[var(--color-body)]"}`}>{task.priority}</span>
      </div>
    </>
  );

  const className = `flex flex-col gap-1.5 rounded-lg border p-3 transition-opacity ${
    isDone ? "" : "bg-[var(--color-background)]"
  }`;
  const cardStyle: CSSProperties = {
    borderColor: "var(--color-surface-border)",
    ...style.card,
    ...(dimmed ? { opacity: 0.2 } : null),
  };

  return task.card ? (
    <Link href={`/${task.card.section}`} className={`${className} hover:underline`} style={cardStyle}>
      {body}
    </Link>
  ) : (
    <div className={className} style={cardStyle}>
      {body}
    </div>
  );
}
