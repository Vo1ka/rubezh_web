"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getAccessToken, setAccessToken } from "@/lib/accessCookie";

type ViewState =
  | { kind: "checking" }
  | { kind: "form" }
  | { kind: "pending" }
  | { kind: "denied" }
  | { kind: "approved" }
  | { kind: "error"; message: string };

export default function RequestAccessPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>({ kind: "checking" });
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkStatus = async () => {
    const token = getAccessToken();
    if (!token || !supabase) {
      setView({ kind: "form" });
      return;
    }
    const { data, error } = await supabase.rpc("check_access_status", { p_token: token });
    if (error || !data) {
      setView({ kind: "form" });
      return;
    }
    if (data === "approved") {
      setView({ kind: "approved" });
      router.replace("/");
    } else if (data === "denied") {
      setView({ kind: "denied" });
    } else {
      setView({ kind: "pending" });
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .rpc("request_or_resume_access", { p_email: email.trim() })
      .single();
    setSubmitting(false);
    if (error || !data) {
      setView({ kind: "error", message: error?.message ?? "Не удалось отправить заявку." });
      return;
    }
    const result = data as { token: string; status: string };
    setAccessToken(result.token);
    if (result.status === "approved") {
      setView({ kind: "approved" });
      router.replace("/");
    } else if (result.status === "denied") {
      setView({ kind: "denied" });
    } else {
      setView({ kind: "pending" });
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-[var(--color-body)]">Supabase не настроен.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-title)]">Rubezh Web</h1>
        <p className="mt-1 text-sm text-[var(--color-body)]">Доступ только по подтверждённой заявке.</p>
      </div>

      {view.kind === "checking" ? (
        <p className="text-sm text-[var(--color-body)]">Проверяю доступ…</p>
      ) : view.kind === "approved" ? (
        <p className="text-sm text-[var(--color-body)]">Доступ подтверждён, открываю сайт…</p>
      ) : view.kind === "pending" ? (
        <div
          className="flex w-full flex-col gap-3 rounded-lg border bg-[var(--color-secondary-bg)] p-5"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <p className="text-sm text-[var(--color-secondary-text)]">
            Заявка отправлена и ждёт подтверждения. Как только доступ откроют, вернитесь по этой же
            ссылке.
          </p>
          <button
            onClick={checkStatus}
            className="self-center rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90"
          >
            Проверить ещё раз
          </button>
        </div>
      ) : view.kind === "denied" ? (
        <p className="text-sm text-[var(--color-title)]">В доступе отказано.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 rounded-lg border bg-[var(--color-secondary-bg)] p-5"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          {view.kind === "error" ? (
            <p className="text-sm text-[var(--color-title)]">Ошибка: {view.message}</p>
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border bg-[var(--color-surface-bg)] px-3 py-2 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]"
            style={{ borderColor: "var(--color-secondary-border)" }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-[var(--color-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--color-primary-text)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Отправляю…" : "Запросить доступ"}
          </button>
        </form>
      )}
    </div>
  );
}
