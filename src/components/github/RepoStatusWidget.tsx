"use client";

import { useEffect, useState } from "react";

type RepoStatus = {
  label: string;
  owner: string;
  repo: string;
  url: string;
  description: string | null;
  defaultBranch: string;
  openIssues: number;
  openPullRequests: number;
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: string;
  } | null;
  error?: string;
};

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RepoStatusWidget() {
  const [repos, setRepos] = useState<RepoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/github/repos")
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Не удалось получить данные GitHub");
        } else {
          setRepos(data.repos ?? []);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--color-body)]">Загрузка репозиториев…</p>;
  }

  if (error) {
    return (
      <div
        className="rounded-lg border p-4 text-sm text-[var(--color-body)]"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {repos.map((r) => (
        <a
          key={`${r.owner}/${r.repo}`}
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border bg-[var(--color-secondary-bg)] p-4 transition-opacity hover:opacity-90"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-title)]">
              {r.label}
            </h3>
            <span className="text-xs text-[var(--color-body)]">
              {r.defaultBranch}
            </span>
          </div>

          {r.error ? (
            <p className="mt-2 text-sm text-[var(--color-body)]">{r.error}</p>
          ) : (
            <>
              {r.description ? (
                <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
                  {r.description}
                </p>
              ) : null}

              {r.lastCommit ? (
                <p className="mt-3 text-xs text-[var(--color-body)]">
                  <span className="font-mono">{r.lastCommit.sha}</span>{" "}
                  {r.lastCommit.message} — {r.lastCommit.author},{" "}
                  {formatDate(r.lastCommit.date)}
                </p>
              ) : null}

              <div className="mt-3 flex gap-3 text-xs text-[var(--color-body)]">
                <span>PR открыто: {r.openPullRequests}</span>
                <span>Issues: {r.openIssues}</span>
              </div>
            </>
          )}
        </a>
      ))}
    </div>
  );
}
