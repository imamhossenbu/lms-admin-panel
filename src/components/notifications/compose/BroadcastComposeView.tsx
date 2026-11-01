"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Broadcast } from "@/types/notification";
import { fetchBroadcast } from "@/lib/notificationStorage";
import { isKnownCourse } from "@/data/mockCourseCatalog";
import { BroadcastComposeForm } from "./BroadcastComposeForm";
import { BroadcastComposeSkeleton } from "./BroadcastComposeSkeleton";
import { BroadcastNotFound } from "./BroadcastNotFound";
import { BroadcastNotEditable } from "./BroadcastNotEditable";
import { isEditable } from "./composeUtils";

export type BroadcastComposeViewProps = { mode: "create" } | { mode: "edit"; broadcastId: string };

/** Route entry for /notifications/compose (reads ?course=) and /notifications/broadcasts/[id]/edit. Render inside <Suspense>. */
export function BroadcastComposeView(props: BroadcastComposeViewProps) {
  const broadcastId = props.mode === "edit" ? props.broadcastId : null;
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") ?? "";
  const initialCourseId = courseParam && isKnownCourse(courseParam) ? courseParam : "";
  const [state, setState] = useState<{ id: string | null; broadcast: Broadcast | null; loaded: boolean }>({ id: null, broadcast: null, loaded: false });

  useEffect(() => {
    if (!broadcastId) return;
    let alive = true;
    fetchBroadcast(broadcastId).then(
      (bundle) => alive && setState({ id: broadcastId, broadcast: bundle?.broadcast ?? null, loaded: true }),
      () => alive && setState({ id: broadcastId, broadcast: null, loaded: true })
    );
    return () => {
      alive = false;
    };
  }, [broadcastId]);

  if (!broadcastId) return <BroadcastComposeForm key={`new:${initialCourseId}`} mode="create" initialCourseId={initialCourseId} />;
  if (!state.loaded || state.id !== broadcastId) return <BroadcastComposeSkeleton />;
  if (!state.broadcast) return <BroadcastNotFound />;
  if (!isEditable(state.broadcast)) return <BroadcastNotEditable broadcast={state.broadcast} />;
  return <BroadcastComposeForm key={state.broadcast.id} mode="edit" original={state.broadcast} />;
}

export default BroadcastComposeView;
