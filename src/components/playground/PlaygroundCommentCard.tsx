import type { PlaygroundComment } from "@/lib/playground";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlaygroundCommentCard({
  comment,
  onDelete,
}: {
  comment: PlaygroundComment;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-3"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-[var(--color-body)]">
          {comment.author ? `${comment.author} · ` : ""}
          {formatDateTime(comment.created_at)}
        </p>
        <button
          onClick={() => onDelete(comment.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить комментарий"
        >
          ×
        </button>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
        {comment.content}
      </p>
    </div>
  );
}
