"use client";

import { useState } from "react";
import { STATUSES, PRIORITIES } from "@/lib/notes";
import type { NoteStatus, NotePriority } from "@/lib/notes";
import type { Epic } from "@/lib/epics";

const selectClass =
  "rounded-md border bg-[var(--color-secondary-bg)] px-2 py-1.5 text-sm text-[var(--color-secondary-text)]";
const selectBorder = { borderColor: "var(--color-secondary-border)" };

export default function BulkActionBar({
  count,
  epics,
  onSetStatus,
  onSetPriority,
  onSetEpic,
  onDelete,
  onClear,
}: {
  count: number;
  epics: Epic[];
  onSetStatus: (status: NoteStatus) => void;
  onSetPriority: (priority: NotePriority) => void;
  onSetEpic: (epicId: string | null) => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-lg border bg-[var(--color-secondary-bg)] p-3"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <span className="text-sm font-medium text-[var(--color-title)]">Выбрано: {count}</span>

      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) onSetStatus(e.target.value as NoteStatus);
          e.target.value = "";
        }}
        className={selectClass}
        style={selectBorder}
      >
        <option value="" disabled>
          Перенести в статус…
        </option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) onSetPriority(e.target.value as NotePriority);
          e.target.value = "";
        }}
        className={selectClass}
        style={selectBorder}
      >
        <option value="" disabled>
          Задать приоритет…
        </option>
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <select
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;
          if (value === "__none__") onSetEpic(null);
          else if (value) onSetEpic(value);
          e.target.value = "";
        }}
        className={selectClass}
        style={selectBorder}
      >
        <option value="" disabled>
          Привязать к Epic…
        </option>
        <option value="__none__">Без Epic</option>
        {epics.map((epic) => (
          <option key={epic.id} value={epic.id}>
            {epic.title}
          </option>
        ))}
      </select>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setConfirmingDelete(true)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium text-[var(--color-title)]"
          style={selectBorder}
        >
          Удалить
        </button>
        <button
          onClick={onClear}
          className="rounded-md border px-3 py-1.5 text-sm font-medium text-[var(--color-secondary-text)]"
          style={selectBorder}
        >
          Снять выбор
        </button>
      </div>

      {confirmingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-sm rounded-lg border bg-[var(--color-secondary-bg)] p-5"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <p className="text-sm text-[var(--color-secondary-text)]">
              Удалить {count} {count === 1 ? "заметку" : "заметок"}? Действие необратимо.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="rounded-md border px-3 py-1.5 text-sm font-medium text-[var(--color-secondary-text)]"
                style={selectBorder}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setConfirmingDelete(false);
                }}
                className="rounded-md bg-[var(--color-primary-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
