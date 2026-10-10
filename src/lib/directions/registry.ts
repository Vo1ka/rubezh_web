import { parseDocument, isMap, isNode, isSeq, LineCounter } from "yaml";
import { fetchRepoFile } from "@/lib/github";

// RW-12: the direction registry lives in `directions.yaml` at the root of the
// main game repo and is read live — the site keeps no copy of it. Format is
// fixed by the team guide (directions/README.md, "Реестр").
export const DIRECTIONS_REPO = "Vo1ka/rubezh_full";
export const REGISTRY_PATH = "directions.yaml";

export const DIRECTION_STATES = [
  { value: "active", label: "В работе" },
  { value: "paused", label: "Пауза" },
  { value: "blocked", label: "Заблокировано" },
] as const;

export type DirectionState = (typeof DIRECTION_STATES)[number]["value"];
export type DirectionKind = "product" | "cross-cutting";

export type DirectionSource = { repo: string; paths: string[] };

export type Direction = {
  id: string;
  name: string;
  kind: DirectionKind;
  owner: string | null;
  state: DirectionState;
  sources: DirectionSource[];
};

export type RegistryResult =
  | { ok: true; directions: Direction[]; fileUrl: string }
  | { ok: false; error: string; fileUrl?: string };

export function stateLabel(state: string) {
  return DIRECTION_STATES.find((s) => s.value === state)?.label ?? state;
}

export async function loadRegistry(): Promise<RegistryResult> {
  let file;
  try {
    file = await fetchRepoFile(DIRECTIONS_REPO, REGISTRY_PATH);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
  if (!file) {
    return { ok: false, error: `Файл ${REGISTRY_PATH} не найден в ${DIRECTIONS_REPO}` };
  }
  return { ...parseRegistry(file.content), fileUrl: file.htmlUrl };
}

export async function loadDirection(id: string) {
  const registry = await loadRegistry();
  if (!registry.ok) return { registry, direction: null };
  return { registry, direction: registry.directions.find((d) => d.id === id) ?? null };
}

/** Parses registry text. Errors carry a line number so a broken file is fixable from the page. */
export function parseRegistry(text: string): { ok: true; directions: Direction[] } | { ok: false; error: string } {
  const lineCounter = new LineCounter();
  const doc = parseDocument(text, { lineCounter });
  if (doc.errors.length > 0) {
    const err = doc.errors[0];
    const line = err.linePos?.[0]?.line;
    return { ok: false, error: `Ошибка YAML${line ? ` в строке ${line}` : ""}: ${err.message.split("\n")[0]}` };
  }

  const root = doc.get("directions", true);
  if (!isSeq(root)) {
    return { ok: false, error: "В файле нет списка `directions`" };
  }

  const directions: Direction[] = [];
  const seen = new Set<string>();
  for (const node of root.items) {
    const line = isNode(node) && node.range ? lineCounter.linePos(node.range[0]).line : undefined;
    const at = line ? ` (строка ${line})` : "";
    if (!isMap(node)) return { ok: false, error: `Элемент списка directions — не объект${at}` };
    const raw = node.toJSON() as Record<string, unknown>;

    const id = raw.id;
    if (typeof id !== "string" || !/^[a-z0-9_-]+$/.test(id)) {
      return { ok: false, error: `Поле id отсутствует или некорректно${at}` };
    }
    if (seen.has(id)) return { ok: false, error: `Повторяющийся id «${id}»${at}` };
    seen.add(id);

    const state = raw.state ?? "paused";
    if (!DIRECTION_STATES.some((s) => s.value === state)) {
      return { ok: false, error: `Направление ${id}: неизвестный state «${String(state)}»${at}` };
    }
    const kind = raw.kind ?? "product";
    if (kind !== "product" && kind !== "cross-cutting") {
      return { ok: false, error: `Направление ${id}: неизвестный kind «${String(kind)}»${at}` };
    }

    const sources: DirectionSource[] = [];
    for (const s of Array.isArray(raw.sources) ? raw.sources : []) {
      const src = s as { repo?: unknown; paths?: unknown };
      if (typeof src.repo !== "string" || !src.repo.includes("/")) {
        return { ok: false, error: `Направление ${id}: source без repo вида owner/name${at}` };
      }
      const paths = Array.isArray(src.paths) ? src.paths.filter((p): p is string => typeof p === "string") : [];
      sources.push({ repo: src.repo, paths });
    }

    directions.push({
      id,
      name: typeof raw.name === "string" ? raw.name : id,
      kind,
      owner: typeof raw.owner === "string" && raw.owner.trim() ? raw.owner : null,
      state: state as DirectionState,
      sources,
    });
  }

  return { ok: true, directions };
}

export function directionFilePath(id: string, file: "STATUS.md" | "JOURNAL.md") {
  return `directions/${id}/${file}`;
}
