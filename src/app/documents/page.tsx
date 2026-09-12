"use client";

import { useDocuments } from "@/hooks/useDocuments";
import DocumentGroup from "@/components/documents/DocumentGroup";
import DocumentForm from "@/components/documents/DocumentForm";

export default function DocumentsPage() {
  const { documents, loading, error, configured, createDocument, deleteDocument } =
    useDocuments();

  const groups = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    (acc[doc.doc_key] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">
          Реестр документов
        </h1>
        <p className="mt-1 text-[var(--color-body)]">
          Версии и текущая утверждённая база для Product Definition, Epic Map,
          Game Design Spec, Technical Architecture — каждая роль тянет данные из
          одного места.
        </p>
      </div>

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
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
