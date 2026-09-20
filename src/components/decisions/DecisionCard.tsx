import type { CSSProperties } from "react";
import type { DecisionRecord } from "@/lib/decisions";
import { RECORD_TYPES, STATUS_OPTIONS } from "@/lib/decisions";
import type { Epic } from "@/lib/epics";
import { ownerLabel } from "@/lib/owners";

const solidBadge = (background: string): CSSProperties => ({
  background,
  color: "var(--badge-text)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
});

const outlineBadge = (border: string): CSSProperties => ({
  background: "transparent",
  color: "var(--badge-text)",
  border: `1.5px solid ${border}`,
});

const TYPE_STYLE: Record<string, CSSProperties> = {
  decision: solidBadge("var(--badge-gold)"),
  risk: solidBadge("var(--badge-tomato)"),
  open_question: outlineBadge("var(--badge-dark-orange)"),
};

export default function DecisionCard({
  record,
  epics,
  allRecords,
  onDelete,
}: {
  record: DecisionRecord;
  epics: Epic[];
  allRecords: DecisionRecord[];
  onDelete: (id: string) => void;
}) {
  const typeLabel = RECORD_TYPES.find((t) => t.value === record.type)?.label;
  const statusLabel = STATUS_OPTIONS[record.type]?.find(
    (s) => s.value === record.status
  )?.label;
  const epicTitle = epics.find((e) => e.id === record.epic_id)?.title;
  const owner = ownerLabel(record.owner);
  const relatedTitles = record.related_ids
    .map((id) => allRecords.find((r) => r.id === id)?.title)
    .filter(Boolean);

  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md px-2.5 py-1 text-xs font-bold" style={TYPE_STYLE[record.type]}>
            {typeLabel}
          </span>
          {statusLabel ? (
            <span className="rounded border px-2 py-0.5 text-xs text-[var(--color-body)]" style={{ borderColor: "var(--color-secondary-border)" }}>
              {statusLabel}
            </span>
          ) : null}
          <h3 className="font-semibold text-[var(--color-title)]">{record.title}</h3>
        </div>
        <button
          onClick={() => onDelete(record.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить запись"
        >
          ×
        </button>
      </div>

      {record.description ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {record.description}
        </p>
      ) : null}

      {(epicTitle || owner || relatedTitles.length > 0) && (
        <p className="mt-2 text-xs text-[var(--color-body)]">
          {epicTitle ? `Epic: ${epicTitle}` : ""}
          {epicTitle && owner ? " · " : ""}
          {owner ? `Владелец: ${owner}` : ""}
          {(epicTitle || owner) && relatedTitles.length > 0 ? " · " : ""}
          {relatedTitles.length > 0 ? `Связано: ${relatedTitles.join(", ")}` : ""}
        </p>
      )}
    </div>
  );
}
