// RW-14: JOURNAL.md is append-only, newest entry on top. Each entry starts
// with `## <date> · <author> · <type>`; a handoff may continue with
// `→ <new owner>` or `(пауза)` (team guide, "JOURNAL.md").
export const JOURNAL_TYPES = ["работа", "решение", "проблема", "передача"] as const;
export type JournalType = (typeof JOURNAL_TYPES)[number];

export type JournalEntry = {
  date: string;
  author: string;
  type: JournalType | null;
  /** Everything after the type, e.g. "→ Имя2" for a handoff. */
  typeDetail: string;
  heading: string;
  body: string;
};

export function parseJournal(text: string): JournalEntry[] {
  const entries: JournalEntry[] = [];
  for (const part of text.split(/^##\s+/m).slice(1)) {
    const newline = part.indexOf("\n");
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
    const body = newline === -1 ? "" : part.slice(newline + 1).trim();
    const [date = "", author = "", typePart = ""] = heading.split("·").map((s) => s.trim());
    const type = JOURNAL_TYPES.find((t) => typePart === t || typePart.startsWith(`${t} `)) ?? null;
    entries.push({
      date,
      author,
      type,
      typeDetail: type ? typePart.slice(type.length).trim() : typePart,
      heading,
      body,
    });
  }
  return entries;
}

export function lastHandoff(entries: JournalEntry[]) {
  return entries.find((e) => e.type === "передача") ?? null;
}
