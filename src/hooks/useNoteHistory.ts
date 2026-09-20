"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
