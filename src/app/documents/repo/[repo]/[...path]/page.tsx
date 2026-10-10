import Link from "next/link";
import { notFound } from "next/navigation";
import { loadRegistry } from "@/lib/directions/registry";
import { loadRepoDocument } from "@/lib/repoDocuments";
import Markdown from "@/components/directions/Markdown";
import { DirectionTags } from "@/components/directions/DirectionPickers";
import { ErrorNote, ExternalLink, Muted, Panel, formatDate } from "@/components/directions/ui";

// RW-20: read-only view of a document from the repo. The file in git is the
// only copy; edits happen there, history is git history.
export default async function RepoDocumentPage({ params }: { params: Promise<{ repo: string; path: string[] }> }) {
  const { repo, path } = await params;
  const filePath = path.map(decodeURIComponent).join("/");
  const registry = await loadRegistry();

  let doc;
  try {
    doc = await loadRepoDocument(registry.ok ? registry.directions : [], decodeURIComponent(repo), filePath);
  } catch (e) {
    return (
      <Frame>
        <ErrorNote>Документ не загрузился: {e instanceof Error ? e.message : String(e)}</ErrorNote>
      </Frame>
    );
  }
  if (!doc) notFound();
  const last = doc.commits[0];

  return (
    <Frame>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[var(--color-title)]">{doc.title}</h1>
        <p className="font-mono text-xs text-[var(--color-body)]">
          {doc.repo.split("/")[1]}/{doc.path}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-body)]">
          {doc.directions.length > 0 ? <DirectionTags value={doc.directions} /> : <span>общий документ</span>}
          {last ? (
            <span>
              Изменён {formatDate(last.date)} · {last.author}
            </span>
          ) : null}
          <ExternalLink href={doc.githubUrl}>Открыть в GitHub</ExternalLink>
          <ExternalLink href={doc.historyUrl}>История версий</ExternalLink>
        </div>
      </div>

      {doc.text !== null ? (
        <Panel title="Текст">
          <Markdown document>{doc.text}</Markdown>
        </Panel>
      ) : (
        <Muted>Этот формат на сайте не отображается — откройте файл в GitHub.</Muted>
      )}

      <Panel title="Последние изменения">
        <ul className="flex flex-col gap-1.5">
          {doc.commits.map((c) => (
            <li key={c.sha} className="flex flex-wrap items-baseline gap-x-2 text-sm">
              <a href={c.url} target="_blank" rel="noreferrer" className="font-mono text-xs underline underline-offset-2">
                {c.shortSha}
              </a>
              <span className="text-[var(--color-title)]">{c.message}</span>
              <span className="text-xs text-[var(--color-body)]/70">
                {c.author} · {formatDate(c.date)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link href="/documents" className="text-sm text-[var(--color-body)] hover:underline">
        ← Реестр документов
      </Link>
      {children}
    </div>
  );
}
