import Link from "next/link";
import { NAV_TABS } from "@/lib/navigation";

export default function SectionsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">Разделы</h1>
        <p className="mt-1 text-[var(--color-body)]">
          Все вкладки сайта в одном месте — что в каждой из них есть.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-lg border bg-[var(--color-secondary-bg)] p-4 transition-colors hover:border-[var(--color-title)]"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <h2 className="font-semibold text-[var(--color-title)]">{tab.label}</h2>
            <p className="mt-1 text-sm text-[var(--color-body)]">{tab.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
