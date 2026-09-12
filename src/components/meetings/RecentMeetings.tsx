"use client";

import Link from "next/link";
import { useMeetings } from "@/hooks/useMeetings";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export default function RecentMeetings() {
  const { meetings, loading, configured } = useMeetings(3);

  if (!configured) return null;

  return (
    <div
      className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-title)]">
          Последние встречи
        </h2>
        <Link
          href="/meetings"
          className="text-sm text-[var(--color-body)] hover:underline"
        >
          Все встречи →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : meetings.length === 0 ? (
        <p className="text-sm text-[var(--color-body)]">
          Пока нет зафиксированных встреч.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="text-sm">
              <span className="text-[var(--color-secondary-text)]">
                {meeting.title}
              </span>
              <span className="ml-2 text-xs text-[var(--color-body)]">
                {formatDate(meeting.meeting_date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
