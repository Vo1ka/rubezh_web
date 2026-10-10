import { supabase } from "@/lib/supabaseClient";
import type { Epic } from "@/lib/epics";
import type { Note } from "@/lib/notes";
import type { DecisionRecord } from "@/lib/decisions";
import type { ProposalRecord } from "@/lib/proposals";
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

/** Open questions marked blocking, counted per direction id — for the overview. */
export async function loadBlockingCounts(): Promise<Loaded<Record<string, number>>> {
  if (!supabase) return { ok: false, error: "Supabase не настроен" };
  const { data, error } = await supabase
    .from("decisions")
    .select("directions")
    .eq("type", "open_question")
    .eq("status", "blocking");
  if (error) return { ok: false, error: error.message };
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    for (const d of (row.directions as string[] | null) ?? []) counts[d] = (counts[d] ?? 0) + 1;
  }
  return { ok: true, value: counts };
}
