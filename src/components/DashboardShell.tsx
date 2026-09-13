import type { ReactNode } from "react";
import DashboardCard from "./DashboardCard";
import CtaBanner from "./CtaBanner";

type CardItem = {
  title: string;
  description: string;
};

type DashboardShellProps = {
  title: string;
  subtitle: string;
  cards: CardItem[];
  cta: { title: string; description: string; action: string; href: string };
  children?: ReactNode;
};

export default function DashboardShell({
  title,
  subtitle,
  cards,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
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
