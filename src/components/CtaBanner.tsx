import type { ReactNode } from "react";

type CtaBannerProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function CtaBanner({ title, description, action }: CtaBannerProps) {
  return (
    <div
      className="rounded-lg px-6 py-8 text-center"
      style={{ background: "var(--color-cta-gradient)" }}
    >
      <h2 className="text-xl font-semibold text-[var(--color-cta-title)]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-cta-title)]/90">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-5 flex justify-center">
          <button className="rounded-md bg-[var(--color-cta-button-bg)] px-4 py-2 text-sm font-medium text-[var(--color-cta-button-text)] transition-opacity hover:opacity-90">
            {action}
          </button>
        </div>
      ) : null}
    </div>
  );
}
