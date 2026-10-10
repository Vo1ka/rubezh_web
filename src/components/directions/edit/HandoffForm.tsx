"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handOff, type ActionResult } from "@/app/directions/[id]/actions";
import { HANDOFF_FIELDS, missingHandoffFields, type HandoffFieldKey } from "@/lib/directions/edit";
import { DIRECTION_STATES } from "@/lib/directions/registry";
import { AuthorInput, Field, ResultNote, inputBorder, inputClass, primaryButton, secondaryButton, useAuthorName } from "./shared";

const PAUSE = "__pause__";
const OTHER = "__other__";

// RW-17: handoff — the journal entry with its required minimum plus the new
// owner/state in directions.yaml, committed together.
export default function HandoffForm({
  id,
  owner,
  owners,
  statusBehind,
  onEditStatus,
  onClose,
}: {
  id: string;
  owner: string | null;
  /** Owners already in the registry — offered as recipients. */
  owners: string[];
  statusBehind: boolean;
  onEditStatus: () => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [author, setAuthor] = useAuthorName(owner ?? "");
  const [recipient, setRecipient] = useState(PAUSE);
  const [otherName, setOtherName] = useState("");
  const [state, setState] = useState("paused");
  const [fields, setFields] = useState<Partial<Record<HandoffFieldKey, string>>>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const to = recipient === PAUSE ? null : recipient === OTHER ? otherName.trim() || null : recipient;
  const missing = missingHandoffFields(fields);
  const canSubmit = missing.length === 0 && author.trim() && (recipient !== OTHER || otherName.trim());

  const chooseRecipient = (next: string) => {
    setRecipient(next);
    setState(next === PAUSE ? "paused" : "active");
  };

  const submit = () =>
    startTransition(async () => {
      const r = await handOff(id, { author, to, state, fields });
      setResult(r);
      if (r.ok) {
        router.refresh();
        onClose();
      }
    });

  return (
    <div className="flex flex-col gap-3">
      {statusBehind ? (
        <div className="flex flex-wrap items-center gap-2 rounded border p-3 text-sm" style={{ borderColor: "var(--badge-dark-orange)" }}>
          <span className="text-[var(--color-title)]">⚠ Статус отстал от кода. Перед передачей обновите STATUS и reflects.</span>
          <button type="button" onClick={onEditStatus} className={secondaryButton}>
            Обновить STATUS
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AuthorInput value={author} onChange={setAuthor} />
        <Field label="Кому">
          <select value={recipient} onChange={(e) => chooseRecipient(e.target.value)} className={inputClass} style={inputBorder}>
            <option value={PAUSE}>Никому — пауза</option>
            {owners
              .filter((o) => o !== owner)
              .map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            <option value={OTHER}>Другому…</option>
          </select>
        </Field>
        <Field label="Состояние после">
          <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass} style={inputBorder}>
            {DIRECTION_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {recipient === OTHER ? (
        <input value={otherName} onChange={(e) => setOtherName(e.target.value)} placeholder="Имя нового владельца" className={inputClass} style={inputBorder} />
      ) : null}

      {HANDOFF_FIELDS.map((f) => (
        <Field key={f.key} label={`${f.label}${f.required ? " *" : ""}`} hint={"hint" in f ? f.hint : undefined}>
          <textarea
            value={fields[f.key] ?? ""}
            onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
            rows={2}
            className={inputClass}
            style={inputBorder}
          />
        </Field>
      ))}

      {missing.length > 0 ? <p className="text-xs text-[var(--color-body)]/70">Обязательно: {missing.join(", ")}.</p> : null}
      <ResultNote result={result} />
      <div className="flex gap-2">
        <button type="button" onClick={submit} disabled={pending || !canSubmit} className={primaryButton}>
          {pending ? "Сохраняю…" : to ? `Передать ${to}` : "Поставить на паузу"}
        </button>
        <button type="button" onClick={onClose} className={secondaryButton} style={inputBorder}>
          Отмена
        </button>
      </div>
    </div>
  );
}
