import { fetchBlobText, fetchCommits, fetchRepoFile, fetchTree, type RepoCommit } from "@/lib/github";
import { DIRECTIONS_REPO, type Direction } from "@/lib/directions/registry";
import { globToRegExp } from "@/lib/directions/commits";

// RW-20: documents live in the repos — `docs/**` for project-wide ones and
// `directions/<id>/docs/**` for a direction's. The site indexes them instead
// of keeping uploaded copies; a document's version is its git history.

/** Last-commit lookups are one request per file, so they refresh less often than the tree. */
const LAST_COMMIT_REVALIDATE_SECONDS = 600;
const DOCUMENT_EXTENSIONS = /\.(md|markdown|txt|pdf|docx?|xlsx?|pptx?)$/i;
const DIRECTION_DOCS = /^directions\/([^/]+)\/docs\//;

export type RepoDocument = {
  repo: string;
  path: string;
  title: string;
  /** Direction ids: from the `directions/<id>/docs/` folder, else from the registry's `sources` globs. */
  directions: string[];
  lastCommit: RepoCommit | null;
  isMarkdown: boolean;
  href: string;
  githubUrl: string;
  historyUrl: string;
};

export function isDocumentPath(path: string) {
  return (path.startsWith("docs/") || DIRECTION_DOCS.test(path)) && DOCUMENT_EXTENSIONS.test(path);
}

/** Repos to index: the one with the registry plus every repo a direction points at. */
export function documentRepos(directions: Direction[]) {
  return [...new Set([DIRECTIONS_REPO, ...directions.flatMap((d) => d.sources.map((s) => s.repo))])];
}

export async function loadRepoDocuments(directions: Direction[]): Promise<RepoDocument[]> {
  const perRepo = await Promise.all(
    documentRepos(directions).map(async (repo) => {
      const files = (await fetchTree(repo)).filter((f) => isDocumentPath(f.path));
      return Promise.all(
        files.map(async (f): Promise<RepoDocument> => {
          const isMarkdown = /\.(md|markdown)$/i.test(f.path);
          const [text, commits] = await Promise.all([
            isMarkdown ? fetchBlobText(repo, f.sha).catch(() => null) : null,
            fetchCommits(repo, { path: f.path, perPage: 1, revalidate: LAST_COMMIT_REVALIDATE_SECONDS }).catch(() => []),
          ]);
          return {
            repo,
            path: f.path,
            title: (text && markdownTitle(text)) || fileTitle(f.path),
            directions: documentDirections(repo, f.path, directions),
            lastCommit: commits[0] ?? null,
            isMarkdown,
            ...documentLinks(repo, f.path),
          };
        })
      );
    })
  );
  return perRepo.flat();
}

export function documentDirections(repo: string, path: string, directions: Direction[]) {
  const folder = repo === DIRECTIONS_REPO ? path.match(DIRECTION_DOCS)?.[1] : undefined;
  if (folder) return [folder];
  return directions
    .filter((d) => d.sources.some((s) => s.repo === repo && s.paths.some((g) => globToRegExp(g).test(path))))
    .map((d) => d.id);
}

export function documentLinks(repo: string, path: string) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return {
    href: `/documents/repo/${repo.split("/")[1]}/${encoded}`,
    githubUrl: `https://github.com/${repo}/blob/HEAD/${encoded}`,
    historyUrl: `https://github.com/${repo}/commits/HEAD/${encoded}`,
  };
}

/** A single document for the read-only view; null when it isn't an indexed document. */
export async function loadRepoDocument(directions: Direction[], repoName: string, path: string) {
  const repo = documentRepos(directions).find((r) => r.split("/")[1] === repoName);
  if (!repo || !isDocumentPath(path)) return null;
  const isMarkdown = /\.(md|markdown)$/i.test(path);
  const [file, commits] = await Promise.all([
    isMarkdown ? fetchRepoFile(repo, path) : Promise.resolve(undefined),
    fetchCommits(repo, { path, perPage: 5, revalidate: LAST_COMMIT_REVALIDATE_SECONDS }),
  ]);
  if (file === null || commits.length === 0) return null;
  return {
    repo,
    path,
    text: file?.content ?? null,
    title: (file && markdownTitle(file.content)) || fileTitle(path),
    directions: documentDirections(repo, path, directions),
    commits,
    ...documentLinks(repo, path),
  };
}

function markdownTitle(text: string) {
  return text.match(/^#\s+(.+)$/m)?.[1].trim() ?? null;
}

function fileTitle(path: string) {
  return (path.split("/").pop() ?? path).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
}
