"use client";

import Link from "next/link";
import { useState } from "react";
import type { RepoDocument } from "@/lib/repoDocuments";
import { DirectionFilter, DirectionTags, matchesDirection } from "@/components/directions/DirectionPickers";
import { formatDate } from "@/components/directions/ui";

// RW-20: documents indexed from the repos, grouped by repo and folder.
export default function RepoDocumentList({ documents }: { documents: RepoDocument[] }) {
  const [direction, setDirection] = useState("");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = documents.filter(
    (d) =>
      matchesDirection(direction, d.directions) &&
      (!q || d.title.toLowerCase().includes(q) || d.path.toLowerCase().includes(q))
  );

  const groups = new Map<string, RepoDocument[]>();
  for (const d of visible) {
    const key = `${d.repo.split("/")[1]}/${folderOf(d.path)}`;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  const sortedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или пути"
          className="min-w-0 flex-1 rounded-md border bg-[var(--color-secondary-bg)] px-3 py-1.5 text-sm text-[var(--color-secondary-text)] placeholder:text-[var(--color-body)]"
          style={{ borderColor: "var(--color-secondary-border)" }}
        />
        <DirectionFilter value={direction} onChange={setDirection} />
      </div>

      {sortedGroups.length === 0 ? (
        <p className="text-sm text-[var(--color-body)]">Ничего не найдено.</p>
      ) : (
        sortedGroups.map(([folder, docs]) => (
          <div key={folder}>
            <h3 className="mb-1.5 font-mono text-xs text-[var(--color-body)]">{folder}/</h3>
            <ul className="flex flex-col gap-1.5">
              {docs
                .sort((a, b) => a.path.localeCompare(b.path))
                .map((d) => (
                  <li key={`${d.repo}:${d.path}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    <Link href={d.href} className="font-medium text-[var(--color-title)] hover:underline">
                      {d.title}
                    </Link>
                    <DirectionTags value={d.directions} emptyLabel="общий" />
                    <span className="text-xs text-[var(--color-body)]/70">
                      {d.lastCommit ? `${formatDate(d.lastCommit.date)} · ${d.lastCommit.author} · ` : ""}
                      <a href={d.historyUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        история
                      </a>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

/** `docs/design/combat/x.md` → `docs/design/combat`. */
function folderOf(path: string) {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}
