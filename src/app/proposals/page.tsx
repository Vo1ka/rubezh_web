"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProposals } from "@/hooks/useProposals";
import { useEpics } from "@/hooks/useEpics";
import { useDecisions } from "@/hooks/useDecisions";
import { PROPOSAL_STATUSES } from "@/lib/proposals";
import type { ProposalStatus } from "@/lib/proposals";
import ProposalForm from "@/components/proposals/ProposalForm";
import ProposalCard from "@/components/proposals/ProposalCard";

function ProposalsPageInner() {
  const searchParams = useSearchParams();
  const {
    proposals,
    loading,
    error,
    configured,
    validatingIds,
    createProposal,
    updateStatus,
    updateOwner,
    deleteProposal,
    promoteToDecision,
  } = useProposals();
  const { epics } = useEpics();
  const { records: decisions } = useDecisions();
  const [filter, setFilter] = useState<ProposalStatus | "all">("all");

  const prefillTitle = searchParams.get("title") ?? "";
  const prefillDescription = searchParams.get("description") ?? "";
  const prefillSourceNoteId = searchParams.get("sourceNoteId");

  const filtered =
    filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">Предложения</h1>
        <p className="mt-1 text-[var(--color-body)]">
          Сырые идеи от отделов — промежуточное состояние между заметкой и Epic/Решением.
          Перевод в «На валидации» запускает агента, который сверяет идею с планом; финальное
          решение всегда остаётся за человеком.
        </p>
      </div>

      {!configured ? (
        <div
          className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          Supabase не настроен — раздел недоступен.
        </div>
      ) : (
        <>
          <ProposalForm
            epics={epics}
            onSubmit={createProposal}
            initialOpen={Boolean(prefillTitle || prefillSourceNoteId)}
            initialTitle={prefillTitle}
            initialDescription={prefillDescription}
            initialSourceNoteId={prefillSourceNoteId}
          />

          <div className="flex flex-wrap gap-1">
            {(["all", ...PROPOSAL_STATUSES.map((s) => s.value)] as const).map((value) => {
              const label =
                value === "all" ? "Все" : PROPOSAL_STATUSES.find((s) => s.value === value)?.label;
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]"
                      : "border text-[var(--color-secondary-text)]"
                  }`}
                  style={isActive ? undefined : { borderColor: "var(--color-secondary-border)" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {error ? <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p> : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">Пока пусто.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  epics={epics}
                  decisions={decisions}
                  isValidating={validatingIds.includes(proposal.id)}
                  onChangeStatus={updateStatus}
                  onChangeOwner={updateOwner}
                  onPromote={promoteToDecision}
                  onDelete={deleteProposal}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <Suspense fallback={null}>
      <ProposalsPageInner />
    </Suspense>
  );
}
