"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/sections";

const TABS = [{ href: "/", label: "Главная" }, ...SECTIONS];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{ background: "var(--color-header-gradient)" }}
      className="text-[var(--color-primary-text)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            Rubezh Web
          </span>
        </div>
        <nav className="flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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
