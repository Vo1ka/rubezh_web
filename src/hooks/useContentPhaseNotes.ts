"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Note } from "@/lib/notes";
import { getQuerySnapshot, subscribeQuery } from "@/lib/queryStore";

// Content-phase tasks live as Kanban cards on the Разработка and ТехЛид
// boards; /content-phase reads both at once to derive each task's state.
const KEY = "notes:content-phase";
const SECTIONS = ["development", "techlead"];

async function fetchNotes() {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .in("section", SECTIONS)
    .order("position", { ascending: true });
  return { data: (data ?? []) as Note[], error: error?.message ?? null };
}

function subscribeRealtime(onChange: () => void) {
  if (!supabase) return null;
  return supabase
    .channel("notes-content-phase-shared")
    .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, onChange)
    .subscribe();
}

export function useContentPhaseNotes() {
  const [snapshot, setSnapshot] = useState(() => getQuerySnapshot<Note[]>(KEY, []));

  useEffect(() => {
    if (!supabase) return;
    return subscribeQuery(KEY, [], fetchNotes, subscribeRealtime, () =>
      setSnapshot(getQuerySnapshot<Note[]>(KEY, []))
    );
  }, []);

  return {
    notes: snapshot.data,
    loading: isSupabaseConfigured ? snapshot.loading : false,
    error: snapshot.error,
    configured: isSupabaseConfigured,
  };
}
