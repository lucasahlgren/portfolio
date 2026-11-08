import { useCallback, useEffect, useState } from "react";

import { client } from "@/lib/sanity";

type State<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refreshing: boolean;
};

const cache = new Map<string, unknown>();

export function useSanityQuery<T>(query: string, params: Record<string, string> = {}) {
  const key = query + JSON.stringify(params);
  const [state, setState] = useState<State<T>>(() => ({
    data: (cache.get(key) as T | undefined) ?? null,
    error: null,
    loading: !cache.has(key),
    refreshing: false,
  }));

  const run = useCallback(
    async (refreshing: boolean) => {
      if (!client) {
        setState({ data: null, error: null, loading: false, refreshing: false });
        return;
      }
      setState((s) => ({ ...s, refreshing, error: null }));
      try {
        const data = await client.fetch<T>(query, params);
        cache.set(key, data);
        setState({ data, error: null, loading: false, refreshing: false });
      } catch (error) {
        setState((s) => ({ ...s, error: error as Error, loading: false, refreshing: false }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  useEffect(() => {
    void run(false);
  }, [run]);

  return { ...state, refresh: () => run(true) };
}
