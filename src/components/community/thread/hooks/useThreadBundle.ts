"use client";

import { useEffect, useRef, useState } from "react";
import { COMMUNITY_UPDATED_EVENT, fetchThread, getCommunitySnapshot, recordThreadView, type ThreadBundle } from "@/lib/communityStorage";
import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";

export interface ThreadPageData {
  bundle: ThreadBundle;
  /** Whole community (for "Similar Discussions"). */
  all: { threads: CommunityThread[]; replies: ThreadReply[]; reports: ThreadReport[] };
}

export type ThreadState = { kind: "loading" } | { kind: "notFound" } | { kind: "ready"; data: ThreadPageData };

/** Loads the thread bundle, reloads on COMMUNITY_UPDATED_EVENT and records one view per session. */
export function useThreadBundle(threadId: string) {
  const [state, setState] = useState<ThreadState>({ kind: "loading" });
  const viewed = useRef(false);

  useEffect(() => {
    let alive = true;
    const run = () => {
      fetchThread(threadId)
        .then((bundle) => {
          if (!alive) return;
          if (!bundle) {
            setState({ kind: "notFound" });
            return;
          }
          setState({ kind: "ready", data: { bundle, all: getCommunitySnapshot() } });
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
