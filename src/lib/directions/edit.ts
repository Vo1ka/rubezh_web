import { isMap, isScalar, isSeq, parseDocument } from "yaml";
import { STATUS_SECTIONS } from "./status";
import type { JournalType } from "./journal";

// RW-16/17: building the new text of STATUS.md, JOURNAL.md and directions.yaml.
// Pure functions — the server action composes and commits, the formats are
// the team guide's (directions/README.md).

export type StatusFields = {
  direction: string;
  owner: string;
  updated: string;
  state: string;
  reflects: Record<string, string>;
};

const SECTION_HINTS: Record<(typeof STATUS_SECTIONS)[number], string> = {
  Коротко: "Одна-две фразы: в каком состоянии направление прямо сейчас.",
  "Работает в игре": "- Только то, что проверено в игре. «Написано, но не проверено» — так и пишем.",
  "Где остановился": "- Что в полуготовом состоянии, в какой ветке, что не закоммичено, временные хаки.",
  "Следующие шаги": "1. По порядку, конкретно: «сделать X в файле Y», а не «доделать оружие».",
  "Открытые вопросы": "- [ ] Вопрос — кто закрывает — ссылка (Решение на сайте / D-xx)",
  Ловушки: "- Что неочевидно и легко сломать. Самая ценная секция для того, кто придёт после.",
  Связи: "- Epics: … · Решения: … · Документы: docs/...",
};

/** Body of a new STATUS.md: the guide's template with its hints. */
export function statusTemplate(name: string) {
  return [`# ${name} — статус`, "", ...STATUS_SECTIONS.flatMap((s) => [`## ${s}`, SECTION_HINTS[s], ""])].join("\n");
}

export function composeStatus(fields: StatusFields, body: string) {
  const reflects = Object.entries(fields.reflects).filter(([, sha]) => sha.trim());
  const lines = [
    "---",
    `direction: ${fields.direction}`,
    `owner: ${fields.owner || "null"}`,
    `updated: ${fields.updated}`,
    `state: ${fields.state}`,
    reflects.length > 0 ? "reflects:" : "reflects: {}",
    ...reflects.map(([repo, sha]) => `  ${repo}: ${sha.trim()}`),
    "---",
  ];
  return `${lines.join("\n")}\n${body.trim()}\n`;
}

export type JournalEntryInput = {
  date: string;
  author: string;
  type: JournalType;
  /** After the type in the heading, e.g. "→ Имя2" or "(пауза)". */
  detail?: string;
  body: string;
};

export function formatJournalEntry(e: JournalEntryInput) {
  const heading = [e.date, e.author.trim(), [e.type, e.detail?.trim()].filter(Boolean).join(" ")].join(" · ");
  return `## ${heading}\n${e.body.trim()}\n`;
}

/** New entries go on top, below whatever preamble (title) the file has; old entries stay byte-for-byte. */
export function prependJournalEntry(current: string | null, entry: string, title: string) {
  if (!current || !current.trim()) return `# ${title} — журнал\n\n${entry}`;
  const first = current.search(/^##\s/m);
  if (first === -1) return `${current.trimEnd()}\n\n${entry}`;
  return `${current.slice(0, first)}${entry}\n${current.slice(first)}`;
}

export const HANDOFF_FIELDS = [
  { key: "stoppedAt", label: "Где остановился", required: true },
  { key: "halfDone", label: "Полуготовое", hint: "ветки, незакоммиченное, временные хаки — где лежат", required: true },
  { key: "checkFirst", label: "Проверить первым", required: true },
  { key: "traps", label: "Ловушки", required: true },
  { key: "doNotTouch", label: "Не трогать без согласования", required: false },
  { key: "openQuestions", label: "Открытые вопросы", required: false },
] as const;

export type HandoffFieldKey = (typeof HANDOFF_FIELDS)[number]["key"];

export function missingHandoffFields(values: Partial<Record<HandoffFieldKey, string>>) {
  return HANDOFF_FIELDS.filter((f) => f.required && !values[f.key]?.trim()).map((f) => f.label);
}

export function handoffBody(values: Partial<Record<HandoffFieldKey, string>>) {
  return HANDOFF_FIELDS.filter((f) => values[f.key]?.trim())
    .map((f) => `${f.label}: ${values[f.key]!.trim()}`)
    .join("\n");
}

/**
 * Changes one direction's owner and state in directions.yaml. Only the two
 * values are replaced in the text — comments, alignment and the rest of the
 * file stay byte-for-byte, so the commit diff is two lines.
 */
export function setRegistryOwner(yamlText: string, id: string, owner: string | null, state: string) {
  const doc = parseDocument(yamlText);
  const list = doc.get("directions");
  if (!isSeq(list)) throw new Error("В directions.yaml нет списка directions");
  const item = list.items.find((it) => isMap(it) && it.get("id") === id);
  if (!isMap(item)) throw new Error(`Направления ${id} нет в directions.yaml`);

  const edits = [
    { key: "owner", value: owner === null ? "null" : yamlScalar(owner) },
    { key: "state", value: state },
  ].map(({ key, value }) => {
    const node = item.get(key, true);
    if (!isScalar(node) || !node.range) throw new Error(`У ${id} нет поля ${key}`);
    return { start: node.range[0], end: node.range[1], value };
  });

  let text = yamlText;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, e.start) + e.value + text.slice(e.end);
  }
  return text;
}

function yamlScalar(value: string) {
  return /^[A-Za-z0-9_.-]+$/.test(value) && !/^(null|true|false|~)$/i.test(value) ? value : JSON.stringify(value);
}
