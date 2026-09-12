"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { DecisionRecord, NewDecisionInput, RecordType } from "@/lib/decisions";
import { RECORD_TYPES, STATUS_OPTIONS } from "@/lib/decisions";
import type { Epic } from "@/lib/epics";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

export default function DecisionForm({
  epics,
  existingRecords,
  onSubmit,
}: {
  epics: Epic[];
  existingRecords: DecisionRecord[];
  onSubmit: (input: NewDecisionInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RecordType>("decision");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [epicId, setEpicId] = useState("");
  const [relatedIds, setRelatedIds] = useState<string[]>([]);

  const toggleRelated = (id: string) => {
    setRelatedIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({
      type,
      title,
      description,
      status,
      epic_id: epicId || null,
      related_ids: relatedIds,
    });
    setTitle("");
    setDescription("");
    setStatus("");
    setEpicId("");
    setRelatedIds([]);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
      >
        + Добавить запись
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as RecordType);
            setStatus("");
          }}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          {RECORD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          className={`${inputClass} sm:flex-1`}
          style={inputBorder}
          autoFocus
        />
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        rows={3}
        className={inputClass}
        style={inputBorder}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          <option value="">Без статуса</option>
          {STATUS_OPTIONS[type].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
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

      {existingRecords.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-body)]">Связано с:</p>
          <div className="flex flex-wrap gap-2">
            {existingRecords.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-1.5 rounded border px-2 py-1 text-xs text-[var(--color-secondary-text)]"
                style={inputBorder}
              >
                <input
                  type="checkbox"
                  checked={relatedIds.includes(r.id)}
                  onChange={() => toggleRelated(r.id)}
                />
                {r.title}
              </label>
            ))}
          </div>
        </div>
      ) : null}

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
