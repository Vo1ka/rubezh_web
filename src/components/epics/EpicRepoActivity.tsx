"use client";

import { useEffect, useState } from "react";
import { useEpicRepos } from "@/hooks/useEpicRepos";
import type { EpicRepoLink } from "@/lib/epicRepos";
import type { EpicActivityResponse } from "@/app/api/github/activity/route";

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RepoLinkCard({ link }: { link: EpicRepoLink }) {
  const [data, setData] = useState<EpicActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ owner: link.repo_owner, repo: link.repo_name });
    if (link.path) params.set("path", link.path);

    fetch(`/api/github/activity?${params.toString()}`)
      .then((res) => res.json())
      .then((body: EpicActivityResponse) => {
        if (!cancelled) setData(body);
      })
      .catch((e) => {
        if (!cancelled) setData({ repoUrl: "", pathUrl: "", defaultBranch: "", commits: [], error: String(e) });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [link.repo_owner, link.repo_name, link.path]);

  const title = link.label ?? `${link.repo_owner}/${link.repo_name}${link.path ? `/${link.path}` : ""}`;

  return (
    <div
      className="rounded-lg border bg-[var(--color-secondary-bg)] p-4"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <a
        href={data?.pathUrl || `https://github.com/${link.repo_owner}/${link.repo_name}`}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[var(--color-title)] hover:underline"
      >
        {title}
      </a>

      {loading ? (
        <p className="mt-2 text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : data?.error ? (
        <p className="mt-2 text-sm text-[var(--color-body)]">{data.error}</p>
      ) : data && data.commits.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1.5">
          {data.commits.map((c) => (
            <li key={c.sha} className="text-xs text-[var(--color-body)]">
              <a href={c.url} target="_blank" rel="noreferrer" className="font-mono hover:underline">
                {c.sha}
              </a>{" "}
              {c.message} — {c.author}, {formatDate(c.date)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-[var(--color-body)]">Коммитов по этому пути пока нет.</p>
      )}
    </div>
  );
}

export default function EpicRepoActivity({ epicId }: { epicId: string }) {
  const { links, loading } = useEpicRepos(epicId);

  if (loading || links.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-body)]">
        Активность в коде
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <RepoLinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
