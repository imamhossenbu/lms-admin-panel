"use client";

import React, { useEffect, useState } from "react";
import type { LiveClassItem } from "@/types/liveClass";
import { fetchLiveClassBundle } from "@/lib/liveClassStorage";
import { LiveClassForm } from "./LiveClassForm";
import { LiveClassFormSkeleton } from "./LiveClassFormSkeleton";
import { LiveClassNotFound } from "./LiveClassNotFound";

export type LiveClassFormViewProps = { mode: "create" } | { mode: "edit"; classId: string };

/** Route entry for /live-classes/schedule and /live-classes/[id]/edit (loads the class when editing). */
export function LiveClassFormView(props: LiveClassFormViewProps) {
  const classId = props.mode === "edit" ? props.classId : null;
  const [state, setState] = useState<{ id: string | null; item: LiveClassItem | null; loaded: boolean }>({ id: null, item: null, loaded: false });

  useEffect(() => {
    if (!classId) return;
    let alive = true;
    fetchLiveClassBundle(classId).then(
      (bundle) => alive && setState({ id: classId, item: bundle?.liveClass ?? null, loaded: true }),
      () => alive && setState({ id: classId, item: null, loaded: true })
    );
    return () => {
      alive = false;
    };
  }, [classId]);

  if (!classId) return <LiveClassForm mode="create" />;
  if (!state.loaded || state.id !== classId) return <LiveClassFormSkeleton />;
  if (!state.item) return <LiveClassNotFound />;
  return <LiveClassForm key={state.item.id} mode="edit" original={state.item} />;
}

export default LiveClassFormView;
