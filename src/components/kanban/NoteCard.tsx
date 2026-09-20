import type { DragEvent } from "react";
import type { Note } from "@/lib/notes";
import { PRIORITIES } from "@/lib/notes";
import type { Epic } from "@/lib/epics";

const PRIORITY_STYLE: Record<Note["priority"], string> = {
  high: "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]",
  medium: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
  low: "border border-[var(--color-secondary-border)] bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)]",
};

type NoteCardProps = {
  note: Note;
  epics: Epic[];
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onCyclePriority: (id: string, current: Note["priority"]) => void;
  onChangeEpic: (id: string, epicId: string | null) => void;
  onDelete: (id: string) => void;
};

export default function NoteCard({
  note,
  epics,
  onDragStart,
  onCyclePriority,
  onChangeEpic,
  onDelete,
}: NoteCardProps) {
  const priorityLabel = PRIORITIES.find((p) => p.value === note.priority)?.label;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, note.id)}
      className="group cursor-grab rounded-md border bg-[var(--color-secondary-bg)] p-3 text-sm shadow-sm active:cursor-grabbing"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-[var(--color-secondary-text)]">{note.title}</p>
        <button
          onClick={() => onDelete(note.id)}
          className="opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить заметку"
        >
          ×
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onCyclePriority(note.id, note.priority)}
          className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[note.priority]}`}
          title="Нажмите, чтобы сменить приоритет"
        >
          {priorityLabel}
        </button>
        <select
          value={note.epic_id ?? ""}
          onChange={(e) => onChangeEpic(note.id, e.target.value || null)}
          className="rounded border bg-[var(--color-secondary-bg)] px-1.5 py-0.5 text-xs text-[var(--color-secondary-text)]"
          style={{ borderColor: "var(--color-secondary-border)" }}
          title="Привязать к Epic"
        >
          <option value="">Без Epic</option>
          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
