"use client";

import React, { Suspense } from "react";
import { DiscussionFormView } from "@/components/community/form/DiscussionFormView";
import { DiscussionFormSkeleton } from "@/components/community/form/DiscussionFormSkeleton";

export default function NewDiscussionPage() {
  return (
    <Suspense fallback={<DiscussionFormSkeleton />}>
      <DiscussionFormView mode="create" />
    </Suspense>
  );
}
