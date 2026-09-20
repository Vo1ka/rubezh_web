import type { SectionSlug } from "./sections";

export const STATUSES = [
  { value: "backlog", label: "Бэклог" },
  { value: "in_progress", label: "В работе" },
  { value: "review", label: "Ревью" },
  { value: "done", label: "Готово" },
] as const;

export type NoteStatus = (typeof STATUSES)[number]["value"];

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
