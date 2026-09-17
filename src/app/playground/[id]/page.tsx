"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundNotes } from "@/hooks/usePlaygroundNotes";
import { usePlaygroundComments } from "@/hooks/usePlaygroundComments";
import PlaygroundNoteForm from "@/components/playground/PlaygroundNoteForm";
import PlaygroundCommentCard from "@/components/playground/PlaygroundCommentCard";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlaygroundNoteDetailPage() {
  const params = useParams<{ id: string }>();
  const { notes, loading, error, configured } = usePlaygroundNotes();
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    createComment,
    deleteComment,
  } = usePlaygroundComments(params.id);

  if (!configured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Supabase не настроен — playground недоступен.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      </div>
    );
  }

  const note = notes.find((n) => n.id === params.id);

  if (error || !note) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:px-6">
        <Link href="/playground" className="text-sm text-[var(--color-body)] hover:underline">
          ← Назад в Playground
        </Link>
        <p className="text-sm text-[var(--color-title)]">
          {error ? `Ошибка: ${error}` : "Заметка не найдена."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link href="/playground" className="text-sm text-[var(--color-body)] hover:underline">
        ← Назад в Playground
      </Link>

      <div
        className="rounded-lg border bg-[var(--color-secondary-bg)] p-5"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <p className="text-xs text-[var(--color-body)]">
          {note.author ? `${note.author} · ` : ""}
          {formatDateTime(note.created_at)}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {note.content}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-title)]">
          Комментарии{comments.length > 0 ? ` (${comments.length})` : ""}
        </h2>

        <PlaygroundNoteForm
          onSubmit={createComment}
          placeholder="Написать комментарий…"
          submitLabel="Отправить"
          rows={2}
          autoFocus={false}
        />

        {commentsError ? (
          <p className="text-sm text-[var(--color-title)]">Ошибка: {commentsError}</p>
        ) : null}

        {commentsLoading ? (
          <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[var(--color-body)]">Комментариев пока нет.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {comments.map((comment) => (
              <PlaygroundCommentCard
                key={comment.id}
                comment={comment}
                onDelete={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
