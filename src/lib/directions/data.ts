import { fetchRepoFile } from "@/lib/github";
import { DIRECTIONS_REPO, directionFilePath, type Direction } from "./registry";
import { parseStatus, type ParsedStatus } from "./status";
import { parseJournal, type JournalEntry } from "./journal";
import { directionCommits, type DirectionCommit } from "./commits";

// Each piece is loaded independently so one failing GitHub call shows up as an
// error on its own block instead of taking the whole page down.
export type Loaded<T> = { ok: true; value: T } | { ok: false; error: string };

export type StatusFile = { parsed: ParsedStatus; htmlUrl: string } | null;
export type JournalFile = { entries: JournalEntry[]; htmlUrl: string } | null;

export async function loadStatus(id: string): Promise<Loaded<StatusFile>> {
  return attempt(async () => {
    const file = await fetchRepoFile(DIRECTIONS_REPO, directionFilePath(id, "STATUS.md"));
    return file ? { parsed: parseStatus(file.content), htmlUrl: file.htmlUrl } : null;
  });
}

export async function loadJournal(id: string): Promise<Loaded<JournalFile>> {
  return attempt(async () => {
    const file = await fetchRepoFile(DIRECTIONS_REPO, directionFilePath(id, "JOURNAL.md"));
    return file ? { entries: parseJournal(file.content), htmlUrl: file.htmlUrl } : null;
  });
}

export async function loadCommits(direction: Direction, limit?: number): Promise<Loaded<DirectionCommit[]>> {
  return attempt(() => directionCommits(direction, limit));
}

async function attempt<T>(fn: () => Promise<T>): Promise<Loaded<T>> {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function directionFolderUrl(id: string) {
  return `https://github.com/${DIRECTIONS_REPO}/tree/HEAD/directions/${id}`;
}
