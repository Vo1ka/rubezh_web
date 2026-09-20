"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Note, NotePriority, NoteStatus } from "@/lib/notes";
import type { SectionSlug } from "@/lib/sections";
import { getQuerySnapshot, refreshQuery, subscribeQuery } from "@/lib/queryStore";

function notesKey(section: SectionSlug) {
  return `notes:${section}`;
}

function fetchNotesFor(section: SectionSlug) {
  return async () => {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("section", section)
      .order("position", { ascending: true });
    return { data: data ?? [], error: error?.message ?? null };
  };
}

function subscribeNotesRealtimeFor(section: SectionSlug) {
  return (onChange: () => void) => {
    if (!supabase) return null;
    return supabase
      .channel(`notes-${section}-shared`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes", filter: `section=eq.${section}` },
        onChange
      )
      .subscribe();
  };
}

export function useNotes(section: SectionSlug) {
  const key = notesKey(section);
  const [snapshot, setSnapshot] = useState(() => getQuerySnapshot<Note[]>(key, []));
  const [mutationError, setMutationError] = useState<string | null>(null);

  // SidebarNotes keeps the same useNotes instance mounted across section
  // navigations (only the `section` prop changes), so resync to the new
  // section's (possibly cached) snapshot during render rather than waiting
  // for the effect below to refetch — avoids a stale flash of frame content.
  const [snapshotSection, setSnapshotSection] = useState(section);
  if (section !== snapshotSection) {
    setSnapshotSection(section);
    setSnapshot(getQuerySnapshot<Note[]>(key, []));
  }

  useEffect(() => {
    if (!supabase) return;
    return subscribeQuery(
      notesKey(section),
      [],
      fetchNotesFor(section),
      subscribeNotesRealtimeFor(section),
      () => setSnapshot(getQuerySnapshot<Note[]>(notesKey(section), []))
    );
  }, [section]);

  const notes = snapshot.data;

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
      if (insertError) setMutationError(insertError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [section, notes, key]
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
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [notes, key]
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
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase.from("notes").delete().eq("id", id);
      if (deleteError) setMutationError(deleteError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const setNoteEpic = useCallback(
    async (id: string, epicId: string | null) => {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from("notes")
        .update({ epic_id: epicId })
        .eq("id", id);
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const bulkSetStatus = useCallback(
    async (ids: string[], status: NoteStatus) => {
      if (!supabase || ids.length === 0) return;
      const { error: updateError } = await supabase.from("notes").update({ status }).in("id", ids);
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const bulkSetPriority = useCallback(
    async (ids: string[], priority: NotePriority) => {
      if (!supabase || ids.length === 0) return;
      const { error: updateError } = await supabase.from("notes").update({ priority }).in("id", ids);
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const bulkSetEpic = useCallback(
    async (ids: string[], epicId: string | null) => {
      if (!supabase || ids.length === 0) return;
      const { error: updateError } = await supabase.from("notes").update({ epic_id: epicId }).in("id", ids);
      if (updateError) setMutationError(updateError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      if (!supabase || ids.length === 0) return;
      const { error: deleteError } = await supabase.from("notes").delete().in("id", ids);
      if (deleteError) setMutationError(deleteError.message);
      else {
        setMutationError(null);
        refreshQuery(key);
      }
    },
    [key]
  );

  return {
    notes,
    loading: snapshot.loading,
    error: mutationError ?? snapshot.error,
    configured: isSupabaseConfigured,
    createNote,
    moveNote,
    cyclePriority,
    deleteNote,
    setNoteEpic,
    bulkSetStatus,
    bulkSetPriority,
    bulkSetEpic,
    bulkDelete,
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
