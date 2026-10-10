import Link from "next/link";
import { loadRegistry, REGISTRY_PATH, type Direction } from "@/lib/directions/registry";
import { loadCommits, loadStatus } from "@/lib/directions/data";
import { statusSection } from "@/lib/directions/status";
import { loadBlockingCounts } from "@/lib/directions/tracker";
import { ErrorNote, ExternalLink, FlagBadge, Muted, StateBadge, formatDate } from "@/components/directions/ui";

// RW-14: the site's entry point — one row per direction from the registry.
export default async function DirectionsPage() {
  const [registry, blocking] = await Promise.all([loadRegistry(), loadBlockingCounts()]);
  const blockingCounts = blocking.ok ? blocking.value : {};

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

      {registry.ok ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registry.directions.map((d) => (
            <DirectionCard key={d.id} direction={d} blockingQuestions={blockingCounts[d.id] ?? 0} />
          ))}
        </div>
      ) : (
        <ErrorNote>Реестр направлений недоступен: {registry.error}</ErrorNote>
      )}
    </div>
  );
}

async function DirectionCard({ direction, blockingQuestions }: { direction: Direction; blockingQuestions: number }) {
  const [status, commits] = await Promise.all([loadStatus(direction.id), loadCommits(direction, 1)]);
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
        {!status.ok ? <FlagBadge>STATUS не прочитан</FlagBadge> : null}
        {status.ok && !status.value ? <FlagBadge>Нет STATUS</FlagBadge> : null}
        {parsed && parsed.problems.length > 0 ? <FlagBadge>Формат STATUS нарушен</FlagBadge> : null}
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
