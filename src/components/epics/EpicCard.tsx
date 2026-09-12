import type { Epic, EpicStatus } from "@/lib/epics";
import { EPIC_STATUSES, RISK_LEVELS } from "@/lib/epics";
import { SECTIONS } from "@/lib/sections";

const STATUS_STYLE: Record<EpicStatus, string> = {
  not_started: "bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)] border border-[var(--color-secondary-border)]",
  in_progress: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
  done: "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]",
  blocked_design: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  blocked_technical: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  blocked_product: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  needs_prototype: "bg-[var(--color-forest-600)] text-[var(--color-primary-text)]",
};

const PRIORITY_STYLE: Record<string, string> = {
  P0: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  P1: "bg-[var(--color-forest-600)] text-[var(--color-primary-text)]",
  P2: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
};

export default function EpicCard({
  epic,
  allEpics,
  onCycleStatus,
  onDelete,
}: {
  epic: Epic;
  allEpics: Epic[];
  onCycleStatus: (id: string, current: EpicStatus) => void;
  onDelete: (id: string) => void;
}) {
  const ownerLabel = SECTIONS.find((s) => s.slug === epic.owner_section)?.label;
  const statusLabel = EPIC_STATUSES.find((s) => s.value === epic.status)?.label;
  const riskLabel = RISK_LEVELS.find((r) => r.value === epic.risk_level)?.label;
  const dependencyTitles = epic.depends_on
    .map((id) => allEpics.find((e) => e.id === id)?.title)
    .filter(Boolean);

  const nextStatus = () => {
    const idx = EPIC_STATUSES.findIndex((s) => s.value === epic.status);
    const next = EPIC_STATUSES[(idx + 1) % EPIC_STATUSES.length];
    onCycleStatus(epic.id, next.value);
  };

  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[epic.mvp_priority]}`}
          >
            {epic.mvp_priority}
          </span>
          <h3 className="font-semibold text-[var(--color-title)]">{epic.title}</h3>
        </div>
        <button
          onClick={() => onDelete(epic.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить Epic"
        >
          ×
        </button>
      </div>

      {epic.description ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {epic.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={nextStatus}
          className={`rounded px-2 py-0.5 font-medium ${STATUS_STYLE[epic.status]}`}
          title="Нажмите, чтобы сменить статус"
        >
          {statusLabel}
        </button>
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
