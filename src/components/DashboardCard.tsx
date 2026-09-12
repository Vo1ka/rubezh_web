import type { ReactNode } from "react";

type DashboardCardProps = {
  icon?: ReactNode;
  title: string;
  description: string;
};

export default function DashboardCard({
  icon,
  title,
  description,
}: DashboardCardProps) {
  return (
    <div
      className="rounded-lg border bg-[var(--color-surface-bg)] p-5"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      {icon ? (
        <div className="mb-3 text-[var(--color-surface-icon)]">{icon}</div>
      ) : null}
      <h3 className="mb-1 text-base font-semibold text-[var(--color-title)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-title)]">{description}</p>
    </div>
  );
}
