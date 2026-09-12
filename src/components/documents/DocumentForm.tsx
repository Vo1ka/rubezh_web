"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { NewDocumentInput } from "@/lib/documents";
import { DOC_KEY_PRESETS } from "@/lib/documents";

const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
const inputBorder = { borderColor: "var(--color-secondary-border)" };

export default function DocumentForm({
  onSubmit,
}: {
  onSubmit: (input: NewDocumentInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [docKey, setDocKey] = useState("");
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [url, setUrl] = useState("");
  const [changelog, setChangelog] = useState("");
  const [isBaseline, setIsBaseline] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !docKey.trim() || !url.trim() || !version.trim()) return;
    await onSubmit({ doc_key: docKey, title, version, url, changelog, is_baseline: isBaseline });
    setDocKey("");
    setTitle("");
    setVersion("");
    setUrl("");
    setChangelog("");
    setIsBaseline(true);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
      >
        + Добавить версию документа
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
          value={docKey}
          onChange={(e) => setDocKey(e.target.value)}
          placeholder="Ключ документа (product-definition)"
          list="doc-key-presets"
          className={`${inputClass} sm:flex-1`}
          style={inputBorder}
          autoFocus
        />
        <datalist id="doc-key-presets">
          {DOC_KEY_PRESETS.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
        <input
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="Версия (v4)"
          className={`${inputClass} sm:w-32`}
          style={inputBorder}
        />
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название документа (Product Definition)"
        className={inputClass}
        style={inputBorder}
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Ссылка на документ"
        className={inputClass}
        style={inputBorder}
      />
      <textarea
        value={changelog}
        onChange={(e) => setChangelog(e.target.value)}
        placeholder="Что изменилось с прошлой версии"
        rows={2}
        className={inputClass}
        style={inputBorder}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--color-secondary-text)]">
        <input
          type="checkbox"
          checked={isBaseline}
          onChange={(e) => setIsBaseline(e.target.checked)}
        />
        Это текущая утверждённая версия (baseline)
      </label>

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
