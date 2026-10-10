import Link from "next/link";
import { loadRegistry, REGISTRY_PATH, type Direction } from "@/lib/directions/registry";
import { loadCommits, loadJournal, loadStatus } from "@/lib/directions/data";
import { statusSection } from "@/lib/directions/status";
import { loadDirectionCounts, type DirectionCounts } from "@/lib/directions/tracker";
import { directionFlags } from "@/lib/directions/staleness";
import { ErrorNote, ExternalLink, FlagBadge, Muted, StateBadge, formatDate } from "@/components/directions/ui";

// RW-14: the site's entry point — one row per direction from the registry.
export default async function DirectionsPage() {
  const [registry, counts] = await Promise.all([loadRegistry(), loadDirectionCounts()]);
  const c: DirectionCounts = counts.ok ? counts.value : { blocking: {}, activeCards: {}, untagged: { epics: 0, notes: 0 } };
  const untagged = c.untagged.epics + c.untagged.notes;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-title)]">Направления</h1>
          <p className="mt-1 text-[var(--color-body)]">
            Выберите направление — статус, журнал и последние коммиты на одной странице.
          </p>
        </div>
        {registry.fileUrl ? <ExternalLink href={registry.fileUrl}>{REGISTRY_PATH} в репозитории</ExternalLink> : null}
      </div>

      {untagged > 0 ? (
        <p className="text-sm text-[var(--color-body)]">
          ⚠ Без направления: <Link href="/epics" className="underline underline-offset-2">Epic — {c.untagged.epics}</Link>, карточек
          Kanban — {c.untagged.notes}. Отметьте направление, иначе эта работа не видна на страницах направлений.
        </p>
      ) : null}

      {registry.ok ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registry.directions.map((d) => (
            <DirectionCard
              key={d.id}
              direction={d}
              blockingQuestions={c.blocking[d.id] ?? 0}
              activeCards={c.activeCards[d.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <ErrorNote>Реестр направлений недоступен: {registry.error}</ErrorNote>
      )}
    </div>
  );
}

async function DirectionCard({
  direction,
  blockingQuestions,
  activeCards,
}: {
  direction: Direction;
  blockingQuestions: number;
  activeCards: number;
}) {
  const [status, journal, commits] = await Promise.all([
    loadStatus(direction.id),
    loadJournal(direction.id),
    loadCommits(direction, 1),
  ]);
  const flags = await directionFlags(direction, { status, journal, activeCards });
  const parsed = status.ok && status.value ? status.value.parsed : null;
  const summary = parsed ? statusSection(parsed, "Коротко") : null;
  const lastCommit = commits.ok ? commits.value[0] : undefined;
  const hasSources = direction.sources.some((s) => s.paths.length > 0);

  return (
    <Link
      href={`/directions/${direction.id}`}
      className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-[var(--color-surface-bg)]/40"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-[var(--color-title)]">{direction.name}</h2>
          <p className="text-xs text-[var(--color-body)]/70">
            {direction.owner ?? "без владельца"}
            {direction.kind === "cross-cutting" ? " · сквозное" : ""}
          </p>
        </div>
        <StateBadge state={direction.state} />
      </div>

      {summary ? (
        <p className="line-clamp-3 text-sm text-[var(--color-body)]">{summary}</p>
      ) : (
        <Muted>{parsed ? "Секция «Коротко» пуста" : "—"}</Muted>
      )}

      <div className="flex flex-wrap gap-1.5">
        {flags.map((f) => (
          <FlagBadge key={f.kind} title={f.detail}>
            {f.label}
          </FlagBadge>
        ))}
        {blockingQuestions > 0 ? <FlagBadge>Блокирующих вопросов: {blockingQuestions}</FlagBadge> : null}
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-2 text-xs text-[var(--color-body)]">
        <div>
          <dt className="opacity-70">STATUS обновлён</dt>
          <dd>{parsed?.frontMatter.updated ? formatDate(parsed.frontMatter.updated) : "—"}</dd>
        </div>
        <div>
          <dt className="opacity-70">Последний коммит</dt>
          <dd>{lastCommit ? formatDate(lastCommit.date) : hasSources ? (commits.ok ? "—" : "ошибка") : "нет папок"}</dd>
        </div>
      </dl>
    </Link>
  );
}
