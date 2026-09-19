import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { OWNERS } from "@/lib/owners";
import { VERDICTS } from "@/lib/proposals";

// RW-3: validator agent. Runs server-side so the Claude API key never
// reaches the browser. Node runtime (not edge) because it reads the
// document registry straight off disk, at call time, not baked in at build.
export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";

function getApiEndpoint(): string {
  const baseUrl = process.env.ANTHROPIC_BASE_URL?.trim();
  if (baseUrl) {
    return baseUrl.endsWith("/") ? `${baseUrl}v1/messages` : `${baseUrl}/v1/messages`;
  }
  return "https://api.anthropic.com/v1/messages";
}

function supabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// documents.url points at a GitHub blob of this same repo's /docs folder
// (https://github.com/Vo1ka/rubezh_web/blob/master/docs/foo.md) — resolve
// it back to a local filename so we read the file that's actually deployed,
// instead of adding a second network dependency (and GitHub's API is
// already flaky here, see the /development widget's 401). Statically
// scoped to docs/ so bundlers don't trace the whole project for an
// arbitrary dynamic path, and so a bad url can't read outside docs/.
const DOCS_DIR = path.join(process.cwd(), "docs");

function docsFilename(url: string): string | null {
  const match = url.match(/\/docs\/([^/?#]+\.md)$/);
  return match ? match[1] : null;
}

async function loadDocument(doc: { title: string; version: string; url: string }) {
  const filename = docsFilename(doc.url);
  if (!filename) {
    return `## ${doc.title} (${doc.version})\n[Ссылка не указывает на markdown-файл в docs/ этого репозитория: ${doc.url}]`;
  }
  try {
    const content = await readFile(path.join(DOCS_DIR, filename), "utf-8");
    return `## ${doc.title} (${doc.version})\n\n${content}`;
  } catch {
    return `## ${doc.title} (${doc.version})\n[Не удалось прочитать docs/${filename} — реестр документов рассинхронизирован с репозиторием]`;
  }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`Ответ модели не содержит JSON. Сырой ответ: ${text.slice(0, 300) || "(пусто)"}`);
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY не настроен на сервере — агент недоступен, вердикт не выставлен." },
      { status: 501 }
    );
  }

  const supabase = supabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase не настроен на сервере" }, { status: 501 });
  }

  const { proposalId } = (await request.json().catch(() => ({}))) as { proposalId?: string };
  if (!proposalId) {
    return NextResponse.json({ error: "Не передан proposalId" }, { status: 400 });
  }

  const [{ data: proposal, error: proposalError }, { data: documents }, { data: epics }, { data: decisions }] =
    await Promise.all([
      supabase.from("proposals").select("*").eq("id", proposalId).single(),
      supabase
        .from("documents")
        .select("doc_key, title, version, url, is_baseline")
        .eq("is_baseline", true)
        .order("doc_key"),
      supabase
        .from("epics")
        .select("title, description, mvp_priority, status")
        .order("mvp_priority"),
      supabase
        .from("decisions")
        .select("type, title, description, status")
        .order("created_at", { ascending: false }),
    ]);

  if (proposalError || !proposal) {
    return NextResponse.json({ error: "Предложение не найдено" }, { status: 404 });
  }

  const docBlocks = await Promise.all((documents ?? []).map(loadDocument));

  const epicsSummary = (epics ?? [])
    .map((e) => `- [${e.mvp_priority} / ${e.status}] ${e.title}${e.description ? ` — ${e.description}` : ""}`)
    .join("\n");

  const decisionsSummary = (decisions ?? [])
    .map((d) => `- [${d.type} / ${d.status ?? "—"}] ${d.title}${d.description ? ` — ${d.description}` : ""}`)
    .join("\n");

  const ownerSlugs = OWNERS.map((o) => o.value).join(", ");
  const verdictSlugs = VERDICTS.map((v) => v.value).join(", ");

  const systemPrompt = `Ты — агент-валидатор идей для проекта RUBEZH (Minecraft-мод). Тебе присылают "Предложение" — сырую идею от одного из отделов — и твоя задача сверить её с утверждённым планом (документы ниже) и текущим состоянием Epic Map / Решений.

Канонические источники (используй как единственную опору, не домысливай):

${docBlocks.join("\n\n---\n\n")}

Текущие Epic (приоритет / статус):
${epicsSummary || "(пусто)"}

Текущие Решения / риски / открытые вопросы:
${decisionsSummary || "(пусто)"}

Твой вывод — ТОЛЬКО валидный JSON без пояснений вокруг, строго такой формы:
{
  "verdict": одно из [${verdictSlugs}],
  "rationale": "2-4 предложения, почему именно такой вердикт",
  "references": "конкретные разделы/документы, на которые ты опираешься (не общие фразы)",
  "recommended_owner": одно из [${ownerSlugs}] или null, если непонятно
}

Правила вывода:
- "aligned" — идея уже покрыта или прямо согласуется с текущим планом, дополнительное решение не требуется.
- "product_issue" — вопрос продуктового масштаба/приоритета, нерешённый в источниках.
- "design_issue" — вопрос геймдизайна, нерешённый в источниках.
- "technical_decision" — требует архитектурного решения, ещё не зафиксированного.
- "needs_prototype" — нельзя оценить без спайка/прототипа.
- "out_of_scope" — прямо противоречит MVP-скоупу или уже исключённым разделам (см. WON'T HAVE в источниках, если есть).
Ты НЕ принимаешь решение и не меняешь статус Предложения — только даёшь рекомендацию человеку.`;

  const userPrompt = `Предложение: ${proposal.title}\n\nОписание: ${proposal.description ?? "(без описания)"}\n\nОт кого: ${proposal.proposed_by ?? "не указано"}`;

  let verdictJson: {
    verdict?: string;
    rationale?: string;
    references?: string;
    recommended_owner?: string | null;
  };

  const apiEndpoint = getApiEndpoint();

  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Anthropic API: ${res.status} ${errBody.slice(0, 300)}`);
    }

    const data = await res.json();
    // The proxy can return extended-thinking responses where content[0] is a
    // "thinking" block, not the text — find the first actual text block.
    const textBlock = (data.content as Array<{ type: string; text?: string }> | undefined)?.find(
      (block) => block.type === "text"
    );
    const text = textBlock?.text;
    if (typeof text !== "string") {
      throw new Error(`Неожиданная форма ответа API: ${JSON.stringify(data).slice(0, 300)}`);
    }
    verdictJson = extractJson(text) as typeof verdictJson;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Сбой обращения к Claude API";
    await supabase.from("proposals").update({ verdict_error: message }).eq("id", proposalId);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const { error: updateError } = await supabase
    .from("proposals")
    .update({
      verdict: verdictJson.verdict ?? null,
      verdict_rationale: verdictJson.rationale ?? null,
      verdict_references: verdictJson.references ?? null,
      verdict_owner: verdictJson.recommended_owner ?? null,
      verdict_at: new Date().toISOString(),
      verdict_error: null,
    })
    .eq("id", proposalId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...verdictJson });
}
