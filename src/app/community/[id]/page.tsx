"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { ThreadView } from "@/components/community/thread/ThreadView";
import { ThreadSkeleton } from "@/components/community/thread/ThreadSkeleton";

/** Community thread: Discussion (post, accepted answer, replies, composer) and Reports tabs (`?tab=`, `?rsort=`, `?review=`). */
function CommunityThreadContent() {
  const params = useParams<{ id: string }>();
  return <ThreadView key={params.id} threadId={params.id} />;
}

export default function CommunityThreadPage() {
  return (
    <Suspense fallback={<ThreadSkeleton />}>
      <CommunityThreadContent />
    </Suspense>
  );
}
