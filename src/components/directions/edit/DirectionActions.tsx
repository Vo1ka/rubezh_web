"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { takeOver, type ActionResult } from "@/app/directions/[id]/actions";
import StatusEditor from "./StatusEditor";
import JournalForm from "./JournalForm";
import HandoffForm from "./HandoffForm";
import { AuthorInput, Field, ResultNote, inputBorder, inputClass, primaryButton, secondaryButton, useAuthorName } from "./shared";

type Mode = "status" | "journal" | "handoff" | "take" | null;

const TITLES: Record<Exclude<Mode, null>, string> = {
  status: "Редактирование STATUS",
  journal: "Новая запись в журнал",
  handoff: "Передать / поставить на паузу",
  take: "Взять направление",
};

// RW-16/17: the write actions of a direction page. Everything is saved as a
// commit to directions/<id>/ (and directions.yaml for a handoff).
export default function DirectionActions({
  id,
  name,
  owner,
  state,
  repos,
  owners,
  statusBehind,
  takeOverBriefing,
}: {
  id: string;
  name: string;
  owner: string | null;
  state: string;
  repos: string[];
  owners: string[];
  statusBehind: boolean;
  /** Last handoff and the journal after it, rendered on the server. */
  takeOverBriefing: ReactNode;
}) {
  const [mode, setMode] = useState<Mode>(null);
  const close = () => setMode(null);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <ModeButton active={mode === "status"} onClick={() => setMode("status")}>
          ✎ Редактировать STATUS
        </ModeButton>
        <ModeButton active={mode === "journal"} onClick={() => setMode("journal")}>
          + Запись в журнал
        </ModeButton>
        <ModeButton active={mode === "handoff"} onClick={() => setMode("handoff")}>
          Передать / поставить на паузу
        </ModeButton>
        <ModeButton active={mode === "take"} onClick={() => setMode("take")}>
          Взять направление
        </ModeButton>
      </div>

      {mode ? (
        <div className="rounded-lg border-2 p-4" style={{ borderColor: "var(--color-primary-bg)" }}>
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-title)]">{TITLES[mode]}</h2>
          {mode === "status" ? <StatusEditor id={id} name={name} owner={owner} state={state} repos={repos} onClose={close} /> : null}
          {mode === "journal" ? <JournalForm id={id} owner={owner} onClose={close} /> : null}
          {mode === "handoff" ? (
            <HandoffForm id={id} owner={owner} owners={owners} statusBehind={statusBehind} onEditStatus={() => setMode("status")} onClose={close} />
          ) : null}
          {mode === "take" ? <TakeOver id={id} owner={owner} briefing={takeOverBriefing} onClose={close} /> : null}
        </div>
      ) : null}
    </section>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? primaryButton : secondaryButton}
      style={active ? undefined : { borderColor: "var(--color-surface-border)" }}
    >
      {children}
    </button>
  );
}

// Briefing (RW-18) isn't there yet, so entering a direction means reading the
// last handoff and everything after it; then the reader can take ownership.
function TakeOver({ id, owner, briefing, onClose }: { id: string; owner: string | null; briefing: ReactNode; onClose: () => void }) {
  const router = useRouter();
  const [author, setAuthor] = useAuthorName("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const alreadyOwner = Boolean(owner && author.trim() === owner);

  const submit = () =>
    startTransition(async () => {
      const r = await takeOver(id, { author, note });
      setResult(r);
      if (r.ok) {
        router.refresh();
        onClose();
      }
    });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-body)]">
        Перед тем как брать направление: прочитайте STATUS выше, последнюю передачу и журнал после неё. Если что-то не
        сходится с кодом — сначала поправьте STATUS.
      </p>
      {briefing}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthorInput value={author} onChange={setAuthor} />
        <Field label="Комментарий" hint="необязательно">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Прочитал передачу, начинаю с…" className={inputClass} style={inputBorder} />
        </Field>
      </div>
      <ResultNote result={result} />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={submit} disabled={pending || !author.trim() || alreadyOwner} className={primaryButton}>
          {pending ? "Сохраняю…" : alreadyOwner ? "Вы уже владелец" : "Стать владельцем"}
        </button>
        <button type="button" onClick={onClose} className={secondaryButton} style={inputBorder}>
          Закрыть
        </button>
      </div>
      <p className="text-xs text-[var(--color-body)]/70">
        «Стать владельцем» записывает в журнал передачу на вас и ставит вас владельцем в directions.yaml — одним коммитом.
      </p>
    </div>
  );
}
