"use server";

import { revalidatePath, updateTag } from "next/cache";
import { fetchCommits, fetchRepoFileFresh, repoCacheTag } from "@/lib/github";
import { commitFiles, type FileConflict } from "@/lib/githubWrite";
import { DIRECTIONS_REPO, REGISTRY_PATH, directionFilePath, loadDirection, type Direction } from "@/lib/directions/registry";
import { AccessDenied, requireEditor, type Editor } from "@/lib/directions/session";
import {
  composeStatus,
  formatJournalEntry,
  handoffBody,
  missingHandoffFields,
  prependJournalEntry,
  setRegistryOwner,
  type HandoffFieldKey,
  type StatusFields,
} from "@/lib/directions/edit";
import type { JournalType } from "@/lib/directions/journal";

// RW-16/17: the site's write path. Each action checks the session itself,
// writes only through commitFiles (path whitelist + sha check) and expires the
// cached repo reads so the page shows the result right away.

export type ActionResult =
  | { ok: true; commitUrl: string }
  | { ok: false; error: string }
  | { ok: false; conflict: FileConflict };

export type EditableFile = { content: string | null; sha: string | null };

/** Uncached file for an editor to start from — its sha is what the save is checked against. */
export async function openDirectionFile(
  id: string,
  file: "STATUS.md" | "JOURNAL.md"
): Promise<{ ok: true; file: EditableFile } | { ok: false; error: string }> {
  return guard(async () => {
    await requireEditor();
    await directionOrThrow(id);
    const current = await fetchRepoFileFresh(DIRECTIONS_REPO, directionFilePath(id, file));
    return { ok: true as const, file: { content: current?.content ?? null, sha: current?.sha ?? null } };
  });
}

/** The «статус учитывает всё до последнего коммита» button: current HEAD of each repo the direction lives in. */
export async function currentHeads(id: string): Promise<{ ok: true; heads: Record<string, string> } | { ok: false; error: string }> {
  return guard(async () => {
    await requireEditor();
    const direction = await directionOrThrow(id);
    const repos = direction.sources.filter((s) => s.paths.length > 0).map((s) => s.repo);
    const heads: Record<string, string> = {};
    await Promise.all(
      repos.map(async (repo) => {
        const [head] = await fetchCommits(repo, { perPage: 1, revalidate: "fresh" });
        if (head) heads[shortRepo(repo)] = head.shortSha;
      })
    );
    return { ok: true as const, heads };
  });
}

export async function saveStatus(
  id: string,
  input: {
    fields: Omit<StatusFields, "direction" | "updated">;
    body: string;
    baseSha: string | null;
    summary: string;
    author: string;
  }
): Promise<ActionResult> {
  return guard(async () => {
    const editor = await requireEditor();
    const direction = await directionOrThrow(id);
    if (!input.body.trim()) return { ok: false as const, error: "Пустой STATUS не сохраняем" };

    const content = composeStatus({ ...input.fields, direction: id, updated: today() }, input.body);
    const summary = input.summary.trim() || "обновлён статус";
    const result = await commitFiles(
      DIRECTIONS_REPO,
      [{ path: directionFilePath(id, "STATUS.md"), content, baseSha: input.baseSha }],
      commitMessage(`status(${id}): ${summary}`, editor, input.author)
    );
    return finish(result, direction);
  });
}

const PLAIN_ENTRY_TYPES: JournalType[] = ["работа", "решение", "проблема"];

/**
 * Journal entries only ever go on top, so a concurrent change to the file is
 * not a conflict: the entry is re-applied to the fresh file and nothing that
 * was there is touched.
 */
export async function addJournalEntry(
  id: string,
  input: { type: JournalType; body: string; author: string }
): Promise<ActionResult> {
  return guard(async () => {
    const editor = await requireEditor();
    const direction = await directionOrThrow(id);
    if (!PLAIN_ENTRY_TYPES.includes(input.type)) {
      return { ok: false as const, error: "Передача оформляется отдельной формой «Передать направление»" };
    }
    if (!input.author.trim() || !input.body.trim()) return { ok: false as const, error: "Нужны автор и текст записи" };

    const entry = formatJournalEntry({ date: today(), author: input.author, type: input.type, body: input.body });
    return finish(
      await withFreshRetry(async () => {
        const path = directionFilePath(id, "JOURNAL.md");
        const current = await fetchRepoFileFresh(DIRECTIONS_REPO, path);
        return commitFiles(
          DIRECTIONS_REPO,
          [{ path, content: prependJournalEntry(current?.content ?? null, entry, direction.name), baseSha: current?.sha ?? null }],
          commitMessage(`journal(${id}): ${input.type}`, editor, input.author)
        );
      }),
      direction
    );
  });
}

/** RW-17: the handoff entry and the registry's new owner/state land in one commit. */
export async function handOff(
  id: string,
  input: {
    author: string;
    /** New owner, or null for «пауза». */
    to: string | null;
    state: string;
    fields: Partial<Record<HandoffFieldKey, string>>;
  }
): Promise<ActionResult> {
  return guard(async () => {
    const editor = await requireEditor();
    const direction = await directionOrThrow(id);
    const missing = missingHandoffFields(input.fields);
    if (missing.length > 0) return { ok: false as const, error: `Не заполнено: ${missing.join(", ")}` };
    if (!input.author.trim()) return { ok: false as const, error: "Укажите, кто передаёт" };
    if (!["active", "paused", "blocked"].includes(input.state)) return { ok: false as const, error: "Неизвестное состояние" };

    const to = input.to?.trim() || null;
    const entry = formatJournalEntry({
      date: today(),
      author: input.author,
      type: "передача",
      detail: to ? `→ ${to}` : "(пауза)",
      body: handoffBody(input.fields),
    });

    return finish(
      await withFreshRetry(async () => {
        const journalPath = directionFilePath(id, "JOURNAL.md");
        const [journal, registry] = await Promise.all([
          fetchRepoFileFresh(DIRECTIONS_REPO, journalPath),
          fetchRepoFileFresh(DIRECTIONS_REPO, REGISTRY_PATH),
        ]);
        if (!registry) throw new Error(`${REGISTRY_PATH} не найден`);
        return commitFiles(
          DIRECTIONS_REPO,
          [
            { path: journalPath, content: prependJournalEntry(journal?.content ?? null, entry, direction.name), baseSha: journal?.sha ?? null },
            { path: REGISTRY_PATH, content: setRegistryOwner(registry.content, id, to, input.state), baseSha: registry.sha },
          ],
          commitMessage(
            `journal(${id}): передача ${direction.owner ?? "—"} → ${to ?? "пауза"}`,
            editor,
            input.author,
            `owner: ${to ?? "null"}, state: ${input.state} в ${REGISTRY_PATH}`
          )
        );
      }),
      direction
    );
  });
}

/**
 * «Взять направление»: the new owner records the takeover as a handoff to
 * themselves (owner history lives in the journal) and becomes the owner in
 * the registry — same single commit as a handoff.
 */
export async function takeOver(id: string, input: { author: string; note: string }): Promise<ActionResult> {
  return guard(async () => {
    const editor = await requireEditor();
    const direction = await directionOrThrow(id);
    const me = input.author.trim();
    if (!me) return { ok: false as const, error: "Укажите своё имя" };
    if (direction.owner === me) return { ok: false as const, error: "Вы уже владелец этого направления" };

    const entry = formatJournalEntry({
      date: today(),
      author: me,
      type: "передача",
      detail: `→ ${me}`,
      body: [`Принял направление${direction.owner ? ` у ${direction.owner}` : " (было на паузе)"}.`, input.note.trim()]
        .filter(Boolean)
        .join("\n"),
    });

    return finish(
      await withFreshRetry(async () => {
        const journalPath = directionFilePath(id, "JOURNAL.md");
        const [journal, registry] = await Promise.all([
          fetchRepoFileFresh(DIRECTIONS_REPO, journalPath),
          fetchRepoFileFresh(DIRECTIONS_REPO, REGISTRY_PATH),
        ]);
        if (!registry) throw new Error(`${REGISTRY_PATH} не найден`);
        return commitFiles(
          DIRECTIONS_REPO,
          [
            { path: journalPath, content: prependJournalEntry(journal?.content ?? null, entry, direction.name), baseSha: journal?.sha ?? null },
            { path: REGISTRY_PATH, content: setRegistryOwner(registry.content, id, me, "active"), baseSha: registry.sha },
          ],
          commitMessage(`journal(${id}): ${me} взял направление`, editor, me, `owner: ${me}, state: active в ${REGISTRY_PATH}`)
        );
      }),
      direction
    );
  });
}

// ── helpers ────────────────────────────────────────────────────────────────

async function directionOrThrow(id: string): Promise<Direction> {
  const { registry, direction } = await loadDirection(id);
  if (!registry.ok) throw new Error(`Реестр недоступен: ${registry.error}`);
  if (!direction) throw new Error(`Направления ${id} нет в реестре`);
  return direction;
}

async function withFreshRetry(write: () => ReturnType<typeof commitFiles>) {
  let result = await write();
  if (!result.ok) result = await write();
  return result;
}

function finish(result: Awaited<ReturnType<typeof commitFiles>>, direction: Direction): ActionResult {
  if (!result.ok) return { ok: false, conflict: result.conflicts[0] };
  updateTag(repoCacheTag(DIRECTIONS_REPO));
  revalidatePath(`/directions/${direction.id}`);
  revalidatePath("/directions");
  return { ok: true, commitUrl: result.url };
}

function commitMessage(subject: string, editor: Editor, author: string, extra?: string) {
  const name = author.trim() || editor.email;
  return [subject, "", ...(extra ? [extra, ""] : []), `Через сайт Rubezh Web: ${editor.email}`, "", `Co-authored-by: ${name} <${editor.email}>`].join("\n");
}

async function guard<T>(fn: () => Promise<T>): Promise<T | { ok: false; error: string }> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AccessDenied) return { ok: false, error: e.message };
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function today() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Moscow" });
}

function shortRepo(repo: string) {
  return repo.split("/")[1] ?? repo;
}
