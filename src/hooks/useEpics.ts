"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Epic, EpicStatus, NewEpicInput } from "@/lib/epics";
import { getQuerySnapshot, refreshQuery, subscribeQuery } from "@/lib/queryStore";

const EPICS_KEY = "epics";

async function fetchEpics() {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from("epics")
    .select("*")
    .order("mvp_priority", { ascending: true })
    .order("position", { ascending: true });
  return { data: data ?? [], error: error?.message ?? null };
}

function subscribeEpicsRealtime(onChange: () => void) {
  if (!supabase) return null;
  return supabase
    .channel("epics-shared")
    .on("postgres_changes", { event: "*", schema: "public", table: "epics" }, onChange)
    .subscribe();
}

export function useEpics() {
  const [snapshot, setSnapshot] = useState(() => getQuerySnapshot<Epic[]>(EPICS_KEY, []));
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    return subscribeQuery(EPICS_KEY, [], fetchEpics, subscribeEpicsRealtime, () =>
      setSnapshot(getQuerySnapshot<Epic[]>(EPICS_KEY, []))
    );
  }, []);

  const createEpic = useCallback(
    async (input: NewEpicInput) => {
      if (!supabase || !input.title.trim()) return;
      const maxPosition = snapshot.data.reduce((max, e) => Math.max(max, e.position), -1);
      const { error: insertError } = await supabase.from("epics").insert({
        title: input.title.trim(),
        description: input.description?.trim() || null,
        owner_section: input.owner_section || null,
        mvp_priority: input.mvp_priority,
        risk_level: input.risk_level || null,
        depends_on: input.depends_on,
        position: maxPosition + 1,
      });
      if (insertError) setMutationError(insertError.message);
      else {
        setMutationError(null);
        refreshQuery(EPICS_KEY);
      }
    },
    [snapshot.data]
  );

  const updateStatus = useCallback(async (id: string, status: EpicStatus) => {
    if (!supabase) return;
    const { error: updateError } = await supabase.from("epics").update({ status }).eq("id", id);
    if (updateError) setMutationError(updateError.message);
    else {
      setMutationError(null);
      refreshQuery(EPICS_KEY);
    }
  }, []);

  const deleteEpic = useCallback(async (id: string) => {
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("epics").delete().eq("id", id);
    if (deleteError) setMutationError(deleteError.message);
    else {
      setMutationError(null);
      refreshQuery(EPICS_KEY);
    }
  }, []);

  return {
    epics: snapshot.data,
    loading: snapshot.loading,
    error: mutationError ?? snapshot.error,
    configured: isSupabaseConfigured,
    createEpic,
    updateStatus,
    deleteEpic,
  };
}
