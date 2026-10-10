import { supabase } from "@/lib/supabaseClient";
import type { Epic } from "@/lib/epics";
import type { Note } from "@/lib/notes";
import type { DecisionRecord } from "@/lib/decisions";
import type { ProposalRecord } from "@/lib/proposals";
import type { DocumentRecord } from "@/lib/documents";
import type { Loaded } from "./data";

// RW-14 block 5: the site-database side of a direction page — work tagged
// with the direction (RW-13). "Active"/"open" filters live here so the
// overview and the direction page agree on what counts.

const CLOSED_RECORD_STATUSES = ["superseded", "mitigated", "closed"];

export type DirectionWork = {
  epics: Epic[];
  notes: Note[];
  decisions: DecisionRecord[];
  proposals: ProposalRecord[];
};

export async function loadDirectionWork(id: string): Promise<Loaded<DirectionWork>> {
  if (!supabase) return { ok: false, error: "Supabase не настроен" };
  const tag = [id];
  const [epics, notes, decisions, proposals] = await Promise.all([
    supabase.from("epics").select("*").contains("directions", tag).neq("status", "done").order("mvp_priority").order("position"),
    supabase.from("notes").select("*").eq("direction", id).neq("status", "done").order("updated_at", { ascending: false }),
    supabase.from("decisions").select("*").contains("directions", tag).order("created_at", { ascending: false }),
    supabase
      .from("proposals")
      .select("*")
      .contains("directions", tag)
      .neq("status", "rejected")
      .is("decision_id", null)
      .order("created_at", { ascending: false }),
  ]);
  const error = epics.error ?? notes.error ?? decisions.error ?? proposals.error;
  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    value: {
      epics: epics.data ?? [],
      notes: notes.data ?? [],
      decisions: (decisions.data ?? []).filter((d) => !CLOSED_RECORD_STATUSES.includes(d.status ?? "")),
      proposals: proposals.data ?? [],
    },
  };
}

export type DirectionCounts = {
  /** Open questions marked blocking, per direction id. */
  blocking: Record<string, number>;
  /** Kanban cards not done, per direction id (RW-15 "status is old" rule). */
  activeCards: Record<string, number>;
  /** RW-15 extension of RW-7: active work nobody has assigned to a direction. */
  untagged: { epics: number; notes: number };
};

/** Per-direction counters for the overview, in one round of queries. */
export async function loadDirectionCounts(): Promise<Loaded<DirectionCounts>> {
  if (!supabase) return { ok: false, error: "Supabase не настроен" };
  const [blocking, notes, epics] = await Promise.all([
    supabase.from("decisions").select("directions").eq("type", "open_question").eq("status", "blocking"),
    supabase.from("notes").select("direction").neq("status", "done"),
    supabase.from("epics").select("directions").neq("status", "done"),
  ]);
  const error = blocking.error ?? notes.error ?? epics.error;
  if (error) return { ok: false, error: error.message };

  const counts: DirectionCounts = { blocking: {}, activeCards: {}, untagged: { epics: 0, notes: 0 } };
  for (const row of blocking.data ?? []) {
    for (const d of (row.directions as string[] | null) ?? []) counts.blocking[d] = (counts.blocking[d] ?? 0) + 1;
  }
  for (const row of notes.data ?? []) {
    const d = row.direction as string | null;
    if (d) counts.activeCards[d] = (counts.activeCards[d] ?? 0) + 1;
    else counts.untagged.notes++;
  }
  for (const row of epics.data ?? []) {
    if (((row.directions as string[] | null) ?? []).length === 0) counts.untagged.epics++;
  }
  return { ok: true, value: counts };
}

/** Hand-registry documents tagged with the direction (RW-13), newest version first. */
export async function loadDirectionRegistryDocuments(id: string): Promise<Loaded<DocumentRecord[]>> {
  if (!supabase) return { ok: false, error: "Supabase не настроен" };
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .contains("directions", [id])
    .order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, value: data ?? [] };
}
