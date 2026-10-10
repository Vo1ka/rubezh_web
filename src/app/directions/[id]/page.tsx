import Link from "next/link";
import { notFound } from "next/navigation";
import { loadDirection } from "@/lib/directions/registry";
import { directionFolderUrl, loadCommits, loadJournal, loadStatus } from "@/lib/directions/data";
import { STATUS_SECTIONS } from "@/lib/directions/status";
import { lastHandoff, type JournalEntry } from "@/lib/directions/journal";
import Markdown from "@/components/directions/Markdown";
import { ErrorNote, ExternalLink, FlagBadge, Muted, Panel, StateBadge, formatDate } from "@/components/directions/ui";

const JOURNAL_LIMIT = 10;

// RW-14: everything needed to (re)enter a direction, in the order from the spec:
// STATUS → flags → last handoff → journal → commits. Epics/cards/decisions
// (RW-13) and documents (RW-20) join this page once those land.
export default async function DirectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { registry, direction } = await loadDirection(id);

  if (!registry.ok) {
    return (
      <PageFrame>
        <ErrorNote>Реестр направлений недоступен: {registry.error}</ErrorNote>
      </PageFrame>
    );
  }
  if (!direction) notFound();

  const [status, journal, commits] = await Promise.all([
    loadStatus(direction.id),
    loadJournal(direction.id),
    loadCommits(direction, 10),
  ]);

  const parsed = status.ok && status.value ? status.value.parsed : null;
  const entries = journal.ok && journal.value ? journal.value.entries : [];
  const handoff = lastHandoff(entries);

  const flags: string[] = [];
  if (!status.ok) flags.push("STATUS не прочитан");
  else if (!status.value) flags.push("Нет STATUS");
  else if (parsed && parsed.problems.length > 0) flags.push(`Формат STATUS нарушен: ${parsed.problems.join("; ")}`);

  return (
    <PageFrame>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-title)]">{direction.name}</h1>
          <p className="mt-1 text-sm text-[var(--color-body)]">
            Владелец: {direction.owner ?? "нет"}
            {direction.kind === "cross-cutting" ? " · сквозное направление" : ""}
            {parsed?.frontMatter.updated ? ` · STATUS от ${formatDate(parsed.frontMatter.updated)}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StateBadge state={direction.state} />
          <ExternalLink href={directionFolderUrl(direction.id)}>Папка в репозитории</ExternalLink>
        </div>
      </div>

      {flags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {flags.map((f) => (
            <FlagBadge key={f}>{f}</FlagBadge>
          ))}
        </div>
      ) : null}

      <Panel
        title="Статус"
        action={status.ok && status.value ? <ExternalLink href={status.value.htmlUrl}>STATUS.md</ExternalLink> : null}
      >
        {!status.ok ? (
          <ErrorNote>{status.error}</ErrorNote>
        ) : !parsed ? (
          <Muted>
            Файла directions/{direction.id}/STATUS.md пока нет. Шаблон — в гайде directions/README.md.
          </Muted>
        ) : parsed.problems.length > 0 && parsed.sections.length === 0 ? (
          <Markdown>{parsed.body}</Markdown>
        ) : (
          <div className="flex flex-col gap-4">
            {orderedSections(parsed.sections).map((s) => (
              <div key={s.heading}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-title)]">{s.heading}</h3>
                {s.body ? <Markdown>{s.body}</Markdown> : <Muted>пусто</Muted>}
              </div>
            ))}
            {Object.keys(parsed.frontMatter.reflects).length > 0 ? (
              <p className="text-xs text-[var(--color-body)]/70">
                Учитывает коммиты до:{" "}
                {Object.entries(parsed.frontMatter.reflects)
                  .map(([repo, sha]) => `${repo}@${sha}`)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </Panel>

      {handoff ? (
        <Panel title="Последняя передача" highlight>
          <JournalItem entry={handoff} />
        </Panel>
      ) : null}

      <Panel
        title="Журнал"
        action={journal.ok && journal.value ? <ExternalLink href={journal.value.htmlUrl}>JOURNAL.md</ExternalLink> : null}
      >
        {!journal.ok ? (
          <ErrorNote>{journal.error}</ErrorNote>
        ) : entries.length === 0 ? (
          <Muted>{journal.value ? "Записей пока нет." : `Файла directions/${direction.id}/JOURNAL.md пока нет.`}</Muted>
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
            {entries.slice(0, JOURNAL_LIMIT).map((e, i) => (
              <div key={`${e.heading}-${i}`} className="py-3 first:pt-0 last:pb-0">
                <JournalItem entry={e} />
              </div>
            ))}
            {entries.length > JOURNAL_LIMIT ? (
              <p className="pt-3 text-xs text-[var(--color-body)]/70">
                Показаны последние {JOURNAL_LIMIT} из {entries.length} записей — полный журнал в репозитории.
              </p>
            ) : null}
          </div>
        )}
      </Panel>

      <Panel title="Последние коммиты">
        {!commits.ok ? (
          <ErrorNote>{commits.error}</ErrorNote>
        ) : commits.value.length === 0 ? (
          <Muted>
            {direction.sources.some((s) => s.paths.length > 0)
              ? "Коммитов по путям направления не найдено."
              : "У направления пока нет папок в репозитории (sources пустой)."}
          </Muted>
        ) : (
          <ul className="flex flex-col gap-2">
            {commits.value.map((c) => (
              <li key={c.sha} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <a href={c.url} target="_blank" rel="noreferrer" className="font-mono text-xs underline underline-offset-2">
                  {c.shortSha}
                </a>
                <span className="text-[var(--color-title)]">{c.message}</span>
                <span className="text-xs text-[var(--color-body)]/70">
                  {c.author} · {formatDate(c.date)} · {c.repo.split("/")[1]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PageFrame>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link href="/directions" className="text-sm text-[var(--color-body)] hover:underline">
        ← Все направления
      </Link>
      {children}
    </div>
  );
}

function JournalItem({ entry }: { entry: JournalEntry }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--color-title)]">
        {entry.date ? formatDate(entry.date) : ""}
        {entry.author ? ` · ${entry.author}` : ""}
        {entry.type ? ` · ${entry.type}` : ""}
        {entry.typeDetail ? ` ${entry.typeDetail}` : ""}
      </p>
      {entry.body ? <Markdown>{entry.body}</Markdown> : null}
    </div>
  );
}

// Known sections in the template order first, then anything extra the author added.
function orderedSections(sections: { heading: string; body: string }[]) {
  const rank = (h: string) => {
    const i = (STATUS_SECTIONS as readonly string[]).indexOf(h);
    return i === -1 ? STATUS_SECTIONS.length : i;
  };
  return [...sections].sort((a, b) => rank(a.heading) - rank(b.heading));
}
