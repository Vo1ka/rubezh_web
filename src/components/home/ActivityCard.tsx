"use client";

import Link from "next/link";
import { useRecentNotesHistory } from "@/hooks/useNoteHistory";
import { useEpics } from "@/hooks/useEpics";
import { describeNoteHistoryEntry } from "@/lib/notes";
import { getSectionBySlug } from "@/lib/sections";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export default function ActivityCard() {
  const { entries, loading, configured } = useRecentNotesHistory(5);
  const { epics } = useEpics();

  if (!configured) return null;

  return (
    <div
      className="rounded-lg border bg-[var(--color-surface-bg)] p-5"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <h3 className="mb-2 text-base font-semibold text-[var(--color-title)]">Активность</h3>

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-[var(--color-body)]">Пока нет изменений на Kanban-досках.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => {
            const section = getSectionBySlug(entry.section);
            return (
              <li key={entry.id}>
                <Link href={section?.href ?? "/"} className="text-sm hover:underline">
                  <span className="text-[var(--color-secondary-text)]">
                    {section?.label ?? entry.section} · {entry.note_title}
                  </span>
                  <br />
                  <span className="text-xs text-[var(--color-body)]">
                    {describeNoteHistoryEntry(entry, epics)} — {formatDate(entry.changed_at)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
