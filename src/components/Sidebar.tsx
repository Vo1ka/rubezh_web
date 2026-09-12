"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, getSectionBySlug } from "@/lib/sections";
import SidebarNotes from "./SidebarNotes";

export default function Sidebar() {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/")
    ? pathname.split("/")[1]
    : undefined;
  const activeSection = activeSlug ? getSectionBySlug(activeSlug) : undefined;

  return (
    <aside
      className="hidden w-64 shrink-0 border-r px-3 py-5 sm:block"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-body)]/70">
        Rubezh Web
      </p>
      <nav className="mt-2 flex flex-col gap-0.5">
        {SECTIONS.map((section) => {
          const isActive = section.slug === activeSlug;
          return (
            <Link
              key={section.slug}
              href={section.href}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-surface-bg)] text-[var(--color-title)]"
                  : "text-[var(--color-body)] hover:bg-[var(--color-surface-bg)]/40"
              }`}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[var(--color-primary-text)]"
                style={{ background: "var(--color-primary-bg)" }}
              >
                {section.label.charAt(0)}
              </span>
              {section.label}
            </Link>
          );
        })}
      </nav>

      {activeSection ? <SidebarNotes section={activeSection.slug} /> : null}
    </aside>
  );
}
