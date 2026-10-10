import { GITHUB_API, GitHubError, githubHeaders } from "@/lib/github";

// RW-16: the only place the site writes to a repository. Every write is one
// commit made through the Git Data API, so a handoff (journal + registry) can
// land atomically. Two guards are not optional:
//  - a path whitelist, because the token itself can write anywhere;
//  - optimistic concurrency: each file carries the blob sha the editor started
//    from, and a mismatch is reported back as a conflict instead of overwriting.

const WRITABLE = [/^directions\.yaml$/, /^directions\/[a-z0-9_-]+\/[^/]+\.md$/];

export function isWritablePath(path: string) {
  return !path.split("/").some((seg) => seg === ".." || seg === ".") && WRITABLE.some((re) => re.test(path));
}

export type FileWrite = {
  path: string;
  content: string;
  /** Blob sha the change is based on; null = the file must not exist yet. */
  baseSha: string | null;
};

export type FileConflict = { path: string; currentContent: string | null; currentSha: string | null };

export type CommitResult =
  | { ok: true; sha: string; url: string }
  | { ok: false; conflicts: FileConflict[] };

export async function commitFiles(repo: string, files: FileWrite[], message: string): Promise<CommitResult> {
  const denied = files.filter((f) => !isWritablePath(f.path));
  if (denied.length > 0) {
    throw new GitHubError(`Запись вне directions/** запрещена: ${denied.map((f) => f.path).join(", ")}`, 403);
  }

  const branch = await defaultBranch(repo);
  // The branch can move between reading the head and updating the ref; the
  // ref update is fast-forward only, so that race is retried, not lost.
  for (let attempt = 0; attempt < 3; attempt++) {
    const head = await gh<{ object: { sha: string } }>(repo, "GET", `/git/ref/heads/${branch}`);
    const headCommit = await gh<{ tree: { sha: string } }>(repo, "GET", `/git/commits/${head.object.sha}`);

    const conflicts: FileConflict[] = [];
    for (const f of files) {
      const current = await blobAt(repo, head.object.sha, f.path);
      if ((current?.sha ?? null) !== f.baseSha) {
        conflicts.push({ path: f.path, currentSha: current?.sha ?? null, currentContent: current?.content ?? null });
      }
    }
    if (conflicts.length > 0) return { ok: false, conflicts };

    const tree = await gh<{ sha: string }>(repo, "POST", "/git/trees", {
      base_tree: headCommit.tree.sha,
      tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.content })),
    });
    const commit = await gh<{ sha: string; html_url: string }>(repo, "POST", "/git/commits", {
      message,
      tree: tree.sha,
      parents: [head.object.sha],
    });
    const res = await call(repo, "PATCH", `/git/refs/heads/${branch}`, { sha: commit.sha, force: false });
    if (res.ok) return { ok: true, sha: commit.sha, url: commit.html_url };
    if (res.status !== 422) throw new GitHubError(`GitHub API ${repo} update ref: ${res.status}`, res.status);
  }
  throw new GitHubError("Ветка всё время меняется — попробуйте сохранить ещё раз");
}

async function defaultBranch(repo: string) {
  return (await gh<{ default_branch: string }>(repo, "GET", "")).default_branch;
}

async function blobAt(repo: string, ref: string, path: string) {
  const res = await call(repo, "GET", `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${ref}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new GitHubError(`GitHub API ${repo}/${path}: ${res.status}`, res.status);
  const data = (await res.json()) as { sha: string; content?: string };
  return { sha: data.sha, content: Buffer.from(data.content ?? "", "base64").toString("utf8") };
}

async function gh<T>(repo: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(repo, method, path, body);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GitHubError(`GitHub API ${method} ${repo}${path}: ${res.status} ${detail.slice(0, 200)}`, res.status);
  }
  return (await res.json()) as T;
}

function call(repo: string, method: string, path: string, body?: unknown) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new GitHubError("GITHUB_TOKEN не настроен на сервере");
  return fetch(`${GITHUB_API}/repos/${repo}${path}`, {
    method,
    headers: { ...githubHeaders(token), ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}
