"use client";

import Link from "next/link";
import { useEpics } from "@/hooks/useEpics";
import { EPIC_STATUSES } from "@/lib/epics";

export default function ProjectProgressCard() {
  const { epics, loading, configured } = useEpics();

  if (!configured) return null;

  const counts = EPIC_STATUSES.map((status) => ({
    ...status,
    count: epics.filter((e) => e.status === status.value).length,
  })).filter((s) => s.count > 0);

  return (
    <div
      className="rounded-lg border bg-[var(--color-surface-bg)] p-5"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[var(--color-title)]">Прогресс по проекту</h3>
        <Link href="/epics" className="shrink-0 text-sm text-[var(--color-body)] hover:underline">
          Epic Map →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : epics.length === 0 ? (
        <p className="text-sm text-[var(--color-body)]">Epic Map пока не заполнена.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {counts.map((s) => (
            <li key={s.value} className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-secondary-text)]">{s.label}</span>
              <span className="text-[var(--color-body)]">
                {s.count} из {epics.length}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
