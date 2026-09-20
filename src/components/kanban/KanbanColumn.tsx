import type { DragEvent } from "react";
import type { Note, NoteStatus } from "@/lib/notes";
import { STATUS_COLORS } from "@/lib/notes";
import type { Epic } from "@/lib/epics";
import NoteCard from "./NoteCard";

type KanbanColumnProps = {
  status: NoteStatus;
  label: string;
  notes: Note[];
  epics: Epic[];
  selectMode: boolean;
  selectedIds: Set<string>;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDrop: (status: NoteStatus) => void;
  onCyclePriority: (id: string, current: Note["priority"]) => void;
  onChangeEpic: (id: string, epicId: string | null) => void;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function KanbanColumn({
  status,
  label,
  notes,
  epics,
  selectMode,
  selectedIds,
  onDragStart,
  onDrop,
  onCyclePriority,
  onChangeEpic,
  onToggleSelect,
  onDelete,
}: KanbanColumnProps) {
  const accent = STATUS_COLORS[status];

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(status)}
      className="flex min-h-[16rem] min-w-0 flex-col gap-3 rounded-lg border bg-[var(--background)] p-3"
      style={{ borderColor: "var(--color-surface-border)", borderTopWidth: 4, borderTopColor: accent.bg }}
    >
      <div className="flex items-center justify-between px-1">
        <h3
          className="rounded-full px-2.5 py-0.5 text-sm font-semibold"
          style={{ backgroundColor: accent.bg, color: accent.text }}
        >
          {label}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: accent.bg, color: accent.text }}
        >
          {notes.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            epics={epics}
            selectMode={selectMode}
            selected={selectedIds.has(note.id)}
            onDragStart={onDragStart}
            onCyclePriority={onCyclePriority}
            onChangeEpic={onChangeEpic}
            onToggleSelect={onToggleSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
