export const GITHUB_API = "https://api.github.com";

export function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "rubezh-web-app",
  };
}

// RW-0: server-only helpers for reading repo contents. Everything below goes
// through Next's data cache with a short revalidate so a page full of
// directions doesn't burn the GitHub rate limit; immutable lookups (a commit by
// sha) are cached indefinitely.
const CONTENT_REVALIDATE_SECONDS = 120;

export class GitHubError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

function requireToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new GitHubError("GITHUB_TOKEN не настроен на сервере");
  return token;
}

async function githubGet(path: string, revalidate: number | false = CONTENT_REVALIDATE_SECONDS) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: githubHeaders(requireToken()),
    next: { revalidate },
  });
  return res;
}

export type RepoFile = { content: string; sha: string; htmlUrl: string };

/** Reads a text file from `owner/repo`. Returns null if the file doesn't exist. */
export async function fetchRepoFile(repo: string, path: string): Promise<RepoFile | null> {
  const res = await githubGet(`/repos/${repo}/contents/${encodePath(path)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new GitHubError(`GitHub API ${repo}/${path}: ${res.status} ${res.statusText}`, res.status);
  const data = await res.json();
  if (Array.isArray(data) || data.type !== "file") {
    throw new GitHubError(`${repo}/${path} — не файл`);
  }
  return {
    content: Buffer.from(data.content ?? "", "base64").toString("utf8"),
    sha: data.sha,
    htmlUrl: data.html_url,
  };
}

export type RepoCommit = {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

type RawCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author?: { name?: string; date?: string } };
  author?: { login?: string } | null;
  files?: { filename: string }[];
};

function toCommit(c: RawCommit): RepoCommit {
  return {
    sha: c.sha,
    shortSha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name ?? c.author?.login ?? "неизвестно",
    date: c.commit.author?.date ?? "",
    url: c.html_url,
  };
}

/** Latest commits on the default branch, optionally limited to a path prefix. */
export async function fetchCommits(
  repo: string,
  { path, perPage = 20 }: { path?: string; perPage?: number } = {}
): Promise<RepoCommit[]> {
  const query = new URLSearchParams({ per_page: String(perPage) });
  if (path) query.set("path", path);
  const res = await githubGet(`/repos/${repo}/commits?${query}`);
  if (!res.ok) throw new GitHubError(`GitHub API ${repo} commits: ${res.status} ${res.statusText}`, res.status);
  return ((await res.json()) as RawCommit[]).map(toCommit);
}

/** Files touched by a commit. Commits are immutable, so this is cached forever. */
export async function fetchCommitFiles(repo: string, sha: string): Promise<string[]> {
  const res = await githubGet(`/repos/${repo}/commits/${sha}`, false);
  if (!res.ok) throw new GitHubError(`GitHub API ${repo}@${sha}: ${res.status} ${res.statusText}`, res.status);
  const data = (await res.json()) as RawCommit;
  return (data.files ?? []).map((f) => f.filename);
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}
