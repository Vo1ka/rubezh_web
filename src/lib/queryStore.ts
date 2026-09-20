import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

// A tiny shared cache so multiple components asking for the same Supabase
// resource (e.g. the Sidebar and the page's Kanban board both wanting notes
// for the current section) share one fetch and one realtime subscription
// instead of each mount paying for its own — and so navigating back to a
// page already shows the last-known data instead of blanking to "Загрузка…".
type FetchResult<T> = { data: T | null; error: string | null };

type Store<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refCount: number;
  channel: RealtimeChannel | null;
  listeners: Set<() => void>;
  fetcher: () => Promise<FetchResult<T>>;
  subscribeRealtime: (onChange: () => void) => RealtimeChannel | null;
};

const stores = new Map<string, Store<unknown>>();

function getStore<T>(
  key: string,
  initial: T,
  fetcher: () => Promise<FetchResult<T>>,
  subscribeRealtime: (onChange: () => void) => RealtimeChannel | null
): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    store = {
      data: initial,
      loading: true,
      error: null,
      refCount: 0,
      channel: null,
      listeners: new Set(),
      fetcher,
      subscribeRealtime,
    };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

async function refresh<T>(store: Store<T>) {
  const { data, error } = await store.fetcher();
  if (error) {
    store.error = error;
  } else if (data !== null) {
    store.data = data;
    store.error = null;
  }
  store.loading = false;
  store.listeners.forEach((listener) => listener());
}

export type QuerySnapshot<T> = { data: T; loading: boolean; error: string | null };

export function getQuerySnapshot<T>(key: string, initial: T): QuerySnapshot<T> {
  const store = stores.get(key) as Store<T> | undefined;
  if (!store) return { data: initial, loading: true, error: null };
  return { data: store.data, loading: store.loading, error: store.error };
}

// Subscribes to a shared resource. The first subscriber for a given key
// triggers the fetch and opens the realtime channel; later subscribers just
// get notified of the existing (or in-flight) state. Returns an unsubscribe
// function that tears the realtime channel down once the last subscriber
// leaves — the cached data itself is kept for the next mount.
export function subscribeQuery<T>(
  key: string,
  initial: T,
  fetcher: () => Promise<FetchResult<T>>,
  subscribeRealtime: (onChange: () => void) => RealtimeChannel | null,
  onStoreChange: () => void
): () => void {
  const store = getStore(key, initial, fetcher, subscribeRealtime);
  store.listeners.add(onStoreChange);
  store.refCount += 1;

  if (store.refCount === 1) {
    store.loading = true;
    refresh(store);
    store.channel = store.subscribeRealtime(() => refresh(store));
  }

  return () => {
    store.listeners.delete(onStoreChange);
    store.refCount -= 1;
    if (store.refCount === 0 && store.channel) {
      supabase?.removeChannel(store.channel);
      store.channel = null;
    }
  };
}

// Forces an immediate refetch of a resource and notifies every subscriber —
// used after a mutation so all mounted consumers (e.g. Sidebar + page) update
// right away instead of waiting on the realtime round-trip.
export function refreshQuery(key: string) {
  const store = stores.get(key);
  if (store) refresh(store);
}
