import Link from "next/link";
import type { ReactNode } from "react";
import type { RoadmapTask } from "@/lib/roadmapTasks";

const CODE_PATTERN = /\b([A-Z]{1,4}\d?-\d+)\b/g;

export function buildTaskCodeMap(tasks: RoadmapTask[]): Map<string, string> {
  return new Map(tasks.map((t) => [t.code, t.slug]));
}

export function linkifyTaskCodes(text: string, tasksByCode: Map<string, string>): ReactNode {
  if (tasksByCode.size === 0) return text;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(CODE_PATTERN);

  while ((match = pattern.exec(text)) !== null) {
    const code = match[1];
    const slug = tasksByCode.get(code);
    if (slug) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <Link
          key={`${code}-${key++}`}
          href={`/roadmap/tasks/${slug}`}
          className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {code}
        </Link>
      );
      lastIndex = match.index + code.length;
    }
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
