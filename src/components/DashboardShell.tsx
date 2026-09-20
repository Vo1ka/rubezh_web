import type { ReactNode } from "react";
import CtaBanner from "./CtaBanner";

type DashboardShellProps = {
  title: string;
  subtitle: string;
  cta: { title: string; description: string; action: string; href: string };
  children?: ReactNode;
};

export default function DashboardShell({
  title,
  subtitle,
  cta,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">
          {title}
        </h1>
        <p className="mt-1 text-[var(--color-body)]">{subtitle}</p>
      </div>

      {children}

      <CtaBanner
        title={cta.title}
        description={cta.description}
        action={cta.action}
        href={cta.href}
      />
    </div>
  );
}
