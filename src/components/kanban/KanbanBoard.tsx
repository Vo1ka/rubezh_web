"use client";

import { useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { STATUSES } from "@/lib/notes";
import type { NoteStatus } from "@/lib/notes";
import type { SectionSlug } from "@/lib/sections";
import { useNotes } from "@/hooks/useNotes";
import { useEpics } from "@/hooks/useEpics";
import KanbanColumn from "./KanbanColumn";

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
  } = useNotes(section);
  const { epics } = useEpics();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

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
              notes={notes.filter((n) => n.status === status.value)}
              epics={epics}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onCyclePriority={cyclePriority}
              onChangeEpic={setNoteEpic}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
