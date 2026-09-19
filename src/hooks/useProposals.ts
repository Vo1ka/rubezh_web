"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { NewProposalInput, ProposalRecord, ProposalStatus } from "@/lib/proposals";
import type { NewDecisionInput } from "@/lib/decisions";

export function useProposals() {
  const instanceId = useId();
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validatingIds, setValidatingIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProposals(data ?? []);
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
      .channel(`proposals-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals" },
        () => refresh()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [instanceId, refresh]);

  const createProposal = useCallback(
    async (input: NewProposalInput) => {
      if (!supabase || !input.title.trim()) return;
      const { error: insertError } = await supabase.from("proposals").insert({
        title: input.title.trim(),
        description: input.description?.trim() || null,
        proposed_by: input.proposed_by?.trim() || null,
        owner: input.owner || null,
        epic_id: input.epic_id || null,
        source_note_id: input.source_note_id || null,
      });
      if (insertError) setError(insertError.message);
      else await refresh();
    },
    [refresh]
  );

  // RW-3: switching to "На валидации" also kicks off the agent call. The
  // agent only ever writes verdict_* columns back — never `status` itself.
  const updateStatus = useCallback(
    async (id: string, status: ProposalStatus) => {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from("proposals")
        .update({ status })
        .eq("id", id);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      await refresh();

      if (status !== "validating") return;

      setValidatingIds((prev) => [...prev, id]);
      try {
        const res = await fetch("/api/proposals/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposalId: id }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}) as { error?: string });
          await supabase
            .from("proposals")
            .update({ verdict_error: body.error || `Ошибка агента: ${res.status}` })
            .eq("id", id);
        }
      } catch (e) {
        await supabase
          .from("proposals")
          .update({
            verdict_error: e instanceof Error ? e.message : "Сбой запроса к агенту-валидатору",
          })
          .eq("id", id);
      } finally {
        setValidatingIds((prev) => prev.filter((v) => v !== id));
        await refresh();
      }
    },
    [refresh]
  );

  const updateOwner = useCallback(
    async (id: string, owner: string | null) => {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from("proposals")
        .update({ owner })
        .eq("id", id);
      if (updateError) setError(updateError.message);
      else await refresh();
    },
    [refresh]
  );

  const deleteProposal = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const { error: deleteError } = await supabase.from("proposals").delete().eq("id", id);
      if (deleteError) setError(deleteError.message);
      else await refresh();
    },
    [refresh]
  );

  // RW-4: close the loop — human decision after the agent's verdict becomes
  // a real Decisions record, linked back to the Proposal in both directions.
  const promoteToDecision = useCallback(
    async (proposal: ProposalRecord, overrides?: Partial<NewDecisionInput>) => {
      if (!supabase) return null;
      const description = [
        overrides?.description ?? proposal.description,
        proposal.verdict_rationale ? `Вердикт агента: ${proposal.verdict_rationale}` : null,
        proposal.verdict_references ? `Ссылки: ${proposal.verdict_references}` : null,
      ]
        .filter(Boolean)
        .join("\n\n");

      const { data, error: insertError } = await supabase
        .from("decisions")
        .insert({
          type: overrides?.type ?? "decision",
          title: overrides?.title ?? proposal.title,
          description: description || null,
          status: overrides?.status ?? "active",
          epic_id: overrides?.epic_id ?? proposal.epic_id ?? null,
          related_ids: overrides?.related_ids ?? [],
          owner: overrides?.owner ?? proposal.owner ?? null,
          proposal_id: proposal.id,
        })
        .select()
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? "Не удалось создать запись в Решениях");
        return null;
      }

      const { error: updateError } = await supabase
        .from("proposals")
        .update({ decision_id: data.id, status: "approved" })
        .eq("id", proposal.id);
      if (updateError) setError(updateError.message);

      await refresh();
      return data.id as string;
    },
    [refresh]
  );

  return {
    proposals,
    loading,
    error,
    configured: isSupabaseConfigured,
    validatingIds,
    createProposal,
    updateStatus,
    updateOwner,
    deleteProposal,
    promoteToDecision,
  };
}
