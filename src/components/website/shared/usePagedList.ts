"use client";

import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * Loads one server page whenever `key` (query + page) changes; `reload` after a mutation. `loading` is derived:
 * true while the latest request (key + reload counter) hasn't answered yet — the previous page stays on screen.
 */
export function usePagedList<T>(load: () => Promise<T>, key: string) {
  const [nonce, setNonce] = useState(0);
  const requestKey = `${key}#${nonce}`;
  const [state, setState] = useState<{ data: T | null; error: string | null; doneKey: string | null }>({ data: null, error: null, doneKey: null });

  useEffect(() => {
    let alive = true;
    load()
      .then((data) => alive && setState({ data, error: null, doneKey: requestKey }))
      .catch((e) => alive && setState((s) => ({ ...s, error: apiErrorMessage(e), doneKey: requestKey })));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data: state.data, error: state.error, loading: state.doneKey !== requestKey, reload };
}
