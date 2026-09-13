"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "@/lib/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{ background: "var(--color-header-gradient)" }}
      className="text-[var(--color-primary-text)]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
        <span className="text-xl font-semibold tracking-tight">
          Rubezh Web
        </span>
        <nav className="flex flex-wrap gap-1">
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-md px-3 py-1.5 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)]"
                    : "text-[var(--color-primary-text)] hover:bg-white/10"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
