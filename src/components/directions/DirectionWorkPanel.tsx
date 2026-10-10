import Link from "next/link";
import type { ReactNode } from "react";
import type { DirectionWork } from "@/lib/directions/tracker";
import type { Loaded } from "@/lib/directions/data";
import { EPIC_STATUSES } from "@/lib/epics";
import { STATUSES as NOTE_STATUSES } from "@/lib/notes";
import { RECORD_TYPES, STATUS_OPTIONS } from "@/lib/decisions";
import { PROPOSAL_STATUSES } from "@/lib/proposals";
import { getSectionBySlug } from "@/lib/sections";
import { ErrorNote, Muted, Panel } from "./ui";

// RW-14 block 5: active Epics, Kanban cards, open Decisions and Proposals
// tagged with this direction (RW-13).
export default function DirectionWorkPanel({ work }: { work: Loaded<DirectionWork> }) {
  return (
    <Panel title="Работа по направлению">
      {!work.ok ? (
        <ErrorNote>{work.error}</ErrorNote>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Group title="Epics" empty="Нет активных Epic с этим направлением.">
            {work.value.epics.map((e) => (
              <Row key={e.id} href={`/epics/${e.id}`} meta={`${e.mvp_priority} · ${label(EPIC_STATUSES, e.status)}`}>
                {e.title}
              </Row>
            ))}
          </Group>

          <Group title="Kanban" empty="Нет активных карточек с этим направлением.">
            {work.value.notes.map((n) => {
              const section = getSectionBySlug(n.section);
              return (
                <Row key={n.id} href={section?.href ?? "/"} meta={`${section?.label ?? n.section} · ${label(NOTE_STATUSES, n.status)}`}>
                  {n.title}
                </Row>
              );
            })}
          </Group>

          <Group title="Решения, риски, вопросы" empty="Нет открытых записей с этим направлением.">
            {work.value.decisions.map((d) => (
              <Row
                key={d.id}
                href="/decisions"
                meta={[label(RECORD_TYPES, d.type), d.status ? label(STATUS_OPTIONS[d.type] ?? [], d.status) : null]
                  .filter(Boolean)
                  .join(" · ")}
                warn={d.type === "open_question" && d.status === "blocking"}
              >
                {d.title}
              </Row>
            ))}
          </Group>

          <Group title="Предложения" empty="Нет открытых предложений с этим направлением.">
            {work.value.proposals.map((p) => (
              <Row key={p.id} href="/proposals" meta={label(PROPOSAL_STATUSES, p.status)}>
                {p.title}
              </Row>
            ))}
          </Group>
        </div>
      )}
    </Panel>
  );
}

function Group({ title, empty, children }: { title: string; empty: string; children: ReactNode[] }) {
  return (
    <div>
      <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-title)]">
        {title} {children.length > 0 ? <span className="font-normal opacity-60">· {children.length}</span> : null}
      </h3>
      {children.length > 0 ? <ul className="flex flex-col gap-1.5">{children}</ul> : <Muted>{empty}</Muted>}
    </div>
  );
}

function Row({ href, meta, warn, children }: { href: string; meta: string; warn?: boolean; children: ReactNode }) {
  return (
    <li className="text-sm">
      <Link href={href} className="text-[var(--color-title)] hover:underline">
        {warn ? "⚠ " : ""}
        {children}
      </Link>
      <span className="ml-1.5 text-xs text-[var(--color-body)]/70">{meta}</span>
    </li>
  );
}

function label(options: readonly { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}
