"use client";

import { useMeetings } from "@/hooks/useMeetings";
import MeetingCard from "@/components/meetings/MeetingCard";
import MeetingForm from "@/components/meetings/MeetingForm";

export default function MeetingsPage() {
  const { meetings, loading, error, configured, createMeeting, deleteMeeting } =
    useMeetings();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-title)]">
          Встречи
        </h1>
        <p className="mt-1 text-[var(--color-body)]">
          Журнал обсуждений и принятых решений, чтобы ничего не забывалось.
        </p>
      </div>

      {!configured ? (
        <div
          className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          Supabase не настроен — встречи недоступны.
        </div>
      ) : (
        <>
          <MeetingForm onSubmit={createMeeting} />

          {error ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
          ) : meetings.length === 0 ? (
            <p className="text-sm text-[var(--color-body)]">
              Пока нет ни одной зафиксированной встречи.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={deleteMeeting}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
