import type { DocumentRecord } from "@/lib/documents";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toRawUrl(url: string) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
  if (m) {
    const [, owner, repo, rest] = m;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`;
  }
  return url;
}

function filenameFromUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    const last = pathname.split("/").filter(Boolean).pop();
    return last || "document";
  } catch {
    return "document";
  }
}

async function downloadDocument(doc: DocumentRecord) {
  const rawUrl = toRawUrl(doc.url);
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filenameFromUrl(doc.url);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Not everything in this registry is a raw-downloadable file (e.g. a Notion/Google
    // Docs link) — fall back to just opening it.
    window.open(doc.url, "_blank", "noopener,noreferrer");
  }
}

export default function DocumentGroup({
  docKey,
  versions,
  onDelete,
}: {
  docKey: string;
  versions: DocumentRecord[];
  onDelete: (id: string) => void;
}) {
  const baseline = versions.find((v) => v.is_baseline);
  const title = versions[0]?.title ?? docKey;

  return (
    <div
      className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-title)]">{title}</h3>
        {baseline ? (
          <span className="rounded bg-[var(--color-primary-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-text)]">
            baseline: {baseline.version}
          </span>
        ) : (
          <span className="text-xs text-[var(--color-body)]">
            нет утверждённой версии
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {versions.map((v) => (
          <li
            key={v.id}
            className="group flex items-start justify-between gap-3 text-sm"
          >
            <button
              type="button"
              onClick={() => downloadDocument(v)}
              className="flex-1 rounded text-left transition-colors hover:bg-[var(--color-surface-bg)]"
              title="Скачать документ"
            >
              <span
                className={`font-medium group-hover:underline ${
                  v.is_baseline
                    ? "text-[var(--color-title)]"
                    : "text-[var(--color-secondary-text)]"
                }`}
              >
                ⭳ {v.version}
              </span>
              <span className="ml-2 text-xs text-[var(--color-body)]">
                {formatDate(v.created_at)}
              </span>
              {v.changelog ? (
                <p className="mt-0.5 text-xs text-[var(--color-body)]">
                  {v.changelog}
                </p>
              ) : null}
            </button>
            <button
              onClick={() => onDelete(v.id)}
              className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
              aria-label="Удалить версию"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
