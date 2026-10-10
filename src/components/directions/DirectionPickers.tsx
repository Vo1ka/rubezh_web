"use client";

import Link from "next/link";
import { useState } from "react";
import { useDirections, directionName } from "@/hooks/useDirections";

// RW-13: shared UI for direction tags. Ids come from directions.yaml; an id
// that's no longer in the registry is shown with a warning rather than
// dropped, so the link isn't lost silently.

const chipBase = "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium";
const chipStyle = { background: "var(--color-surface-bg)", color: "var(--color-title)" };
const missingStyle = {
  background: "transparent",
  color: "var(--badge-text)",
  border: "1.5px solid var(--badge-dark-orange)",
};
const selectClass =
  "rounded-md border bg-[var(--color-secondary-bg)] px-2 py-1.5 text-sm text-[var(--color-secondary-text)]";
const selectBorder = { borderColor: "var(--color-secondary-border)" };

function DirectionChip({ id }: { id: string }) {
  const { directions, loading, error } = useDirections();
  const name = directionName(directions, id);
  if (!name && !loading && !error) {
    return (
      <span className={chipBase} style={missingStyle} title="Этого id нет в directions.yaml">
        ⚠ {id} — направление не найдено
      </span>
    );
  }
  return (
    <Link href={`/directions/${id}`} onClick={(e) => e.stopPropagation()} className={`${chipBase} hover:underline`} style={chipStyle}>
      {name ?? id}
    </Link>
  );
}

/**
 * Tags for Epics, Decisions, Proposals (one or more). With `onChange` it gets
 * an inline editor; without, it's read-only.
 */
export function DirectionTags({
  value,
  onChange,
  emptyLabel = "без направления",
}: {
  value: string[];
  onChange?: (next: string[]) => void;
  emptyLabel?: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <span className="inline-flex flex-wrap items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {value.length === 0 && !editing ? (
        <span className="text-xs text-[var(--color-body)]/70">{emptyLabel}</span>
      ) : null}
      {!editing && value.map((id) => <DirectionChip key={id} id={id} />)}
      {onChange && !editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-[var(--color-body)] opacity-60 hover:opacity-100"
          title="Изменить направления"
          aria-label="Изменить направления"
        >
          ✎
        </button>
      ) : null}
      {onChange && editing ? (
        <DirectionChecklist
          value={value}
          onChange={onChange}
          onDone={() => setEditing(false)}
        />
      ) : null}
    </span>
  );
}

function DirectionChecklist({
  value,
  onChange,
  onDone,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onDone?: () => void;
}) {
  const { directions, loading, error } = useDirections();
  if (loading) return <span className="text-xs text-[var(--color-body)]">Загрузка направлений…</span>;
  if (error) return <span className="text-xs text-[var(--color-title)]">Реестр недоступен: {error}</span>;

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  // Keep ids that vanished from the registry visible so they can be unticked.
  const missing = value.filter((id) => !directions.some((d) => d.id === id));

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {directions.map((d) => (
        <label
          key={d.id}
          className="flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs text-[var(--color-secondary-text)]"
          style={selectBorder}
        >
          <input type="checkbox" checked={value.includes(d.id)} onChange={() => toggle(d.id)} />
          {d.name}
        </label>
      ))}
      {missing.map((id) => (
        <label key={id} className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs" style={missingStyle}>
          <input type="checkbox" checked onChange={() => toggle(id)} />⚠ {id}
        </label>
      ))}
      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          className="rounded-md bg-[var(--color-primary-bg)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary-text)]"
        >
          Готово
        </button>
      ) : null}
    </span>
  );
}

/** Multi-select for create forms. */
export function DirectionField({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-[var(--color-body)]">Направления:</p>
      <DirectionChecklist value={value} onChange={onChange} />
    </div>
  );
}

/** Single direction — Kanban cards belong to exactly one. */
export function DirectionSelect({
  value,
  onChange,
  disabled,
  className = "",
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { directions, loading } = useDirections();
  const missing = value && !loading && !directions.some((d) => d.id === value);
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      onClick={(e) => e.stopPropagation()}
      disabled={disabled}
      className={`min-w-0 truncate rounded border bg-[var(--color-secondary-bg)] px-1.5 py-0.5 text-xs text-[var(--color-secondary-text)] ${className}`}
      style={missing ? missingStyle : selectBorder}
      title={missing ? `Направление «${value}» не найдено в реестре` : directionName(directions, value ?? "") ?? "Направление"}
    >
      <option value="">Без направления</option>
      {directions.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
      {value && missing ? <option value={value}>⚠ {value} — не найдено</option> : null}
    </select>
  );
}

export const NO_DIRECTION = "__none__";

/** List filter: "" = all, NO_DIRECTION = untagged, otherwise a direction id. */
export function DirectionFilter({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const { directions } = useDirections();
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass} style={selectBorder}>
      <option value="">Все направления</option>
      <option value={NO_DIRECTION}>Без направления</option>
      {directions.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  );
}

/** Applies a DirectionFilter value to records tagged with one or many directions. */
export function matchesDirection(filter: string, tags: string[] | string | null | undefined) {
  if (!filter) return true;
  const list = Array.isArray(tags) ? tags : tags ? [tags] : [];
  return filter === NO_DIRECTION ? list.length === 0 : list.includes(filter);
}
