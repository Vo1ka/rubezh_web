"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Meeting, NewMeetingInput } from "@/lib/meetings";

export function useMeetings(limit?: number) {
  const instanceId = useId();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    let query = supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMeetings(data ?? []);
      setError(null);
    }
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
      .channel(`meetings-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createMeeting = useCallback(
    async (input: NewMeetingInput) => {
      if (!supabase || !input.title.trim()) return;
      const { error: insertError } = await supabase.from("meetings").insert({
        title: input.title.trim(),
        meeting_date: input.meeting_date,
        attendees: input.attendees?.trim() || null,
        summary: input.summary?.trim() || null,
        decisions: input.decisions?.trim() || null,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteMeeting = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("meetings")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    meetings,
    loading,
    error,
    configured: isSupabaseConfigured,
    createMeeting,
    deleteMeeting,
  };
}
