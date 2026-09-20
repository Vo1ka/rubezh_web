"use client";

import Link from "next/link";
import { usePlaygroundNotes } from "@/hooks/usePlaygroundNotes";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

function preview(content: string) {
  const oneLine = content.trim().split("\n")[0];
  return oneLine.length > 80 ? `${oneLine.slice(0, 80)}…` : oneLine;
}

export default function RecentNotesCard() {
  const { notes, loading, configured } = usePlaygroundNotes();

  if (!configured) return null;
  const recent = notes.slice(0, 5);

  return (
    <div
      className="rounded-lg border bg-[var(--color-surface-bg)] p-5"
      style={{
        borderColor: "var(--color-surface-border)",
        borderTopWidth: 4,
        borderTopColor: "var(--dashboard-notes-accent-bg)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3
          className="rounded-full px-2.5 py-0.5 text-base font-semibold"
          style={{
            backgroundColor: "var(--dashboard-notes-accent-bg)",
            color: "var(--dashboard-notes-accent-text)",
          }}
        >
          Последние заметки
        </h3>
        <Link href="/playground" className="shrink-0 text-sm text-[var(--color-body)] hover:underline">
          Playground →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : recent.length === 0 ? (
        <p className="text-sm text-[var(--color-body)]">Пока нет заметок — будьте первым в Playground.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((note) => (
            <li key={note.id}>
              <Link href={`/playground/${note.id}`} className="text-sm hover:underline">
                <span className="text-[var(--color-secondary-text)]">{preview(note.content)}</span>
                <span className="ml-2 text-xs text-[var(--color-body)]">
                  {note.author ? `${note.author}, ` : ""}
                  {formatDate(note.created_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
