"use client";

import { useEffect, useRef, useState } from "react";
import type { EpicStatus } from "@/lib/epics";
import { EPIC_STATUSES } from "@/lib/epics";

export const STATUS_STYLE: Record<EpicStatus, string> = {
  not_started:
    "bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)] border border-[var(--color-secondary-border)]",
  in_progress: "bg-[var(--color-surface-bg)] text-[var(--color-title)]",
  done: "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]",
  blocked_design: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  blocked_technical: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  blocked_product: "bg-[var(--color-forest-950)] text-[var(--color-primary-text)]",
  needs_prototype: "bg-[var(--color-forest-600)] text-[var(--color-primary-text)]",
};

export default function EpicStatusControl({
  status,
  onChange,
  size = "sm",
}: {
  status: EpicStatus;
  onChange: (status: EpicStatus) => void;
  size?: "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const statusLabel = EPIC_STATUSES.find((s) => s.value === status)?.label;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`rounded px-2 py-0.5 font-medium ${size === "lg" ? "text-sm" : "text-xs"} ${STATUS_STYLE[status]}`}
        title="Нажмите, чтобы выбрать статус"
      >
        {statusLabel} ▾
      </button>

      {open ? (
        <div
          className="absolute left-0 z-20 mt-1 flex w-56 flex-col gap-1 rounded-lg border bg-[var(--color-secondary-bg)] p-2 shadow-lg"
          style={{ borderColor: "var(--color-surface-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {EPIC_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                onChange(s.value);
                setOpen(false);
              }}
              className={`rounded px-2 py-1 text-left text-xs font-medium transition-opacity hover:opacity-80 ${STATUS_STYLE[s.value]} ${
                s.value === status ? "ring-2 ring-[var(--color-title)]" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
