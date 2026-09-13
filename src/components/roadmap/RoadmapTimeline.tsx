import type { RecommendedStep } from "@/lib/roadmap";

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
      style={{ background: "var(--color-primary-bg)", color: "var(--color-primary-text)" }}
    >
      {n}
    </span>
  );
}

function StepText({ step }: { step: RecommendedStep }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-title)]">{step.summary}</p>
      <p className="mt-1 text-xs text-[var(--color-body)]">{step.rationale}</p>
    </div>
  );
}

export default function RoadmapTimeline({ steps }: { steps: RecommendedStep[] }) {
  return (
    <div>
      {/* Narrow screens: simple left-aligned timeline */}
      <ol className="flex flex-col gap-6 sm:hidden">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-3">
            <StepBadge n={s.step} />
            <StepText step={s} />
          </li>
        ))}
      </ol>

      {/* Wider screens: alternating timeline around a center spine */}
      <ol className="relative hidden sm:flex sm:flex-col sm:gap-8">
        <div
          className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
          style={{ background: "var(--color-surface-border)" }}
        />
        {steps.map((s, i) => {
          const isLeft = i % 2 === 0;
          return (
            <li
              key={s.step}
              className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-6"
            >
              <div className={isLeft ? "text-right" : ""}>
                {isLeft ? <StepText step={s} /> : null}
              </div>
              <div className="relative z-10">
                <StepBadge n={s.step} />
              </div>
              <div>{!isLeft ? <StepText step={s} /> : null}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
