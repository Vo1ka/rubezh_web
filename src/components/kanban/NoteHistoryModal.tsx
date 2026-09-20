import { describeNoteHistoryEntry } from "@/lib/notes";
import type { Epic } from "@/lib/epics";
import { useNoteHistory } from "@/hooks/useNoteHistory";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoteHistoryModal({
  noteId,
  noteTitle,
  epics,
  onClose,
}: {
  noteId: string;
  noteTitle: string;
  epics: Epic[];
  onClose: () => void;
}) {
  const { entries, loading, error } = useNoteHistory(noteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-lg border bg-[var(--color-secondary-bg)] p-5"
        style={{ borderColor: "var(--color-surface-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-title)]">История изменений</h3>
            <p className="text-xs text-[var(--color-body)]">{noteTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-body)] hover:opacity-100"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {error ? <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p> : null}

        {loading ? (
          <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-[var(--color-body)]">История пока пуста.</p>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-md border p-2 text-sm"
                style={{ borderColor: "var(--color-surface-border)" }}
              >
                <p className="text-[var(--color-secondary-text)]">{describeNoteHistoryEntry(entry, epics)}</p>
                <p className="mt-1 text-xs text-[var(--color-body)]">{formatDateTime(entry.changed_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
