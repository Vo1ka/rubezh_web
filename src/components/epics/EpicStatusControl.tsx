"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { EpicStatus } from "@/lib/epics";
import { EPIC_STATUSES } from "@/lib/epics";

const solid = (background: string): CSSProperties => ({
  background,
  color: "var(--badge-text)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
});

const outline = (border: string): CSSProperties => ({
  background: "transparent",
  color: "var(--badge-text)",
  border: `1.5px solid ${border}`,
});

// Same accent vocabulary as ProposalStatusControl — Epic and Proposal
// statuses share the same blocked_*/needs_prototype values.
export const STATUS_STYLE: Record<EpicStatus, CSSProperties> = {
  not_started: outline("var(--badge-gold)"),
  in_progress: solid("var(--badge-orange)"),
  done: solid("var(--badge-gold)"),
  needs_prototype: outline("var(--badge-dark-orange)"),
  blocked_design: solid("var(--badge-dark-orange)"),
  blocked_technical: outline("var(--badge-orange-red)"),
  blocked_product: solid("var(--badge-tomato)"),
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
        className={`rounded-md px-2.5 py-1 font-bold ${size === "lg" ? "text-sm" : "text-xs"}`}
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
              className={`rounded-md px-2.5 py-1 text-left text-xs font-bold transition-opacity hover:opacity-80 ${
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
