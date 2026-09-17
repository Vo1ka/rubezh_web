"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { NewPlaygroundCommentInput, PlaygroundComment } from "@/lib/playground";

export function usePlaygroundComments(noteId: string | undefined) {
  const instanceId = useId();
  const [comments, setComments] = useState<PlaygroundComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase || !noteId) return;
    const { data, error: fetchError } = await supabase
      .from("playground_comments")
      .select("*")
      .eq("note_id", noteId)
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setComments(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, [noteId]);

  useEffect(() => {
    const client = supabase;
    if (!client || !noteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();

    const channel = client
      .channel(`playground-comments-${noteId}-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "playground_comments", filter: `note_id=eq.${noteId}` },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, noteId, refresh]);

  const createComment = useCallback(
    async (input: NewPlaygroundCommentInput) => {
      if (!supabase || !noteId || !input.content.trim()) return;
      const { error: insertError } = await supabase.from("playground_comments").insert({
        note_id: noteId,
        content: input.content.trim(),
        author: input.author?.trim() || null,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [noteId, refresh]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("playground_comments")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    comments,
    loading,
    error,
    configured: isSupabaseConfigured,
    createComment,
    deleteComment,
  };
}
