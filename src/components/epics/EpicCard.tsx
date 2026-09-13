"use client";

import { useRouter } from "next/navigation";
import type { Epic, EpicStatus } from "@/lib/epics";
import { RISK_LEVELS } from "@/lib/epics";
import { SECTIONS } from "@/lib/sections";
import EpicStatusControl from "./EpicStatusControl";

const PRIORITY_STYLE: Record<string, string> = {
  P0: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  P1: "bg-[var(--color-forest-600)] text-[var(--color-primary-text)]",
  P2: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
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
  const ownerLabel = SECTIONS.find((s) => s.slug === epic.owner_section)?.label;
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
            className={`rounded px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[epic.mvp_priority]}`}
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
        {ownerLabel ? (
          <span className="text-[var(--color-body)]">Владелец: {ownerLabel}</span>
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
