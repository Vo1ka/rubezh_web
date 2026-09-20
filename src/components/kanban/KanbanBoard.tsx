"use client";

import { useMemo, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { STATUSES, PRIORITIES, SORT_MODES, sortNotes } from "@/lib/notes";
import type { NoteStatus, NotePriority, SortMode } from "@/lib/notes";
import type { SectionSlug } from "@/lib/sections";
import { useNotes } from "@/hooks/useNotes";
import { useEpics } from "@/hooks/useEpics";
import KanbanColumn from "./KanbanColumn";
import BulkActionBar from "./BulkActionBar";

const selectClass =
  "rounded-md border bg-[var(--color-secondary-bg)] px-2 py-1.5 text-sm text-[var(--color-secondary-text)]";
const selectBorder = { borderColor: "var(--color-secondary-border)" };

export default function KanbanBoard({ section }: { section: SectionSlug }) {
  const {
    notes,
    loading,
    error,
    configured,
    createNote,
    moveNote,
    cyclePriority,
    setNoteEpic,
    deleteNote,
    bulkSetStatus,
    bulkSetPriority,
    bulkSetEpic,
    bulkDelete,
  } = useNotes(section);
  const { epics } = useEpics();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const [epicFilter, setEpicFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<NotePriority | "">("");
  const [sortMode, setSortMode] = useState<SortMode>("manual");

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const visibleNotes = useMemo(() => {
    let result = notes;
    if (epicFilter === "__none__") result = result.filter((n) => !n.epic_id);
    else if (epicFilter) result = result.filter((n) => n.epic_id === epicFilter);
    if (priorityFilter) result = result.filter((n) => n.priority === priorityFilter);
    return sortNotes(result, sortMode);
  }, [notes, epicFilter, priorityFilter, sortMode]);

  if (!configured) {
    return (
      <div
        className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        Supabase не настроен — заметки недоступны. Добавьте
        NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local.
      </div>
    );
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (status: NoteStatus) => {
    if (draggedId) {
      moveNote(draggedId, status);
      setDraggedId(null);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createNote(newTitle);
    setNewTitle("");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const toggleSelectMode = () => {
    setSelectMode((v) => !v);
    clearSelection();
  };

  const selectedArray = Array.from(selectedIds);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Новая заметка в бэклог…"
          className="flex-1 rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]"
          style={{ borderColor: "var(--color-secondary-border)" }}
        />
        <button
          type="submit"
          className="rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
        >
          Добавить
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={epicFilter}
          onChange={(e) => setEpicFilter(e.target.value)}
          className={selectClass}
          style={selectBorder}
        >
          <option value="">Все Epic</option>
          <option value="__none__">Без Epic</option>
          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.title}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as NotePriority | "")}
          className={selectClass}
          style={selectBorder}
        >
          <option value="">Любой приоритет</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className={selectClass}
          style={selectBorder}
        >
          {SORT_MODES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={toggleSelectMode}
          className={`ml-auto rounded-md border px-3 py-1.5 text-sm font-medium ${
            selectMode
              ? "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]"
              : "text-[var(--color-secondary-text)]"
          }`}
          style={selectBorder}
        >
          {selectMode ? "Готово" : "Выбрать несколько"}
        </button>
      </div>

      {selectMode && selectedIds.size > 0 ? (
        <BulkActionBar
          count={selectedIds.size}
          epics={epics}
          onSetStatus={(status) => bulkSetStatus(selectedArray, status)}
          onSetPriority={(priority) => bulkSetPriority(selectedArray, priority)}
          onSetEpic={(epicId) => bulkSetEpic(selectedArray, epicId)}
          onDelete={() => {
            bulkDelete(selectedArray);
            clearSelection();
          }}
          onClear={clearSelection}
        />
      ) : null}

      {error ? (
        <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.value}
              status={status.value}
              label={status.label}
              notes={visibleNotes.filter((n) => n.status === status.value)}
              epics={epics}
              selectMode={selectMode}
              selectedIds={selectedIds}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onCyclePriority={cyclePriority}
              onChangeEpic={setNoteEpic}
              onToggleSelect={toggleSelect}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
