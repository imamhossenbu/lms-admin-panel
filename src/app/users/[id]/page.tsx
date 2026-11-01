"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { MemberDetailView } from "@/components/team/detail/MemberDetailView";
import { MemberDetailSkeleton } from "@/components/team/detail/MemberDetailSkeleton";

function MemberDetailRoute() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  return <MemberDetailView key={id} memberId={decodeURIComponent(id)} />;
}

/** Team member profile: access, security and activity. */
export default function MemberDetailPage() {
  return (
    <Suspense fallback={<MemberDetailSkeleton />}>
      <MemberDetailRoute />
    </Suspense>
  );
}
