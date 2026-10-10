"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addJournalEntry, type ActionResult } from "@/app/directions/[id]/actions";
import type { JournalType } from "@/lib/directions/journal";
import { AuthorInput, Field, ResultNote, inputBorder, inputClass, primaryButton, secondaryButton, useAuthorName } from "./shared";

// Templates from the team guide ("JOURNAL.md → Формат записи").
const TEMPLATES: Record<string, string> = {
  работа: "Сделано: \nПочему: \nКоммиты: \nДальше: ",
  решение: "Договорились: \nСвязано: ",
  проблема: "Что сломано: \nКак проявляется: \nЧто уже проверили: ",
};

// RW-16: a new journal entry goes on top; existing entries are never edited.
export default function JournalForm({ id, owner, onClose }: { id: string; owner: string | null; onClose: () => void }) {
  const router = useRouter();
  const [type, setType] = useState<JournalType>("работа");
  const [body, setBody] = useState(TEMPLATES["работа"]);
  const [author, setAuthor] = useAuthorName(owner ?? "");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const changeType = (next: JournalType) => {
    // Swap the template only while the text is still an untouched template.
    if (Object.values(TEMPLATES).includes(body)) setBody(TEMPLATES[next]);
    setType(next);
  };

  const submit = () =>
    startTransition(async () => {
      const r = await addJournalEntry(id, { type, body, author });
      setResult(r);
      if (r.ok) {
        router.refresh();
        onClose();
      }
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Тип">
          <select value={type} onChange={(e) => changeType(e.target.value as JournalType)} className={inputClass} style={inputBorder}>
            <option value="работа">работа</option>
            <option value="решение">решение</option>
            <option value="проблема">проблема</option>
          </select>
        </Field>
        <AuthorInput value={author} onChange={setAuthor} />
      </div>
      <Field label="Запись" hint="2–5 строк">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className={inputClass} style={inputBorder} />
      </Field>
      <p className="text-xs text-[var(--color-body)]/70">Передача оформляется кнопкой «Передать / поставить на паузу».</p>
      <ResultNote result={result} />
      <div className="flex gap-2">
        <button type="button" onClick={submit} disabled={pending || !author.trim() || !body.trim()} className={primaryButton}>
          {pending ? "Сохраняю…" : "Добавить запись"}
        </button>
        <button type="button" onClick={onClose} className={secondaryButton} style={inputBorder}>
          Отмена
        </button>
      </div>
    </div>
  );
}
