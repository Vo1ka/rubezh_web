"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ProposalStatus } from "@/lib/proposals";
import { PROPOSAL_STATUSES } from "@/lib/proposals";

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

// Kept as a lookup by status so ProposalStatusControl's dropdown and
// ProposalCard's read-only badge always render identically.
export const PROPOSAL_STATUS_STYLE: Record<ProposalStatus, CSSProperties> = {
  new: outline("var(--badge-gold)"),
  validating: solid("var(--badge-orange)"),
  approved: solid("var(--badge-gold)"),
  rejected: solid("var(--badge-orange-red)"),
  blocked_product: solid("var(--badge-tomato)"),
  blocked_design: solid("var(--badge-dark-orange)"),
  blocked_technical: outline("var(--badge-orange-red)"),
  needs_prototype: outline("var(--badge-dark-orange)"),
};

export default function ProposalStatusControl({
  status,
  onChange,
  size = "sm",
}: {
  status: ProposalStatus;
  onChange: (status: ProposalStatus) => void;
  size?: "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const statusLabel = PROPOSAL_STATUSES.find((s) => s.value === status)?.label;

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
        className={`rounded-md px-2.5 py-1 font-bold ${size === "lg" ? "text-sm" : "text-xs"} ${
          status === "validating" ? "animate-pulse" : ""
        }`}
        style={PROPOSAL_STATUS_STYLE[status]}
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
          {PROPOSAL_STATUSES.map((s) => (
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
              style={PROPOSAL_STATUS_STYLE[s.value]}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
