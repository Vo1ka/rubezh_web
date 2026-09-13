"use client";

import { useRoadmap } from "@/hooks/useRoadmap";

export default function RoadmapPage() {
  const { snapshot, loading, error, configured } = useRoadmap();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">Roadmap</h1>
        <p className="mt-1 text-[var(--color-body)]">
          Вехи, рекомендованный порядок работ и текущий спринт — из Development Plan.
        </p>
      </div>

      {!configured ? (
        <p className="text-sm text-[var(--color-body)]">
          Supabase не настроен — Roadmap недоступен.
        </p>
      ) : loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : error ? (
        <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
      ) : !snapshot ? (
        <p className="text-sm text-[var(--color-body)]">
          Roadmap пока не заполнен — нужно занести снимок из актуального Development Plan.
        </p>
      ) : (
        <>
          <div
            className="rounded-lg border bg-[var(--color-secondary-bg)] p-4 text-sm"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <p className="text-[var(--color-body)]">
              Источник: Development Plan {snapshot.source_version}
            </p>
            {snapshot.capacity_note ? (
              <p className="mt-2 text-[var(--color-secondary-text)]">
                {snapshot.capacity_note}
              </p>
            ) : null}
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
              Вехи интеграции
            </h2>
            <div className="flex flex-col gap-3">
              {snapshot.milestones.map((m) => (
                <div
                  key={m.code}
                  className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
                  style={{ borderColor: "var(--color-surface-border)" }}
                >
                  <h3 className="font-semibold text-[var(--color-title)]">{m.code}</h3>
                  <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
                    {m.definition}
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-body)]">
                    Состав: {m.composition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
              Рекомендованный порядок работ
            </h2>
            <div className="flex flex-col gap-3">
              {snapshot.recommended_order.map((s) => (
                <div
                  key={s.step}
                  className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
                  style={{ borderColor: "var(--color-surface-border)" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded bg-[var(--color-primary-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-text)]">
                      {s.step}
                    </span>
                    <p className="text-sm text-[var(--color-secondary-text)]">{s.summary}</p>
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-body)]">{s.rationale}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
              Текущий спринт
            </h2>
            <div
              className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
              style={{ borderColor: "var(--color-surface-border)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-[var(--color-title)]">Цель</h3>
                <span className="rounded bg-[var(--color-forest-600)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-text)]">
                  {snapshot.next_sprint.gate_status}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.goal}
              </p>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                Задачи
              </h4>
              <ul className="mt-1 list-inside list-disc text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                Не-код действия / эскалации
              </h4>
              <ul className="mt-1 list-inside list-disc text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.non_code_actions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                Ожидаемое состояние билда
              </h4>
              <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.expected_build_state}
              </p>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                Validation
              </h4>
              <ul className="mt-1 list-inside list-disc text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.validation.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]">
                Exit Criteria
              </h4>
              <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.exit_criteria}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
              Требуемые решения
            </h2>
            <div
              className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
              style={{ borderColor: "var(--color-surface-border)" }}
            >
              <ul className="list-inside list-disc text-sm text-[var(--color-secondary-text)]">
                {snapshot.next_sprint.escalations.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
