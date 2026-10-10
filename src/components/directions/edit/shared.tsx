"use client";

import { useEffect, useState, type ReactNode } from "react";
import { diffLines } from "diff";
import type { ActionResult } from "@/app/directions/[id]/actions";

export const inputClass =
  "w-full rounded-md border bg-[var(--color-secondary-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]";
export const inputBorder = { borderColor: "var(--color-secondary-border)" };
export const primaryButton =
  "rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90 disabled:opacity-50";
export const secondaryButton = "rounded-md border px-4 py-2 text-sm font-medium text-[var(--color-secondary-text)] disabled:opacity-50";

const AUTHOR_KEY = "rubezh.journalAuthor";

/** The name that goes into journal headings — remembered per browser. */
export function useAuthorName(fallback: string) {
  const [author, setAuthor] = useState(fallback);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTHOR_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser-only value
      if (saved) setAuthor(saved);
    } catch {}
  }, []);
  const update = (next: string) => {
    setAuthor(next);
    try {
      localStorage.setItem(AUTHOR_KEY, next);
    } catch {}
  };
  return [author, update] as const;
}

export function AuthorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--color-body)]">
      Автор (как в журнале)
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Имя" className={inputClass} style={inputBorder} />
    </label>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--color-body)]">
      <span>
        <span className="font-semibold text-[var(--color-title)]">{label}</span>
        {hint ? <span className="opacity-70"> — {hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

/** Result line under a form: link to the commit, an error, or nothing. */
export function ResultNote({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p className="text-sm text-[var(--color-body)]">
        Сохранено —{" "}
        <a href={result.commitUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          коммит в репозитории
        </a>
        .
      </p>
    );
  }
  if ("error" in result) return <p className="text-sm text-[var(--color-title)]">⚠ {result.error}</p>;
  return null;
}

/** Line diff between what is in the repo now and what the user was about to save. */
export function ConflictDiff({ current, mine }: { current: string; mine: string }) {
  const parts = diffLines(current, mine);
  return (
    <pre className="max-h-96 overflow-auto rounded border p-2 text-xs" style={{ borderColor: "var(--color-surface-border)" }}>
      {parts.map((p, i) => (
        <span
          key={i}
          style={
            p.added
              ? { background: "rgba(46, 160, 67, 0.2)" }
              : p.removed
                ? { background: "rgba(248, 81, 73, 0.2)", textDecoration: "line-through" }
                : { opacity: 0.6 }
          }
        >
          {p.value
            .replace(/\n$/, "")
            .split("\n")
            .map((line) => `${p.added ? "+ " : p.removed ? "- " : "  "}${line}`)
            .join("\n")}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
