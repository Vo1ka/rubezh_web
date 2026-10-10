import type { CSSProperties, ReactNode } from "react";
import { stateLabel } from "@/lib/directions/registry";

const STATE_STYLE: Record<string, CSSProperties> = {
  active: { background: "var(--color-primary-bg)", color: "var(--color-primary-text)" },
  paused: { background: "transparent", color: "var(--color-body)", border: "1.5px solid var(--color-surface-border)" },
  blocked: { background: "var(--badge-orange-red)", color: "var(--badge-text)" },
};

export function StateBadge({ state }: { state: string }) {
  return (
    <span className="rounded px-2 py-0.5 text-xs font-semibold" style={STATE_STYLE[state] ?? STATE_STYLE.paused}>
      {stateLabel(state)}
    </span>
  );
}

export function FlagBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded px-2 py-0.5 text-xs font-semibold"
      style={{ background: "transparent", color: "var(--badge-text)", border: "1.5px solid var(--badge-dark-orange)" }}
    >
      ⚠ {children}
    </span>
  );
}

export function Panel({
  title,
  action,
  children,
  highlight,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      className="rounded-lg border p-4"
      style={{
        borderColor: highlight ? "var(--badge-dark-orange)" : "var(--color-surface-border)",
        borderWidth: highlight ? 2 : 1,
      }}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-title)]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <p className="text-sm text-[var(--color-body)]/70">{children}</p>;
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p
      className="rounded border px-3 py-2 text-sm text-[var(--color-body)]"
      style={{ borderColor: "var(--badge-orange-red)" }}
    >
      {children}
    </p>
  );
}

export function formatDate(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-body)] underline underline-offset-2 hover:opacity-80">
      {children}
    </a>
  );
}
