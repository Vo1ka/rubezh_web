import { fetchCommitFiles, fetchCommits, type RepoCommit } from "@/lib/github";
import type { Direction } from "./registry";

// RW-14: commits that belong to a direction, by the globs in its `sources`.
// The GitHub API filters by a plain path prefix only, so each glob is split
// into its literal prefix (queried directly) and, when the glob has wildcards
// past the prefix (`data/**/weapon_profile/**`), candidates are checked
// against the real file list of each commit.

export type DirectionCommit = RepoCommit & { repo: string };

const PER_QUERY = 15;

export async function directionCommits(direction: Direction, limit = 10): Promise<DirectionCommit[]> {
  const perSource = await Promise.all(
    direction.sources.map(async ({ repo, paths }) => {
      if (paths.length === 0) return [];
      const commits = await commitsForGlobs(repo, paths);
      return commits.map((c) => ({ ...c, repo }));
    })
  );
  return dedupe(perSource.flat())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

async function commitsForGlobs(repo: string, globs: string[]): Promise<RepoCommit[]> {
  const plan = globs.map((glob) => {
    const prefix = literalPrefix(glob);
    // `prefix/**` (or a plain file path) is matched exactly by the API path filter.
    const exact = glob === prefix || glob === `${prefix}/**` || (prefix === "" && glob === "**");
    return { glob, prefix, exact };
  });

  const results = await Promise.all(
    plan.map(async ({ prefix, exact, glob }) => {
      const commits = await fetchCommits(repo, { path: prefix || undefined, perPage: PER_QUERY });
      if (exact) return commits;
      const matcher = globToRegExp(glob);
      const checked = await Promise.all(
        commits.map(async (c) => ((await fetchCommitFiles(repo, c.sha)).some((f) => matcher.test(f)) ? c : null))
      );
      return checked.filter((c): c is RepoCommit => c !== null);
    })
  );
  return dedupe(results.flat());
}

function literalPrefix(glob: string) {
  const segments = glob.split("/");
  const literal: string[] = [];
  for (const seg of segments) {
    if (/[*?[{]/.test(seg)) break;
    literal.push(seg);
  }
  return literal.join("/");
}

export function globToRegExp(glob: string) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === "*" && glob[i + 1] === "*") {
      // `**/` matches zero or more directories; a trailing `**` matches anything.
      if (glob[i + 2] === "/") {
        re += "(?:.*/)?";
        i += 2;
      } else {
        re += ".*";
        i += 1;
      }
    } else if (ch === "*") {
      re += "[^/]*";
    } else if (ch === "?") {
      re += "[^/]";
    } else {
      re += ch.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`);
}

function dedupe<T extends { sha: string }>(commits: T[]) {
  const seen = new Set<string>();
  return commits.filter((c) => (seen.has(c.sha) ? false : (seen.add(c.sha), true)));
}
