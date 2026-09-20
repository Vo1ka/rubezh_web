"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlaygroundNote } from "@/lib/playground";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlaygroundNoteCard({
  note,
  onDelete,
}: {
  note: PlaygroundNote;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-[var(--color-body)]">
          {note.author ? `${note.author} · ` : ""}
          {formatDateTime(note.created_at)}
        </p>
        <button
          onClick={() => setConfirming(true)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить заметку"
        >
          ×
        </button>
      </div>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-sm rounded-lg border bg-[var(--color-secondary-bg)] p-5"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <p className="text-sm text-[var(--color-secondary-text)]">
              Вы точно хотите удалить заметку?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-md border px-3 py-1.5 text-sm font-medium text-[var(--color-secondary-text)]"
                style={{ borderColor: "var(--color-secondary-border)" }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onDelete(note.id);
                  setConfirming(false);
                }}
                className="rounded-md bg-[var(--color-primary-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
        {note.content}
      </p>
      <Link
        href={`/playground/${note.id}`}
        className="mt-3 inline-block text-xs text-[var(--color-body)] hover:underline"
      >
        Открыть и обсудить →
      </Link>
    </div>
  );
}
