"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { DocumentRecord, NewDocumentInput } from "@/lib/documents";

export function useDocuments() {
  const instanceId = useId();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .order("doc_key", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setDocuments(data ?? []);
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
      .channel(`documents-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createDocument = useCallback(
    async (input: NewDocumentInput): Promise<boolean> => {
      if (!supabase || !input.title.trim() || !input.doc_key.trim() || !input.url.trim())
        return false;

      if (input.is_baseline) {
        const { error: unsetError } = await supabase
          .from("documents")
          .update({ is_baseline: false })
          .eq("doc_key", input.doc_key.trim())
          .eq("is_baseline", true);
        if (unsetError) {
          setError(unsetError.message);
          return false;
        }
      }

      const { error: insertError } = await supabase.from("documents").insert({
        doc_key: input.doc_key.trim(),
        title: input.title.trim(),
        version: input.version.trim(),
        url: input.url.trim(),
        changelog: input.changelog?.trim() || null,
        is_baseline: input.is_baseline,
      });
      if (insertError) {
        setError(insertError.message);
        return false;
      }
      await refresh();
      return true;
    },
    [refresh]
  );

  const deleteDocument = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  return {
    documents,
    loading,
    error,
    configured: isSupabaseConfigured,
    createDocument,
    deleteDocument,
  };
}
