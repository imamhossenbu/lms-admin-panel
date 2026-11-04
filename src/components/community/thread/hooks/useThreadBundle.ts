"use client";

import { useEffect, useRef, useState } from "react";
import { COMMUNITY_UPDATED_EVENT, fetchRelatedThreads, fetchThread, recordThreadView, type RelatedThread, type ThreadBundle } from "@/lib/communityStorage";

export interface ThreadPageData {
  bundle: ThreadBundle;
  /** "Similar Discussions" sidebar (same course, shared tags first). */
  related: RelatedThread[];
}

export type ThreadState = { kind: "loading" } | { kind: "notFound" } | { kind: "ready"; data: ThreadPageData };

/** Loads the thread bundle, reloads on COMMUNITY_UPDATED_EVENT and records one view per session. */
export function useThreadBundle(threadId: string) {
  const [state, setState] = useState<ThreadState>({ kind: "loading" });
  const viewed = useRef(false);

  useEffect(() => {
    let alive = true;
    const run = () => {
      Promise.all([fetchThread(threadId), fetchRelatedThreads(threadId).catch(() => [] as RelatedThread[])])
        .then(([bundle, related]) => {
          if (!alive) return;
          if (!bundle) {
            setState({ kind: "notFound" });
            return;
          }
          setState({ kind: "ready", data: { bundle, related } });
          if (!viewed.current) {
            viewed.current = true;
            recordThreadView(threadId);
          }
        })
        .catch(() => alive && setState({ kind: "notFound" }));
    };
    run();
    window.addEventListener(COMMUNITY_UPDATED_EVENT, run);
    return () => {
      alive = false;
      window.removeEventListener(COMMUNITY_UPDATED_EVENT, run);
    };
  }, [threadId]);

  return state;
}
