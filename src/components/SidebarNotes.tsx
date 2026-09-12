"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { SectionSlug } from "@/lib/sections";
import { useNotes } from "@/hooks/useNotes";

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-[var(--color-forest-950)]",
  medium: "bg-[var(--color-forest-600)]",
  low: "bg-[var(--color-sage-400)]",
};

export default function SidebarNotes({ section }: { section: SectionSlug }) {
  const { notes, configured, createNote } = useNotes(section);
  const [title, setTitle] = useState("");

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createNote(title);
    setTitle("");
  };

  return (
    <div className="mt-6">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]/70">
        Заметки
      </p>
      <ul className="mt-1 flex flex-col gap-0.5">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-center gap-2 rounded px-2 py-1 text-sm text-[var(--color-body)] hover:bg-[var(--color-surface-bg)]/40"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[note.priority]}`}
            />
            <span className="truncate">{note.title}</span>
          </li>
        ))}
        {!configured ? (
          <li className="px-2 py-1 text-xs text-[var(--color-body)]/70">
            Supabase не настроен
          </li>
        ) : null}
      </ul>
      {configured ? (
        <form onSubmit={handleAdd} className="mt-1 px-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="+ Добавить заметку"
            className="w-full rounded px-1 py-1 text-sm text-[var(--color-body)] outline-none placeholder:text-[var(--color-body)]/70 focus:bg-[var(--color-surface-bg)]/40"
          />
        </form>
      ) : null}
    </div>
  );
}
