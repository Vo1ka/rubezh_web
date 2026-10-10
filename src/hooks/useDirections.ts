"use client";

import { useEffect, useState } from "react";
import type { DirectionOption } from "@/app/api/directions/route";

// RW-13: the direction registry, fetched once per page load and shared by
// every picker/filter on the page. The registry changes rarely (it's a file
// in the game repo), so there's no realtime channel.
type State = { directions: DirectionOption[]; loading: boolean; error: string | null };

let cached: State | null = null;
let inflight: Promise<State> | null = null;

function load(): Promise<State> {
  inflight ??= fetch("/api/directions")
    .then(async (res) => {
      const data = await res.json();
      return res.ok
        ? { directions: data.directions as DirectionOption[], loading: false, error: null }
        : { directions: [], loading: false, error: (data.error as string) ?? "Реестр недоступен" };
    })
    .catch((e) => ({ directions: [], loading: false, error: String(e) }))
    .then((state) => {
      cached = state;
      // A failed load shouldn't stick for the whole session.
      if (state.error) inflight = null;
      return state;
    });
  return inflight;
}

export function useDirections() {
  const [state, setState] = useState<State>(() => cached ?? { directions: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    load().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Name for a direction id, or null when the id isn't in the registry (anymore). */
export function directionName(directions: DirectionOption[], id: string) {
  return directions.find((d) => d.id === id)?.name ?? null;
}
