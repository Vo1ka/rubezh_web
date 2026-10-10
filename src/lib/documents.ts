export const DOC_KEY_PRESETS = [
  "product-definition",
  "epic-map",
  "game-design-spec",
  "technical-architecture",
  "development-plan",
] as const;

export type DocumentRecord = {
  id: string;
  doc_key: string;
  title: string;
  version: string;
  url: string;
  changelog: string | null;
  is_baseline: boolean;
  directions: string[];
  /** RW-20: `<repo>/<path>` of the canonical file, e.g. `rubezh_full/docs/product/PD.md`. */
  source_path: string | null;
  created_at: string;
};

export type NewDocumentInput = {
  doc_key: string;
  title: string;
  version: string;
  url: string;
  changelog?: string;
  is_baseline: boolean;
  directions: string[];
  source_path?: string;
};

/** Owner of the project repos — `source_path` names the repo without it. */
export const REPO_OWNER = "Vo1ka";

/** `rubezh_full/docs/x.md` → the site's read-only view and the GitHub link. */
export function sourceLinks(sourcePath: string) {
  const [repo, ...rest] = sourcePath.replace(/^\/+/, "").split("/");
  const encoded = rest.map(encodeURIComponent).join("/");
  return {
    href: `/documents/repo/${repo}/${encoded}`,
    githubUrl: `https://github.com/${REPO_OWNER}/${repo}/blob/HEAD/${encoded}`,
  };
}

/**
 * The engineering decision log (D-xx) is mastered in mine_boevka (RW-20).
 * /decisions keeps product and cross-cutting decisions and links here by number.
 */
export const ENGINEERING_DECISIONS_LOG = "mine_boevka/docs/decisions/sprint-0-decisions.md";

/** Link to one D-xx entry; the document view anchors `D-38. …` headings as `#d-38`. */
export function engineeringDecisionHref(number: string) {
  return `${sourceLinks(ENGINEERING_DECISIONS_LOG).href}#d-${number}`;
}
