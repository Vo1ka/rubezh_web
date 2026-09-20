"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { EpicRepoLink } from "@/lib/epicRepos";

export function useEpicRepos(epicId: string) {
  const instanceId = useId();
  const [links, setLinks] = useState<EpicRepoLink[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("epic_repos")
      .select("*")
      .eq("epic_id", epicId)
      .order("created_at", { ascending: true });
    setLinks(data ?? []);
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
      .channel(`epic-repos-${epicId}-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "epic_repos", filter: `epic_id=eq.${epicId}` },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [epicId, instanceId, refresh]);

  return { links, loading };
}
