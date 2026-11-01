"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { LiveClassFormView } from "@/components/live-classes/form/LiveClassFormView";
import { LiveClassFormSkeleton } from "@/components/live-classes/form/LiveClassFormSkeleton";

function EditLiveClassContent() {
  const params = useParams<{ id: string }>();
  return <LiveClassFormView key={params.id} mode="edit" classId={params.id} />;
}

export default function EditLiveClassPage() {
  return (
    <Suspense fallback={<LiveClassFormSkeleton />}>
      <EditLiveClassContent />
    </Suspense>
  );
}
