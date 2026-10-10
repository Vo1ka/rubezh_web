import { loadRegistry } from "@/lib/directions/registry";
import { loadRepoDocuments, type RepoDocument } from "@/lib/repoDocuments";
import RepoDocumentList from "@/components/documents/RepoDocumentList";
import DocumentRegistry from "@/components/documents/DocumentRegistry";
import { ErrorNote, Panel } from "@/components/directions/ui";

// RW-20: documents committed to the repos are listed automatically; the
// hand-kept version registry below stays for documents that predate that.
export default async function DocumentsPage() {
  const registry = await loadRegistry();
  let repoDocs: { ok: true; value: RepoDocument[] } | { ok: false; error: string };
  try {
    repoDocs = { ok: true, value: await loadRepoDocuments(registry.ok ? registry.directions : []) };
  } catch (e) {
    repoDocs = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">Реестр документов</h1>
        <p className="mt-1 text-[var(--color-body)]">
          Документы живут в репозиториях: общие — в <code>docs/</code>, документы направления — в{" "}
          <code>directions/&lt;id&gt;/docs/</code>. Версия документа — его история в git.
        </p>
      </div>

      <Panel title="В репозиториях">
        {repoDocs.ok ? (
          <RepoDocumentList documents={repoDocs.value} />
        ) : (
          <ErrorNote>Список документов из репозиториев недоступен: {repoDocs.error}</ErrorNote>
        )}
      </Panel>

      <Panel title="Версии (ручной реестр)">
        <DocumentRegistry />
      </Panel>
    </div>
  );
}
