"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { NoteHistoryEntry } from "@/lib/notes";

export function useNoteHistory(noteId: string | null) {
  const [entries, setEntries] = useState<NoteHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase || !noteId) return;
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("notes_history")
      .select("*")
      .eq("note_id", noteId)
      .order("changed_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else {
      setEntries(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, [noteId]);

  useEffect(() => {
    if (!noteId) {
      setEntries([]);
      return;
    }
    refresh();
  }, [noteId, refresh]);

  return { entries, loading, error };
}

// Cross-section activity feed for the home dashboard — most recent changes
// across every Kanban board, not scoped to one note.
export function useRecentNotesHistory(limit: number) {
  const instanceId = useId();
  const [entries, setEntries] = useState<NoteHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("notes_history")
      .select("*")
      .order("changed_at", { ascending: false })
      .limit(limit);
    setEntries(data ?? []);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();

    const channel = client
      .channel(`notes-history-recent-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notes_history" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  return { entries, loading, configured: isSupabaseConfigured };
}
