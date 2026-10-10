import { parse as parseYaml } from "yaml";

// RW-14: STATUS.md = YAML front matter + fixed `##` sections (team guide,
// "STATUS.md"). The parser is deliberately tolerant: anything it can't read
// is reported as a format problem and the raw markdown is still shown.
export const STATUS_SECTIONS = [
  "Коротко",
  "Работает в игре",
  "Где остановился",
  "Следующие шаги",
  "Открытые вопросы",
  "Ловушки",
  "Связи",
] as const;

export type StatusFrontMatter = {
  direction?: string;
  owner?: string;
  updated?: string;
  state?: string;
  reflects: Record<string, string>;
};

export type ParsedStatus = {
  frontMatter: StatusFrontMatter;
  title: string | null;
  sections: { heading: string; body: string }[];
  /** Body without front matter — rendered as-is when the format is broken. */
  body: string;
  problems: string[];
};

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseStatus(text: string): ParsedStatus {
  const problems: string[] = [];
  let frontMatter: StatusFrontMatter = { reflects: {} };
  let body = text;

  const fm = text.match(FRONT_MATTER);
  if (fm) {
    body = text.slice(fm[0].length);
    try {
      const raw = (parseYaml(fm[1]) ?? {}) as Record<string, unknown>;
      frontMatter = {
        direction: str(raw.direction),
        owner: str(raw.owner),
        updated: str(raw.updated),
        state: str(raw.state),
        reflects: Object.fromEntries(
          Object.entries((raw.reflects as Record<string, unknown>) ?? {})
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)])
        ),
      };
    } catch (e) {
      problems.push(`front matter не разбирается: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
    }
  } else {
    problems.push("нет front matter (блока --- в начале файла)");
  }
  if (!frontMatter.updated) problems.push("в front matter нет даты updated");

  const title = body.match(/^#\s+(.+)$/m)?.[1].trim() ?? null;
  const sections: { heading: string; body: string }[] = [];
  const parts = body.split(/^##\s+/m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
    sections.push({ heading, body: newline === -1 ? "" : part.slice(newline + 1).trim() });
  }

  const missing = STATUS_SECTIONS.filter((s) => !sections.some((x) => x.heading === s));
  if (missing.length > 0) problems.push(`нет секций: ${missing.join(", ")}`);

  return { frontMatter, title, sections, body, problems };
}

export function statusSection(status: ParsedStatus, heading: string) {
  return status.sections.find((s) => s.heading === heading)?.body ?? null;
}

function str(v: unknown) {
  if (v == null) return undefined;
  // YAML turns an unquoted 2026-10-10 into a Date.
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}
