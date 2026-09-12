import type { DragEvent } from "react";
import type { Note, NoteStatus } from "@/lib/notes";
import NoteCard from "./NoteCard";

type KanbanColumnProps = {
  status: NoteStatus;
  label: string;
  notes: Note[];
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDrop: (status: NoteStatus) => void;
  onCyclePriority: (id: string, current: Note["priority"]) => void;
  onDelete: (id: string) => void;
};

export default function KanbanColumn({
  status,
  label,
  notes,
  onDragStart,
  onDrop,
  onCyclePriority,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(status)}
      className="flex min-h-[16rem] flex-col gap-3 rounded-lg border bg-[var(--background)] p-3"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">
          {label}
        </h3>
        <span className="text-xs text-[var(--color-body)]">{notes.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDragStart={onDragStart}
            onCyclePriority={onCyclePriority}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
