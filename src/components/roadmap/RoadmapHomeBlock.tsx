"use client";

import Link from "next/link";
import { useRoadmap } from "@/hooks/useRoadmap";
import RoadmapTimeline from "./RoadmapTimeline";

export default function RoadmapHomeBlock() {
  const { snapshot, loading, configured } = useRoadmap();

  if (!configured) return null;

  return (
    <div
      className="rounded-lg border bg-[var(--color-secondary-bg)] p-4 sm:p-6"
      style={{ borderColor: "var(--color-surface-border)" }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--color-title)]">Roadmap</h2>
          <p className="text-sm text-[var(--color-body)]">Рекомендованный порядок работ</p>
        </div>
        <Link
          href="/roadmap"
          className="shrink-0 text-sm text-[var(--color-body)] hover:underline"
        >
          Весь Roadmap →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-body)]">Загрузка…</p>
      ) : !snapshot ? (
        <p className="text-sm text-[var(--color-body)]">Roadmap пока не заполнен.</p>
      ) : (
        <RoadmapTimeline steps={snapshot.recommended_order} />
      )}
    </div>
  );
}
