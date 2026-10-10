import { fetchCommitFiles, fetchCommits, fetchComparison, fetchRepoFile } from "@/lib/github";
import { IGNORED_COMMIT_PATHS, STALENESS } from "./config";
import { directionCommits, type DirectionCommit } from "./commits";
import type { JournalFile, Loaded, StatusFile } from "./data";
import { DIRECTIONS_REPO, REGISTRY_PATH, parseRegistry, type Direction } from "./registry";

// RW-15: deterministic "the description drifted from reality" checks. Nothing
// here writes anywhere — it only reads the repo and turns the result into
// flags for the overview and the direction page.

export type FlagKind = "status-unreadable" | "status-missing" | "status-format" | "status-behind" | "status-old" | "handoff-missing";

export type DirectionFlag = { kind: FlagKind; label: string; detail?: string };

const DAY_MS = 24 * 60 * 60 * 1000;

export async function directionFlags(
  direction: Direction,
  {
    status,
    journal,
    activeCards,
    now = new Date(),
  }: { status: Loaded<StatusFile>; journal: Loaded<JournalFile>; activeCards: number; now?: Date }
): Promise<DirectionFlag[]> {
  const flags: DirectionFlag[] = [];
  const parsed = status.ok && status.value ? status.value.parsed : null;

  if (!status.ok) flags.push({ kind: "status-unreadable", label: "STATUS не прочитан", detail: status.error });
  else if (!status.value) flags.push({ kind: "status-missing", label: "Нет STATUS" });
  else if (parsed && parsed.problems.length > 0) {
    flags.push({ kind: "status-format", label: "Формат STATUS нарушен", detail: parsed.problems.join("; ") });
  }

  const [behind, handoff] = await Promise.all([
    parsed ? statusBehind(direction, parsed.frontMatter.reflects, now) : null,
    handoffMissing(direction, journal),
  ]);
  if (behind) flags.push(behind);

  if (parsed?.frontMatter.updated) {
    const updated = Date.parse(parsed.frontMatter.updated);
    const ageDays = Math.floor((now.getTime() - updated) / DAY_MS);
    const inUse = direction.state === "active" || parsed.frontMatter.state === "active" || activeCards > 0;
    if (!Number.isNaN(updated) && ageDays > STALENESS.maxStatusAgeDays && inUse) {
      flags.push({
        kind: "status-old",
        label: "Статус давно не обновлялся",
        detail: `updated ${ageDays} дн. назад${activeCards > 0 ? `, активных карточек: ${activeCards}` : ""}`,
      });
    }
  }

  if (handoff) flags.push(handoff);
  return flags;
}

// ── «Статус отстал от кода» ─────────────────────────────────────────────────

async function statusBehind(
  direction: Direction,
  reflects: Record<string, string>,
  now: Date
): Promise<DirectionFlag | null> {
  const repos = direction.sources.filter((s) => s.paths.length > 0).map((s) => s.repo);
  if (repos.length === 0) return null;

  const missing = repos.filter((repo) => !reflectedSha(reflects, repo));
  if (missing.length > 0) {
    return {
      kind: "status-behind",
      label: "Статус отстал от кода",
      detail: `в reflects не указан коммит для ${missing.map(shortRepo).join(", ")}`,
    };
  }

  let commits: DirectionCommit[];
  try {
    commits = await directionCommits(direction, 30);
  } catch (e) {
    return { kind: "status-behind", label: "Не удалось проверить отставание", detail: errorText(e) };
  }

  const unaccounted: DirectionCommit[] = [];
  const unknownShas: string[] = [];
  for (const repo of repos) {
    const sha = reflectedSha(reflects, repo)!;
    const comparison = await fetchComparison(repo, sha).catch(() => undefined);
    if (comparison === null) {
      unknownShas.push(`${shortRepo(repo)}@${sha}`);
      continue;
    }
    if (comparison === undefined) continue;
    for (const c of commits) {
      if (c.repo !== repo) continue;
      const ahead = comparison.aheadShas.has(c.sha) || (comparison.truncated && c.date > comparison.baseDate);
      if (ahead && !(await onlyIgnoredPaths(c))) unaccounted.push(c);
    }
  }

  if (unknownShas.length > 0) {
    return {
      kind: "status-behind",
      label: "Статус отстал от кода",
      detail: `коммит из reflects не найден в репозитории: ${unknownShas.join(", ")}`,
    };
  }
  if (unaccounted.length === 0) return null;

  const oldest = unaccounted.reduce((a, b) => (a.date < b.date ? a : b));
  const days = Math.floor((now.getTime() - Date.parse(oldest.date)) / DAY_MS);
  if (unaccounted.length <= STALENESS.maxUnaccountedCommits && days <= STALENESS.maxUnaccountedDays) return null;

  // Only the latest commits per path are fetched; if all of a repo's are unaccounted there may be more.
  const capped = repos.some((repo) => {
    const fetched = commits.filter((c) => c.repo === repo).length;
    return fetched >= 15 && unaccounted.filter((c) => c.repo === repo).length === fetched;
  });
  const count = `${unaccounted.length}${capped ? "+" : ""}`;
  return {
    kind: "status-behind",
    label: "Статус отстал от кода",
    detail: `${count} коммитов после reflects, первый неучтённый — ${days} дн. назад`,
  };
}

/** `reflects` keys are short repo names (`rubezh_full`), but full names are accepted too. */
function reflectedSha(reflects: Record<string, string>, repo: string) {
  return reflects[shortRepo(repo)] ?? reflects[repo];
}

async function onlyIgnoredPaths(c: DirectionCommit) {
  if (c.repo !== DIRECTIONS_REPO) return false;
  const files = await fetchCommitFiles(c.repo, c.sha).catch(() => []);
  return files.length > 0 && files.every((f) => IGNORED_COMMIT_PATHS.test(f));
}

// ── «Передача без записи» ───────────────────────────────────────────────────

export type OwnerChange = { from: string | null; to: string | null; date: string; sha: string };

/**
 * Walks back through the registry's history and returns the most recent
 * commit that changed this direction's owner, or null if the fetched history
 * doesn't contain one (including "the direction was just added").
 */
export async function lastOwnerChange(id: string): Promise<OwnerChange | null> {
  const history = await fetchCommits(DIRECTIONS_REPO, { path: REGISTRY_PATH, perPage: STALENESS.registryHistoryDepth });
  let newer: { owner: string | null; date: string; sha: string } | null = null;
  for (const commit of history) {
    const file = await fetchRepoFile(DIRECTIONS_REPO, REGISTRY_PATH, commit.sha);
    const registry = file ? parseRegistry(file.content) : null;
    // An unparseable revision can't tell us the owner — skip it rather than guess.
    if (registry && !registry.ok) continue;
    const direction = registry?.directions.find((d) => d.id === id);
    if (!direction) return null;
    const owner = direction.owner ?? null;
    if (newer && newer.owner !== owner) return { from: owner, to: newer.owner, date: newer.date, sha: newer.sha };
    newer = { owner, date: commit.date, sha: commit.sha };
  }
  return null;
}

async function handoffMissing(direction: Direction, journal: Loaded<JournalFile>): Promise<DirectionFlag | null> {
  let change: OwnerChange | null;
  try {
    change = await lastOwnerChange(direction.id);
  } catch {
    return null;
  }
  if (!change) return null;

  const changeDay = change.date.slice(0, 10);
  const entries = journal.ok && journal.value ? journal.value.entries : [];
  const recorded = entries.some((e) => e.type === "передача" && e.date >= changeDay);
  if (recorded) return null;

  return {
    kind: "handoff-missing",
    label: "Передача без записи",
    detail: `владелец сменился ${changeDay} (${change.from ?? "нет"} → ${change.to ?? "нет"}), записи «передача» в журнале после этого нет`,
  };
}

function shortRepo(repo: string) {
  return repo.split("/").pop() ?? repo;
}

function errorText(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}
