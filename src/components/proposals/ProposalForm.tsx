"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { NewProposalInput } from "@/lib/proposals";
import type { Epic } from "@/lib/epics";
import { OWNERS } from "@/lib/owners";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

export default function ProposalForm({
  epics,
  onSubmit,
  initialOpen = false,
  initialTitle = "",
  initialDescription = "",
  initialSourceNoteId,
}: {
  epics: Epic[];
  onSubmit: (input: NewProposalInput) => Promise<void>;
  initialOpen?: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialSourceNoteId?: string | null;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [proposedBy, setProposedBy] = useState("");
  const [owner, setOwner] = useState("");
  const [epicId, setEpicId] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({
      title,
      description,
      proposed_by: proposedBy,
      owner: (owner || null) as NewProposalInput["owner"],
      epic_id: epicId || null,
      source_note_id: initialSourceNoteId ?? null,
    });
    setTitle("");
    setDescription("");
    setProposedBy("");
    setOwner("");
    setEpicId("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
      >
        + Новое предложение
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название предложения"
        className={inputClass}
        style={inputBorder}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание идеи"
        rows={3}
        className={inputClass}
        style={inputBorder}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={proposedBy}
          onChange={(e) => setProposedBy(e.target.value)}
          placeholder="Кто предложил (дисциплина или имя)"
          className={`${inputClass} sm:flex-1`}
          style={inputBorder}
        />
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          <option value="">Без владельца</option>
          {OWNERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={epicId}
          onChange={(e) => setEpicId(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          <option value="">Без привязки к Epic</option>
          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border px-4 py-2 text-sm font-medium text-[var(--color-secondary-text)]"
          style={inputBorder}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
