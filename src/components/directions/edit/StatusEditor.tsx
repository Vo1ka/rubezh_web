"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { currentHeads, openDirectionFile, saveStatus, type ActionResult } from "@/app/directions/[id]/actions";
import { composeStatus, statusTemplate } from "@/lib/directions/edit";
import { parseStatus } from "@/lib/directions/status";
import { DIRECTION_STATES } from "@/lib/directions/registry";
import { AuthorInput, ConflictDiff, Field, ResultNote, inputBorder, inputClass, primaryButton, secondaryButton, useAuthorName } from "./shared";

type Draft = {
  sha: string | null;
  owner: string;
  state: string;
  reflects: Record<string, string>;
  body: string;
};

// RW-16: STATUS editor — front matter as a form, the sections as markdown.
// It starts from an uncached read; the save is checked against that sha.
export default function StatusEditor({
  id,
  name,
  owner,
  state,
  repos,
  onClose,
}: {
  id: string;
  name: string;
  owner: string | null;
  state: string;
  /** Short names of the repos the direction lives in — one `reflects` entry each. */
  repos: string[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useAuthorName(owner ?? "");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const load = (fromContent?: { content: string | null; sha: string | null }) => {
    const apply = (content: string | null, sha: string | null) => {
      const parsed = content ? parseStatus(content) : null;
      const fm = parsed?.frontMatter;
      setDraft({
        sha,
        owner: fm?.owner ?? owner ?? "",
        state: fm?.state ?? state,
        reflects: Object.fromEntries(repos.map((r) => [r, fm?.reflects[r] ?? ""])),
        body: parsed ? parsed.body.trim() : statusTemplate(name),
      });
    };
    if (fromContent) return apply(fromContent.content, fromContent.sha);
    openDirectionFile(id, "STATUS.md").then((r) => (r.ok ? apply(r.file.content, r.file.sha) : setLoadError(r.error)));
  };

  useEffect(() => load(), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadError) return <p className="text-sm text-[var(--color-title)]">⚠ {loadError}</p>;
  if (!draft) return <p className="text-sm text-[var(--color-body)]">Загружаю STATUS…</p>;

  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });

  const fillHeads = () =>
    startTransition(async () => {
      const r = await currentHeads(id);
      if (r.ok) set({ reflects: { ...draft.reflects, ...r.heads } });
      else setResult(r);
    });

  const save = () =>
    startTransition(async () => {
      const r = await saveStatus(id, {
        fields: { owner: draft.owner, state: draft.state, reflects: draft.reflects },
        body: draft.body,
        baseSha: draft.sha,
        summary,
        author,
      });
      setResult(r);
      if (r.ok) {
        router.refresh();
        onClose();
      }
    });

  const conflict = result && !result.ok && "conflict" in result ? result.conflict : null;

  return (
    <div className="flex flex-col gap-3">
      {draft.sha === null ? (
        <p className="text-sm text-[var(--color-body)]">Файла ещё нет — подставлен шаблон из гайда.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Владелец">
          <input value={draft.owner} onChange={(e) => set({ owner: e.target.value })} className={inputClass} style={inputBorder} />
        </Field>
        <Field label="Состояние">
          <select value={draft.state} onChange={(e) => set({ state: e.target.value })} className={inputClass} style={inputBorder}>
            {DIRECTION_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {repos.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Field label="reflects" hint="последний коммит, который учтён в этом статусе">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {repos.map((repo) => (
                <div key={repo} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 font-mono text-xs">{repo}</span>
                  <input
                    value={draft.reflects[repo] ?? ""}
                    onChange={(e) => set({ reflects: { ...draft.reflects, [repo]: e.target.value } })}
                    placeholder="sha"
                    className={`${inputClass} font-mono`}
                    style={inputBorder}
                  />
                </div>
              ))}
            </div>
          </Field>
          <button type="button" onClick={fillHeads} disabled={pending} className={`${secondaryButton} self-start`}>
            Статус учитывает всё до последнего коммита
          </button>
          <p className="text-xs text-[var(--color-body)]/70">
            Нажимайте, только если действительно просмотрели изменения, — после этого флаг «статус отстал» снимется.
          </p>
        </div>
      ) : null}

      <Field label="Текст" hint="секции не переименовывайте — сайт разбирает файл по ним">
        <textarea
          value={draft.body}
          onChange={(e) => set({ body: e.target.value })}
          rows={22}
          className={`${inputClass} font-mono text-xs`}
          style={inputBorder}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AuthorInput value={author} onChange={setAuthor} />
        <Field label="Что поменялось" hint="попадёт в сообщение коммита">
          <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="обновлены следующие шаги" className={inputClass} style={inputBorder} />
        </Field>
      </div>

      {conflict ? (
        <div className="flex flex-col gap-2 rounded border p-3" style={{ borderColor: "var(--badge-dark-orange)" }}>
          <p className="text-sm text-[var(--color-title)]">
            ⚠ Пока вы редактировали, STATUS изменили в репозитории. Ничего не перезаписано. Ниже — разница между версией в
            репозитории (−) и вашей (+). Скопируйте свои правки, загрузите свежую версию и внесите их снова.
          </p>
          <ConflictDiff
            current={conflict.currentContent ?? ""}
            mine={composeStatus({ direction: id, owner: draft.owner, state: draft.state, updated: "…", reflects: draft.reflects }, draft.body)}
          />
          <button
            type="button"
            onClick={() => {
              load({ content: conflict.currentContent, sha: conflict.currentSha });
              setResult(null);
            }}
            className={`${secondaryButton} self-start`}
          >
            Загрузить версию из репозитория
          </button>
        </div>
      ) : (
        <ResultNote result={result} />
      )}

      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={pending || !author.trim()} className={primaryButton}>
          {pending ? "Сохраняю…" : "Сохранить STATUS"}
        </button>
        <button type="button" onClick={onClose} className={secondaryButton} style={inputBorder}>
          Отмена
        </button>
      </div>
    </div>
  );
}
