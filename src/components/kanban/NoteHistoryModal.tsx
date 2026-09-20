import { STATUSES, PRIORITIES, CHANGE_TYPES } from "@/lib/notes";
import type { NoteHistoryEntry } from "@/lib/notes";
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

function resolveValue(entry: NoteHistoryEntry, value: string | null, epics: Epic[]) {
  if (value === null) return "—";
  if (entry.change_type === "status_changed") {
    return STATUSES.find((s) => s.value === value)?.label ?? value;
  }
  if (entry.change_type === "priority_changed") {
    return PRIORITIES.find((p) => p.value === value)?.label ?? value;
  }
  if (entry.change_type === "epic_changed") {
    if (value === "null") return "без Epic";
    return epics.find((e) => e.id === value)?.title ?? value;
  }
  return value;
}

function describeEntry(entry: NoteHistoryEntry, epics: Epic[]) {
  const label = CHANGE_TYPES.find((c) => c.value === entry.change_type)?.label ?? entry.change_type;
  if (entry.change_type === "created") return "Заметка создана";
  if (entry.change_type === "deleted") return "Заметка удалена";
  const from = resolveValue(entry, entry.old_value, epics);
  const to = resolveValue(entry, entry.new_value, epics);
  return `${label}: ${from} → ${to}`;
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
                <p className="text-[var(--color-secondary-text)]">{describeEntry(entry, epics)}</p>
                <p className="mt-1 text-xs text-[var(--color-body)]">{formatDateTime(entry.changed_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
