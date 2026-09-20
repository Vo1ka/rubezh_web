"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Note, NotePriority, NoteStatus } from "@/lib/notes";
import type { SectionSlug } from "@/lib/sections";

export function useNotes(section: SectionSlug) {
  const instanceId = useId();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("section", section)
      .order("position", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setNotes(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, [section]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();

    const channel = client
      .channel(`notes-${section}-${instanceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `section=eq.${section}`,
        },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [section, instanceId, refresh]);

  const createNote = useCallback(
    async (title: string) => {
      if (!supabase || !title.trim()) return;
      const maxPosition = notes
        .filter((n) => n.status === "backlog")
        .reduce((max, n) => Math.max(max, n.position), -1);

      const { error: insertError } = await supabase.from("notes").insert({
        section,
        title: title.trim(),
        status: "backlog",
        priority: "medium",
        position: maxPosition + 1,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [section, notes, refresh]
  );

  const moveNote = useCallback(
    async (id: string, status: NoteStatus) => {
      if (!supabase) return;
      const maxPosition = notes
        .filter((n) => n.status === status && n.id !== id)
        .reduce((max, n) => Math.max(max, n.position), -1);

      const { error: updateError } = await supabase
        .from("notes")
        .update({ status, position: maxPosition + 1 })
        .eq("id", id);
      if (updateError) setError(updateError.message);
      else await refresh();
    },
    [notes, refresh]
  );

  const cyclePriority = useCallback(
    async (id: string, current: NotePriority) => {
      if (!supabase) return;
      const order: NotePriority[] = ["low", "medium", "high"];
      const next = order[(order.indexOf(current) + 1) % order.length];
      const { error: updateError } = await supabase
        .from("notes")
        .update({ priority: next })
        .eq("id", id);
      if (updateError) setError(updateError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  const setNoteEpic = useCallback(
    async (id: string, epicId: string | null) => {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from("notes")
        .update({ epic_id: epicId })
        .eq("id", id);
      if (updateError) setError(updateError.message);
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
    moveNote,
    cyclePriority,
    deleteNote,
    setNoteEpic,
  };
}

// RW-11: notes linked to a given Epic, across every discipline section — used
// by the Epic detail page to show its in-flight Kanban work.
export function useNotesByEpic(epicId: string) {
  const instanceId = useId();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("epic_id", epicId)
      .order("updated_at", { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
  }, [epicId]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();

    const channel = client
      .channel(`notes-by-epic-${epicId}-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes", filter: `epic_id=eq.${epicId}` },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [epicId, instanceId, refresh]);

  return { notes, loading };
}
