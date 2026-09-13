"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { NewPlaygroundNoteInput, PlaygroundNote } from "@/lib/playground";

export function usePlaygroundNotes() {
  const instanceId = useId();
  const [notes, setNotes] = useState<PlaygroundNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("playground_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setNotes(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();

    const channel = client
      .channel(`playground-notes-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "playground_notes" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createNote = useCallback(
    async (input: NewPlaygroundNoteInput) => {
      if (!supabase || !input.content.trim()) return;
      const { error: insertError } = await supabase.from("playground_notes").insert({
        content: input.content.trim(),
        author: input.author?.trim() || null,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("playground_notes")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    notes,
    loading,
    error,
    configured: isSupabaseConfigured,
    createNote,
    deleteNote,
  };
}
