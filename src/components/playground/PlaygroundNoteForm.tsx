"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { NewPlaygroundNoteInput } from "@/lib/playground";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

export default function PlaygroundNoteForm({
  onSubmit,
}: {
  onSubmit: (input: NewPlaygroundNoteInput) => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit({ content, author });
    setContent("");
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Пиши что угодно: заметка, идея, ссылка, кусок кода, вопрос коллегам…"
        rows={4}
        className={inputClass}
        style={inputBorder}
        autoFocus
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Имя (необязательно)"
          className={`${inputClass} sm:max-w-xs`}
          style={inputBorder}
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Опубликовать
        </button>
      </div>
    </form>
  );
}
