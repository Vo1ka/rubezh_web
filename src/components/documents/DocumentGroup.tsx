import type { DocumentRecord } from "@/lib/documents";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
            <div>
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className={`font-medium hover:underline ${
                  v.is_baseline
                    ? "text-[var(--color-title)]"
                    : "text-[var(--color-secondary-text)]"
                }`}
              >
                {v.version}
              </a>
              <span className="ml-2 text-xs text-[var(--color-body)]">
                {formatDate(v.created_at)}
              </span>
              {v.changelog ? (
                <p className="mt-0.5 text-xs text-[var(--color-body)]">
                  {v.changelog}
                </p>
              ) : null}
            </div>
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
