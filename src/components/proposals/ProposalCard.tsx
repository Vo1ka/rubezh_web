"use client";

import type { CSSProperties } from "react";
import type { ProposalRecord, ProposalStatus } from "@/lib/proposals";
import { VERDICTS } from "@/lib/proposals";
import type { Epic } from "@/lib/epics";
import type { DecisionRecord } from "@/lib/decisions";
import { OWNERS, ownerLabel } from "@/lib/owners";
import ProposalStatusControl from "./ProposalStatusControl";

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

// Same accent vocabulary as ProposalStatusControl's status badges — aligned
// keeps the "good outcome" gold, needs_prototype keeps the "waiting" outline.
const VERDICT_STYLE: Record<string, CSSProperties> = {
  aligned: solidBadge("var(--badge-gold)"),
  product_issue: solidBadge("var(--badge-tomato)"),
  design_issue: solidBadge("var(--badge-dark-orange)"),
  technical_decision: solidBadge("var(--badge-orange)"),
  needs_prototype: outlineBadge("var(--badge-dark-orange)"),
  out_of_scope: solidBadge("var(--badge-orange-red)"),
};

export default function ProposalCard({
  proposal,
  epics,
  decisions,
  isValidating,
  onChangeStatus,
  onChangeOwner,
  onPromote,
  onDelete,
}: {
  proposal: ProposalRecord;
  epics: Epic[];
  decisions: DecisionRecord[];
  isValidating: boolean;
  onChangeStatus: (id: string, status: ProposalStatus) => void;
  onChangeOwner: (id: string, owner: string | null) => void;
  onPromote: (proposal: ProposalRecord) => void;
  onDelete: (id: string) => void;
}) {
  const epicTitle = epics.find((e) => e.id === proposal.epic_id)?.title;
  const decision = decisions.find((d) => d.id === proposal.decision_id);
  const verdictLabel = VERDICTS.find((v) => v.value === proposal.verdict)?.label;

  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ProposalStatusControl
            status={proposal.status}
            onChange={(status) => onChangeStatus(proposal.id, status)}
          />
          <h3 className="font-semibold text-[var(--color-title)]">{proposal.title}</h3>
        </div>
        <button
          onClick={() => onDelete(proposal.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить предложение"
        >
          ×
        </button>
      </div>

      {proposal.description ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {proposal.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-body)]">
        {proposal.proposed_by ? <span>От: {proposal.proposed_by}</span> : null}
        {epicTitle ? <span>Epic: {epicTitle}</span> : null}
        <select
          value={proposal.owner ?? ""}
          onChange={(e) => onChangeOwner(proposal.id, e.target.value || null)}
          className="rounded border bg-[var(--color-secondary-bg)] px-1.5 py-0.5 text-xs text-[var(--color-secondary-text)]"
          style={{ borderColor: "var(--color-secondary-border)" }}
        >
          <option value="">Без владельца</option>
          {OWNERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {isValidating ? (
        <p className="mt-3 text-xs text-[var(--color-body)]">Агент проверяет предложение…</p>
      ) : null}

      {proposal.verdict_error ? (
        <p className="mt-3 rounded border border-[var(--color-secondary-border)] bg-[var(--color-secondary-bg)] p-2 text-xs text-[var(--color-title)]">
          Ошибка агента: {proposal.verdict_error}
        </p>
      ) : null}

      {proposal.verdict ? (
        <div
          className="mt-3 rounded-lg border p-3"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-bold"
              style={VERDICT_STYLE[proposal.verdict]}
            >
              {verdictLabel}
            </span>
            {proposal.verdict_owner ? (
              <span className="text-xs text-[var(--color-body)]">
                Рекомендованный ответственный: {ownerLabel(proposal.verdict_owner) ?? proposal.verdict_owner}
              </span>
            ) : null}
          </div>
          {proposal.verdict_rationale ? (
            <p className="mt-2 text-sm text-[var(--color-secondary-text)]">{proposal.verdict_rationale}</p>
          ) : null}
          {proposal.verdict_references ? (
            <p className="mt-1 text-xs text-[var(--color-body)]">Ссылки: {proposal.verdict_references}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {decision ? (
          <span className="text-xs text-[var(--color-body)]">
            Оформлено в Решения: {decision.title}
          </span>
        ) : (
          <button
            onClick={() => onPromote(proposal)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium text-[var(--color-secondary-text)] transition-colors hover:border-[var(--color-title)]"
            style={{ borderColor: "var(--color-secondary-border)" }}
          >
            Оформить как Решение
          </button>
        )}
      </div>
    </div>
  );
}
