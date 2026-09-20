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
