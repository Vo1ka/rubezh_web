"use client";

import { useState } from "react";
import { useDecisions } from "@/hooks/useDecisions";
import { useEpics } from "@/hooks/useEpics";
import { RECORD_TYPES } from "@/lib/decisions";
import type { RecordType } from "@/lib/decisions";
import DecisionCard from "@/components/decisions/DecisionCard";
import DecisionForm from "@/components/decisions/DecisionForm";

export default function DecisionsPage() {
  const { records, loading, error, configured, createRecord, deleteRecord } =
    useDecisions();
  const { epics } = useEpics();
  const [filter, setFilter] = useState<RecordType | "all">("all");

  const filtered =
    filter === "all" ? records : records.filter((r) => r.type === filter);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">
          Решения, риски и открытые вопросы
        </h1>
        <p className="mt-1 text-[var(--color-body)]">
          Живут отдельно от конкретной встречи и ссылаются друг на друга и на Epic.
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
          <DecisionForm epics={epics} existingRecords={records} onSubmit={createRecord} />

          <div className="flex flex-wrap gap-1">
            {(["all", ...RECORD_TYPES.map((t) => t.value)] as const).map((value) => {
              const label =
                value === "all"
                  ? "Все"
                  : RECORD_TYPES.find((t) => t.value === value)?.label;
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

          {error ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">Пока пусто.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((record) => (
                <DecisionCard
                  key={record.id}
                  record={record}
                  epics={epics}
                  allRecords={records}
                  onDelete={deleteRecord}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
