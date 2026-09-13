"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { RoadmapSnapshot } from "@/lib/roadmap";

export function useRoadmap() {
  const instanceId = useId();
  const [snapshot, setSnapshot] = useState<RoadmapSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("roadmap_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setSnapshot(data);
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
      .channel(`roadmap-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "roadmap_snapshots" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  return {
    snapshot,
    loading,
    error,
    configured: isSupabaseConfigured,
  };
}
