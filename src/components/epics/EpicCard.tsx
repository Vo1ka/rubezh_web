"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import type { Epic, EpicStatus } from "@/lib/epics";
import { RISK_LEVELS } from "@/lib/epics";
import { ownerLabel } from "@/lib/owners";
import EpicStatusControl from "./EpicStatusControl";

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

const PRIORITY_STYLE: Record<string, CSSProperties> = {
  P0: solidBadge("var(--badge-orange-red)"),
  P1: solidBadge("var(--badge-dark-orange)"),
  P2: outlineBadge("var(--badge-gold)"),
};

export default function EpicCard({
  epic,
  allEpics,
  onChangeStatus,
  onDelete,
}: {
  epic: Epic;
  allEpics: Epic[];
  onChangeStatus: (id: string, status: EpicStatus) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const owner = ownerLabel(epic.owner_section);
  const riskLabel = RISK_LEVELS.find((r) => r.value === epic.risk_level)?.label;
  const dependencyTitles = epic.depends_on
    .map((id) => allEpics.find((e) => e.id === id)?.title)
    .filter(Boolean);

  return (
    <div
      className="group cursor-pointer rounded-lg border bg-[var(--color-secondary-bg)] p-4 transition-colors hover:border-[var(--color-title)]"
      style={{ borderColor: "var(--color-surface-border)" }}
      onClick={() => router.push(`/epics/${epic.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2.5 py-1 text-xs font-bold"
            style={PRIORITY_STYLE[epic.mvp_priority]}
          >
            {epic.mvp_priority}
          </span>
          <h3 className="font-semibold text-[var(--color-title)] hover:underline">
            {epic.title}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(epic.id);
          }}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить Epic"
        >
          ×
        </button>
      </div>

      {epic.description ? (
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {epic.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <EpicStatusControl
          status={epic.status}
          onChange={(status) => onChangeStatus(epic.id, status)}
        />
        {owner ? (
          <span className="text-[var(--color-body)]">Владелец: {owner}</span>
        ) : null}
        {riskLabel ? (
          <span className="text-[var(--color-body)]">Риск: {riskLabel}</span>
        ) : null}
      </div>

      {dependencyTitles.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--color-body)]">
          Зависит от: {dependencyTitles.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
