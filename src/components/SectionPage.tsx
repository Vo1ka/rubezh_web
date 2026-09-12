import type { ReactNode } from "react";
import type { SectionSlug } from "@/lib/sections";
import KanbanBoard from "./kanban/KanbanBoard";

type SectionPageProps = {
  title: string;
  subtitle: string;
  section: SectionSlug;
  children?: ReactNode;
};

export default function SectionPage({
  title,
  subtitle,
  section,
  children,
}: SectionPageProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">{title}</h1>
        <p className="mt-1 text-[var(--color-body)]">{subtitle}</p>
      </div>
      {children}
      <KanbanBoard section={section} />
    </div>
  );
}
