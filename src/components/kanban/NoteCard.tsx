"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import type { Note } from "@/lib/notes";
import { PRIORITIES } from "@/lib/notes";
import type { Epic } from "@/lib/epics";
import NoteHistoryModal from "./NoteHistoryModal";

const PRIORITY_STYLE: Record<Note["priority"], string> = {
  high: "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]",
  medium: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
  low: "border border-[var(--color-secondary-border)] bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)]",
};

type NoteCardProps = {
  note: Note;
  epics: Epic[];
  selectMode: boolean;
  selected: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onCyclePriority: (id: string, current: Note["priority"]) => void;
  onChangeEpic: (id: string, epicId: string | null) => void;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NoteCard({
  note,
  epics,
  selectMode,
  selected,
  onDragStart,
  onCyclePriority,
  onChangeEpic,
  onToggleSelect,
  onDelete,
}: NoteCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const priorityLabel = PRIORITIES.find((p) => p.value === note.priority)?.label;

  return (
    <div
      draggable={!selectMode}
      onDragStart={(e) => onDragStart(e, note.id)}
      onClick={() => selectMode && onToggleSelect(note.id)}
      className={`group rounded-md border bg-[var(--color-secondary-bg)] p-3 text-sm shadow-sm ${
        selectMode ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
      }`}
      style={{
        borderColor: selected ? "var(--color-title)" : "var(--color-surface-border)",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {selectMode ? (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(note.id)}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5"
              aria-label="Выбрать заметку"
            />
          ) : null}
          <p className="text-[var(--color-secondary-text)]">{note.title}</p>
        </div>
        {!selectMode ? (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setShowHistory(true)}
              className="text-[var(--color-body)] opacity-60 hover:!opacity-100"
              aria-label="История изменений"
              title="История изменений"
            >
              🕘
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="text-[var(--color-body)] opacity-60 hover:!opacity-100"
              aria-label="Удалить заметку"
            >
              ×
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onCyclePriority(note.id, note.priority)}
          className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[note.priority]}`}
          title="Нажмите, чтобы сменить приоритет"
          disabled={selectMode}
        >
          {priorityLabel}
        </button>
        <select
          value={note.epic_id ?? ""}
          onChange={(e) => onChangeEpic(note.id, e.target.value || null)}
          onClick={(e) => e.stopPropagation()}
          disabled={selectMode}
          className="w-24 min-w-0 truncate rounded border bg-[var(--color-secondary-bg)] px-1.5 py-0.5 text-xs text-[var(--color-secondary-text)]"
          style={{ borderColor: "var(--color-secondary-border)" }}
          title={epics.find((e) => e.id === note.epic_id)?.title ?? "Привязать к Epic"}
        >
          <option value="">Без Epic</option>
          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.title}
            </option>
          ))}
        </select>
      </div>

      {showHistory ? (
        <NoteHistoryModal
          noteId={note.id}
          noteTitle={note.title}
          epics={epics}
          onClose={() => setShowHistory(false)}
        />
      ) : null}
    </div>
  );
}
