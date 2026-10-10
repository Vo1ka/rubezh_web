import Link from "next/link";
import type { RepoDocument } from "@/lib/repoDocuments";
import type { DocumentRecord } from "@/lib/documents";
import { sourceLinks } from "@/lib/documents";
import type { Loaded } from "@/lib/directions/data";
import { directionFolderUrl } from "@/lib/directions/data";
import { ErrorNote, ExternalLink, Muted, Panel, formatDate } from "./ui";

// RW-20 on the direction page: documents from the repo (by folder or the
// registry's paths) plus hand-registry entries tagged with the direction.
export default function DirectionDocumentsPanel({
  id,
  repoDocs,
  registryDocs,
}: {
  id: string;
  repoDocs: Loaded<RepoDocument[]>;
  registryDocs: Loaded<DocumentRecord[]>;
}) {
  const repo = repoDocs.ok ? [...repoDocs.value].sort((a, b) => (b.lastCommit?.date ?? "").localeCompare(a.lastCommit?.date ?? "")) : [];
  // One row per document key: the baseline version if there is one, else the newest.
  const registry = registryDocs.ok
    ? Object.values(
        registryDocs.value.reduce<Record<string, DocumentRecord>>((acc, d) => {
          const current = acc[d.doc_key];
          if (!current || (d.is_baseline && !current.is_baseline)) acc[d.doc_key] = d;
          return acc;
        }, {})
      )
    : [];

  return (
    <Panel title="Документы" action={<ExternalLink href={`${directionFolderUrl(id)}/docs`}>docs/ направления</ExternalLink>}>
      {!repoDocs.ok ? <ErrorNote>{repoDocs.error}</ErrorNote> : null}
      {!registryDocs.ok ? <ErrorNote>{registryDocs.error}</ErrorNote> : null}
      {repo.length === 0 && registry.length === 0 ? (
        <Muted>Документов пока нет. Положите их в directions/{id}/docs/ — они появятся здесь сами.</Muted>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {repo.map((d) => (
            <li key={`${d.repo}:${d.path}`} className="text-sm">
              <Link href={d.href} className="text-[var(--color-title)] hover:underline">
                {d.title}
              </Link>
              <span className="ml-1.5 text-xs text-[var(--color-body)]/70">
                {d.repo.split("/")[1]}/{d.path}
                {d.lastCommit ? ` · ${formatDate(d.lastCommit.date)}` : ""}
              </span>
            </li>
          ))}
          {registry.map((d) => (
            <li key={d.id} className="text-sm">
              {d.source_path ? (
                <Link href={sourceLinks(d.source_path).href} className="text-[var(--color-title)] hover:underline">
                  {d.title}
                </Link>
              ) : (
                <a href={d.url} target="_blank" rel="noreferrer" className="text-[var(--color-title)] hover:underline">
                  {d.title}
                </a>
              )}
              <span className="ml-1.5 text-xs text-[var(--color-body)]/70">
                реестр · {d.version}
                {d.is_baseline ? " · baseline" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
