"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { RoadmapTask } from "@/lib/roadmapTasks";

export function useRoadmapTasks() {
  const instanceId = useId();
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .order("position", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTasks(data ?? []);
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
      .channel(`roadmap-tasks-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "roadmap_tasks" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  return {
    tasks,
    loading,
    error,
    configured: isSupabaseConfigured,
  };
}
