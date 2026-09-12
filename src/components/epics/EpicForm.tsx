"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Epic, NewEpicInput } from "@/lib/epics";
import { MVP_PRIORITIES, RISK_LEVELS } from "@/lib/epics";
import { SECTIONS } from "@/lib/sections";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

export default function EpicForm({
  existingEpics,
  onSubmit,
}: {
  existingEpics: Epic[];
  onSubmit: (input: NewEpicInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState<NewEpicInput["mvp_priority"]>("P1");
  const [risk, setRisk] = useState("");
  const [dependsOn, setDependsOn] = useState<string[]>([]);

  const toggleDependency = (id: string) => {
    setDependsOn((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({
      title,
      description,
      owner_section: (owner || null) as NewEpicInput["owner_section"],
      mvp_priority: priority,
      risk_level: (risk || null) as NewEpicInput["risk_level"],
      depends_on: dependsOn,
    });
    setTitle("");
    setDescription("");
    setOwner("");
    setPriority("P1");
    setRisk("");
    setDependsOn([]);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
      >
        + Добавить Epic
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
        placeholder="Название Epic"
        className={inputClass}
        style={inputBorder}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        rows={2}
        className={inputClass}
        style={inputBorder}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          <option value="">Без владельца</option>
          {SECTIONS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as NewEpicInput["mvp_priority"])}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          {MVP_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        >
          <option value="">Риск не указан</option>
          {RISK_LEVELS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {existingEpics.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-body)]">
            Зависит от:
          </p>
          <div className="flex flex-wrap gap-2">
            {existingEpics.map((e) => (
              <label
                key={e.id}
                className="flex items-center gap-1.5 rounded border px-2 py-1 text-xs text-[var(--color-secondary-text)]"
                style={inputBorder}
              >
                <input
                  type="checkbox"
                  checked={dependsOn.includes(e.id)}
                  onChange={() => toggleDependency(e.id)}
                />
                {e.title}
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
