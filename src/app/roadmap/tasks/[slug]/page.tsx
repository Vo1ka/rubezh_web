"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRoadmapTasks } from "@/hooks/useRoadmapTasks";
import { useEpics } from "@/hooks/useEpics";

const KIND_LABEL: Record<string, string> = {
  task: "Development Task",
  spike: "Technical Spike",
};

export default function RoadmapTaskDetailPage() {
  const params = useParams<{ slug: string }>();
  const { tasks, loading, error, configured } = useRoadmapTasks();
  const { epics } = useEpics();

  if (!configured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Supabase не настроен — Roadmap недоступен.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      </div>
    );
  }

  const task = tasks.find((t) => t.slug === params.slug);

  if (error || !task) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6">
        <Link href="/roadmap" className="text-sm text-[var(--color-body)] hover:underline">
          ← Назад к Roadmap
        </Link>
        <p className="text-sm text-[var(--color-title)]">
          {error ? `Ошибка: ${error}` : "Задача не найдена."}
        </p>
      </div>
    );
  }

  const epic = epics.find((e) => e.id === task.epic_id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link href="/roadmap" className="text-sm text-[var(--color-body)] hover:underline">
        ← Назад к Roadmap
      </Link>

      <div
        className="rounded-lg border bg-[var(--color-secondary-bg)] p-6"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-[var(--color-primary-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-text)]">
            {task.code}
          </span>
          <span
            className="rounded border px-2 py-0.5 text-xs text-[var(--color-body)]"
            style={{ borderColor: "var(--color-secondary-border)" }}
          >
            {KIND_LABEL[task.kind] ?? task.kind}
          </span>
          {task.status ? (
            <span
              className="rounded border px-2 py-0.5 text-xs text-[var(--color-body)]"
              style={{ borderColor: "var(--color-secondary-border)" }}
            >
              {task.status}
            </span>
          ) : null}
        </div>

        <h1 className="mt-3 text-xl font-bold text-[var(--color-title)]">{task.title}</h1>

        {epic ? (
          <p className="mt-2 text-sm">
            <span className="text-[var(--color-body)]">Epic: </span>
            <Link href={`/epics/${epic.id}`} className="text-[var(--color-title)] hover:underline">
              {epic.title}
            </Link>
          </p>
        ) : null}

        <dl className="mt-5 flex flex-col divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
          {task.fields.map((f, i) => (
            <div key={i} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                {f.label}
              </dt>
              <dd className="text-sm whitespace-pre-wrap text-[var(--color-secondary-text)]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
