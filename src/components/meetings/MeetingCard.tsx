import type { Meeting } from "@/lib/meetings";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MeetingCard({
  meeting,
  onDelete,
}: {
  meeting: Meeting;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="group rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[var(--color-title)]">
            {meeting.title}
          </h3>
          <p className="text-xs text-[var(--color-body)]">
            {formatDate(meeting.meeting_date)}
            {meeting.attendees ? ` · ${meeting.attendees}` : ""}
          </p>
        </div>
        <button
          onClick={() => onDelete(meeting.id)}
          className="text-[var(--color-body)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          aria-label="Удалить встречу"
        >
          ×
        </button>
      </div>

      {meeting.summary ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--color-secondary-text)]">
          {meeting.summary}
        </p>
      ) : null}

      {meeting.decisions ? (
        <div
          className="mt-3 rounded-md border-l-4 bg-[var(--color-surface-bg)]/30 px-3 py-2 text-sm text-[var(--color-secondary-text)]"
          style={{ borderColor: "var(--color-forest-600)" }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-title)]">
            Решения
          </p>
          <p className="whitespace-pre-wrap">{meeting.decisions}</p>
        </div>
      ) : null}
    </div>
  );
}
