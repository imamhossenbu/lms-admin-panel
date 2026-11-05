"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { COMMUNITY_UPDATED_EVENT, fetchThreadsPage, type ThreadListItem, type ThreadQuery, type ThreadTabCounts } from "@/lib/communityStorage";
import { apiErrorMessage } from "@/lib/apiError";

/** One page of discussions from the API; re-read when the query changes or the community changes. */
export function useThreadsPage(query: ThreadQuery) {
  const [state, setState] = useState<{ rows: ThreadListItem[]; total: number; counts: ThreadTabCounts; loaded: boolean }>({ rows: [], total: 0, counts: {}, loaded: false });
  const key = JSON.stringify(query);

  useEffect(() => {
    let alive = true;
    const q = JSON.parse(key) as ThreadQuery;
    const load = () =>
      fetchThreadsPage(q).then(
        (res) => alive && setState({ ...res, loaded: true }),
        (err) => {
          if (!alive) return;
          setState((s) => ({ ...s, loaded: true }));
          toast.error("Couldn't load discussions", { description: apiErrorMessage(err, "Please try again.") });
        }
      );
    void load();
    const onUpdate = () => void load();
    window.addEventListener(COMMUNITY_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(COMMUNITY_UPDATED_EVENT, onUpdate);
    };
  }, [key]);

  return state;
}

export default useThreadsPage;
