"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Epic, EpicStatus, NewEpicInput } from "@/lib/epics";

export function useEpics() {
  const instanceId = useId();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("epics")
      .select("*")
      .order("mvp_priority", { ascending: true })
      .order("position", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEpics(data ?? []);
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
      .channel(`epics-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "epics" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createEpic = useCallback(
    async (input: NewEpicInput) => {
      if (!supabase || !input.title.trim()) return;
      const maxPosition = epics.reduce((max, e) => Math.max(max, e.position), -1);
      const { error: insertError } = await supabase.from("epics").insert({
        title: input.title.trim(),
        description: input.description?.trim() || null,
        owner_section: input.owner_section || null,
        mvp_priority: input.mvp_priority,
        risk_level: input.risk_level || null,
        depends_on: input.depends_on,
        position: maxPosition + 1,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [epics, refresh]
  );

  const updateStatus = useCallback(
    async (id: string, status: EpicStatus) => {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from("epics")
        .update({ status })
        .eq("id", id);
      if (updateError) setError(updateError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteEpic = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase.from("epics").delete().eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    epics,
    loading,
    error,
    configured: isSupabaseConfigured,
    createEpic,
    updateStatus,
    deleteEpic,
  };
}
