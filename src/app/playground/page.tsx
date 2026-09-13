"use client";

import { usePlaygroundNotes } from "@/hooks/usePlaygroundNotes";
import PlaygroundNoteForm from "@/components/playground/PlaygroundNoteForm";
import PlaygroundNoteCard from "@/components/playground/PlaygroundNoteCard";

export default function PlaygroundPage() {
  const { notes, loading, error, configured, createNote, deleteNote } =
    usePlaygroundNotes();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">
          Playground
        </h1>
        <p className="mt-1 text-[var(--color-body)]">
          Свободное пространство для заметок разработчиков — без структуры, без
          дисциплины, без статусов. Пиши что угодно.
        </p>
      </div>

      {!configured ? (
        <div
          className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          Supabase не настроен — playground недоступен.
        </div>
      ) : (
        <>
          <PlaygroundNoteForm onSubmit={createNote} />

          {error ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">
              Пока пусто. Будь первым.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {notes.map((note) => (
                <PlaygroundNoteCard
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
