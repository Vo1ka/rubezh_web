"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { NewMeetingInput } from "@/lib/meetings";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function MeetingForm({
  onSubmit,
}: {
  onSubmit: (input: NewMeetingInput) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayIso());
  const [attendees, setAttendees] = useState("");
  const [summary, setSummary] = useState("");
  const [decisions, setDecisions] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({
      title,
      meeting_date: date,
      attendees,
      summary,
      decisions,
    });
    setTitle("");
    setDate(todayIso());
    setAttendees("");
    setSummary("");
    setDecisions("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
      >
        + Зафиксировать встречу
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
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Тема встречи"
          className={`${inputClass} sm:flex-1`}
          style={inputBorder}
          autoFocus
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${inputClass} sm:w-auto`}
          style={inputBorder}
        />
      </div>
      <input
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
        placeholder="Участники (через запятую)"
        className={inputClass}
        style={inputBorder}
      />
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="О чём говорили"
        rows={3}
        className={inputClass}
        style={inputBorder}
      />
      <textarea
        value={decisions}
        onChange={(e) => setDecisions(e.target.value)}
        placeholder="Итоговые решения / что делать дальше"
        rows={3}
        className={inputClass}
        style={inputBorder}
      />
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
