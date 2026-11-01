"use client";

import { useEffect, useState } from "react";
import type { LiveDisplayStatus } from "@/types/liveClass";
import { fetchLiveClassBundle, LIVE_CLASSES_UPDATED_EVENT, type LiveClassBundle } from "@/lib/liveClassStorage";
import { liveStatus } from "@/lib/liveClassStats";

export type LiveBundleState = { kind: "loading" } | { kind: "notFound" } | { kind: "ready"; bundle: LiveClassBundle };

/**
 * Loads the class bundle, reloads it on LIVE_CLASSES_UPDATED_EVENT and re-derives the display status
 * every 30s so a LIVE class flips to COMPLETED without a reload.
 */
export function useLiveClassBundle(classId: string) {
  const [state, setState] = useState<LiveBundleState>({ kind: "loading" });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let alive = true;
    const run = () => {
      fetchLiveClassBundle(classId)
        .then((bundle) => alive && setState(bundle ? { kind: "ready", bundle } : { kind: "notFound" }))
        .catch(() => alive && setState({ kind: "notFound" }));
    };
    run();
    window.addEventListener(LIVE_CLASSES_UPDATED_EVENT, run);
    return () => {
      alive = false;
      window.removeEventListener(LIVE_CLASSES_UPDATED_EVENT, run);
    };
  }, [classId]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const status: LiveDisplayStatus | null = state.kind === "ready" ? liveStatus(state.bundle.liveClass, now) : null;
  return { state, status, now };
}
