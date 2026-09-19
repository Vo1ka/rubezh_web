"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { DecisionRecord, NewDecisionInput } from "@/lib/decisions";

export function useDecisions() {
  const instanceId = useId();
  const [records, setRecords] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("decisions")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setRecords(data ?? []);
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
      .channel(`decisions-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "decisions" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createRecord = useCallback(
    async (input: NewDecisionInput) => {
      if (!supabase || !input.title.trim()) return;
      const { error: insertError } = await supabase.from("decisions").insert({
        type: input.type,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        status: input.status || null,
        epic_id: input.epic_id || null,
        related_ids: input.related_ids,
        owner: input.owner || null,
        proposal_id: input.proposal_id || null,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("decisions")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    records,
    loading,
    error,
    configured: isSupabaseConfigured,
    createRecord,
    deleteRecord,
  };
}
