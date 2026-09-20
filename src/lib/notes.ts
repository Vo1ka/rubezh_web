import type { SectionSlug } from "./sections";
import type { Epic } from "./epics";

export const STATUSES = [
  { value: "backlog", label: "Бэклог" },
  { value: "in_progress", label: "В работе" },
  { value: "review", label: "Ревью" },
  { value: "done", label: "Готово" },
] as const;

export type NoteStatus = (typeof STATUSES)[number]["value"];

export const STATUS_COLORS: Record<NoteStatus, { bg: string; text: string }> = {
  backlog: { bg: "var(--status-backlog-bg)", text: "var(--status-backlog-text)" },
  in_progress: { bg: "var(--status-in-progress-bg)", text: "var(--status-in-progress-text)" },
  review: { bg: "var(--status-review-bg)", text: "var(--status-review-text)" },
  done: { bg: "var(--status-done-bg)", text: "var(--status-done-text)" },
};

export const PRIORITIES = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
] as const;

export type NotePriority = (typeof PRIORITIES)[number]["value"];

export type Note = {
  id: string;
  section: SectionSlug;
  title: string;
  content: string | null;
  status: NoteStatus;
  priority: NotePriority;
  position: number;
  author: string | null;
  epic_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NewNoteInput = {
  section: SectionSlug;
  title: string;
  status?: NoteStatus;
  priority?: NotePriority;
  author?: string | null;
};

export const SORT_MODES = [
  { value: "manual", label: "Вручную (drag & drop)" },
  { value: "priority", label: "По приоритету" },
  { value: "created_at", label: "По дате создания (новые сверху)" },
] as const;

export type SortMode = (typeof SORT_MODES)[number]["value"];

const PRIORITY_RANK: Record<NotePriority, number> = { high: 0, medium: 1, low: 2 };

export function sortNotes(notes: Note[], mode: SortMode): Note[] {
  if (mode === "priority") {
    return [...notes].sort(
      (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.position - b.position
    );
  }
  if (mode === "created_at") {
    return [...notes].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return notes;
}

export const CHANGE_TYPES = [
  { value: "created", label: "Создана" },
  { value: "deleted", label: "Удалена" },
  { value: "status_changed", label: "Статус изменён" },
  { value: "priority_changed", label: "Приоритет изменён" },
  { value: "epic_changed", label: "Привязка к Epic изменена" },
  { value: "title_changed", label: "Название изменено" },
] as const;

export type NoteChangeType = (typeof CHANGE_TYPES)[number]["value"];

export type NoteHistoryEntry = {
  id: string;
  note_id: string;
  note_title: string;
  section: SectionSlug;
  change_type: NoteChangeType;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
};

function resolveHistoryValue(entry: NoteHistoryEntry, value: string | null, epics: Epic[]) {
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

export function describeNoteHistoryEntry(entry: NoteHistoryEntry, epics: Epic[]) {
  const label = CHANGE_TYPES.find((c) => c.value === entry.change_type)?.label ?? entry.change_type;
  if (entry.change_type === "created") return "Заметка создана";
  if (entry.change_type === "deleted") return "Заметка удалена";
  const from = resolveHistoryValue(entry, entry.old_value, epics);
  const to = resolveHistoryValue(entry, entry.new_value, epics);
  return `${label}: ${from} → ${to}`;
}
