"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { EpicStatus } from "@/lib/epics";
import { EPIC_STATUSES } from "@/lib/epics";

const solid = (bg: string, text: string): CSSProperties => ({
  backgroundColor: bg,
  color: text,
});

const outline = (border: string, text: string): CSSProperties => ({
  backgroundColor: "var(--status-blocked-bg)",
  color: text,
  border: `1.5px solid ${border}`,
});

export const STATUS_STYLE: Record<EpicStatus, CSSProperties> = {
  not_started: solid("var(--status-backlog-bg)", "var(--status-backlog-text)"),
  in_progress: solid("var(--status-in-progress-bg)", "var(--status-in-progress-text)"),
  done: solid("var(--status-done-bg)", "var(--status-done-text)"),
  needs_prototype: solid("var(--status-review-bg)", "var(--status-review-text)"),
  blocked_design: outline("var(--status-blocked-border)", "var(--status-blocked-text)"),
  blocked_technical: outline("var(--status-blocked-border)", "var(--status-blocked-text)"),
  blocked_product: outline("var(--status-blocked-border)", "var(--status-blocked-text)"),
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
        className={`rounded px-2 py-0.5 font-medium ${size === "lg" ? "text-sm" : "text-xs"}`}
        style={STATUS_STYLE[status]}
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
              className={`rounded px-2 py-1 text-left text-xs font-medium transition-opacity hover:opacity-80 ${
                s.value === status ? "ring-2 ring-[var(--color-title)]" : ""
              }`}
              style={STATUS_STYLE[s.value]}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
