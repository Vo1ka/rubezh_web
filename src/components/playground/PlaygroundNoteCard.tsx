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
          onClick={() => onDelete(note.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить заметку"
        >
          ×
        </button>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
        {note.content}
      </p>
    </div>
  );
}
