"use client";

import { useState } from "react";
import { useEpics } from "@/hooks/useEpics";
import { MVP_PRIORITIES } from "@/lib/epics";
import EpicCard from "@/components/epics/EpicCard";
import EpicForm from "@/components/epics/EpicForm";
import { DirectionFilter, matchesDirection } from "@/components/directions/DirectionPickers";

export default function EpicsPage() {
  const { epics, loading, error, configured, createEpic, updateStatus, updateDirections, deleteEpic } =
    useEpics();
  const [directionFilter, setDirectionFilter] = useState("");
  const visibleEpics = epics.filter((e) => matchesDirection(directionFilter, e.directions));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">Epic Map</h1>
        <p className="mt-1 text-[var(--color-body)]">
          Сквозная структура MVP: владелец, приоритет, статус/блокировка, зависимости.
        </p>
      </div>

      {!configured ? (
        <div
          className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          Supabase не настроен — Epic Map недоступна.
        </div>
      ) : (
        <>
          <EpicForm existingEpics={epics} onSubmit={createEpic} />

          <div>
            <DirectionFilter value={directionFilter} onChange={setDirectionFilter} />
          </div>

          {error ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : visibleEpics.length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">
              {epics.length === 0 ? "Пока нет ни одного Epic." : "Нет Epic с этим направлением."}
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {MVP_PRIORITIES.map((priority) => {
                const group = visibleEpics.filter((e) => e.mvp_priority === priority.value);
                if (group.length === 0) return null;
                return (
                  <div key={priority.value}>
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
                      {priority.label}
                    </h2>
                    <div className="flex flex-col gap-3">
                      {group.map((epic) => (
                        <EpicCard
                          key={epic.id}
                          epic={epic}
                          allEpics={epics}
                          onChangeStatus={updateStatus}
                          onChangeDirections={updateDirections}
                          onDelete={deleteEpic}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
