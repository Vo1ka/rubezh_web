"use client";

import { useDocuments } from "@/hooks/useDocuments";
import DocumentGroup from "@/components/documents/DocumentGroup";
import DocumentForm from "@/components/documents/DocumentForm";

// Hand-maintained registry of document versions (Supabase). New entries point
// at a file in the repo (RW-20); older ones keep their external links.
export default function DocumentRegistry() {
  const { documents, loading, error, configured, createDocument, deleteDocument, updateDirections } =
    useDocuments();

  const groups = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    (acc[doc.doc_key] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {!configured ? (
        <div
          className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          Supabase не настроен — реестр недоступен.
        </div>
      ) : (
        <>
          <DocumentForm onSubmit={createDocument} />

          {error ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : Object.keys(groups).length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">
              Пока нет ни одного документа в реестре.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(groups).map(([docKey, versions]) => (
                <DocumentGroup
                  key={docKey}
                  docKey={docKey}
                  versions={versions}
                  onDelete={deleteDocument}
                  onChangeDirections={updateDirections}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
