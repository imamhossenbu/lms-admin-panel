"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CommunityThread } from "@/types/community";
import { fetchThread } from "@/lib/communityStorage";
import { isKnownCourse } from "@/data/mockCourseCatalog";
import { DiscussionForm } from "./DiscussionForm";
import { DiscussionFormSkeleton } from "./DiscussionFormSkeleton";
import { DiscussionNotFound } from "./DiscussionNotFound";

export type DiscussionFormViewProps = { mode: "create" } | { mode: "edit"; threadId: string };

/** Route entry for /community/new (reads ?course=) and /community/[id]/edit (loads the thread). Render inside <Suspense>. */
export function DiscussionFormView(props: DiscussionFormViewProps) {
  const threadId = props.mode === "edit" ? props.threadId : null;
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") ?? "";
  const initialCourseId = courseParam && isKnownCourse(courseParam) ? courseParam : "";
  const [state, setState] = useState<{ id: string | null; thread: CommunityThread | null; loaded: boolean }>({ id: null, thread: null, loaded: false });

  useEffect(() => {
    if (!threadId) return;
    let alive = true;
    fetchThread(threadId).then(
      (bundle) => alive && setState({ id: threadId, thread: bundle?.thread ?? null, loaded: true }),
      () => alive && setState({ id: threadId, thread: null, loaded: true })
    );
    return () => {
      alive = false;
    };
  }, [threadId]);

  if (!threadId) return <DiscussionForm key={`new:${initialCourseId}`} mode="create" initialCourseId={initialCourseId} />;
  if (!state.loaded || state.id !== threadId) return <DiscussionFormSkeleton />;
  if (!state.thread) return <DiscussionNotFound />;
  return <DiscussionForm key={state.thread.id} mode="edit" original={state.thread} />;
}

export default DiscussionFormView;
