"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { DiscussionFormView } from "@/components/community/form/DiscussionFormView";
import { DiscussionFormSkeleton } from "@/components/community/form/DiscussionFormSkeleton";

function EditDiscussionContent() {
  const params = useParams<{ id: string }>();
  return <DiscussionFormView key={params.id} mode="edit" threadId={params.id} />;
}

export default function EditDiscussionPage() {
  return (
    <Suspense fallback={<DiscussionFormSkeleton />}>
      <EditDiscussionContent />
    </Suspense>
  );
}
