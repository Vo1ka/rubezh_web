"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEpics } from "@/hooks/useEpics";
import { useDecisions } from "@/hooks/useDecisions";
import { MVP_PRIORITIES, RISK_LEVELS } from "@/lib/epics";
import { SECTIONS } from "@/lib/sections";
import EpicStatusControl from "@/components/epics/EpicStatusControl";
import DecisionCard from "@/components/decisions/DecisionCard";

const PRIORITY_STYLE: Record<string, string> = {
  P0: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  P1: "bg-[var(--color-forest-600)] text-[var(--color-primary-text)]",
  P2: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
};

export default function EpicDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { epics, loading, error, configured, updateStatus, deleteEpic } = useEpics();
  const { records: decisions, deleteRecord } = useDecisions();

  if (!configured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Supabase не настроен — Epic Map недоступна.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      </div>
    );
  }

  const epic = epics.find((e) => e.id === params.id);

  if (error || !epic) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6">
        <Link href="/epics" className="text-sm text-[var(--color-body)] hover:underline">
          ← Назад к Epic Map
        </Link>
        <p className="text-sm text-[var(--color-title)]">
          {error ? `Ошибка: ${error}` : "Epic не найден — возможно, он был удалён."}
        </p>
      </div>
    );
  }

  const ownerLabel = SECTIONS.find((s) => s.slug === epic.owner_section)?.label;
  const priorityLabel = MVP_PRIORITIES.find((p) => p.value === epic.mvp_priority)?.label;
  const riskLabel = RISK_LEVELS.find((r) => r.value === epic.risk_level)?.label;

  const dependencies = epic.depends_on
    .map((id) => epics.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const dependents = epics.filter((e) => e.depends_on.includes(epic.id));

  const linkedDecisions = decisions.filter((d) => d.epic_id === epic.id);

  const handleDelete = () => {
    deleteEpic(epic.id);
    router.push("/epics");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link href="/epics" className="text-sm text-[var(--color-body)] hover:underline">
        ← Назад к Epic Map
      </Link>

      <div
        className="rounded-lg border bg-[var(--color-secondary-bg)] p-6"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[epic.mvp_priority]}`}
              title={priorityLabel}
            >
              {epic.mvp_priority}
            </span>
            <h1 className="text-xl font-bold text-[var(--color-title)]">{epic.title}</h1>
          </div>
          <button
            onClick={handleDelete}
            className="text-[var(--color-body)] opacity-60 hover:opacity-100"
            aria-label="Удалить Epic"
          >
            ×
          </button>
        </div>

        {epic.description ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-secondary-text)]">
            {epic.description}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[var(--color-body)]">Описание не заполнено.</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <EpicStatusControl
            status={epic.status}
            onChange={(status) => updateStatus(epic.id, status)}
            size="lg"
          />
          {ownerLabel ? (
            <span className="text-[var(--color-body)]">Владелец: {ownerLabel}</span>
          ) : null}
          {riskLabel ? (
            <span className="text-[var(--color-body)]">Риск: {riskLabel}</span>
          ) : null}
        </div>

        {dependencies.length > 0 ? (
          <div className="mt-4 text-sm">
            <span className="text-[var(--color-body)]">Зависит от: </span>
            {dependencies.map((d, i) => (
              <span key={d.id}>
                <Link href={`/epics/${d.id}`} className="text-[var(--color-title)] hover:underline">
                  {d.title}
                </Link>
                {i < dependencies.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        ) : null}

        {dependents.length > 0 ? (
          <div className="mt-2 text-sm">
            <span className="text-[var(--color-body)]">От него зависят: </span>
            {dependents.map((d, i) => (
              <span key={d.id}>
                <Link href={`/epics/${d.id}`} className="text-[var(--color-title)] hover:underline">
                  {d.title}
                </Link>
                {i < dependents.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {linkedDecisions.length > 0 ? (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
            Решения / риски / открытые вопросы по этому Epic
          </h2>
          <div className="flex flex-col gap-3">
            {linkedDecisions.map((record) => (
              <DecisionCard
                key={record.id}
                record={record}
                epics={epics}
                allRecords={decisions}
                onDelete={deleteRecord}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
