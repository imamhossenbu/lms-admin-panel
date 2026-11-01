"use client";

import React, { Suspense } from "react";
import { TeamView } from "@/components/team/TeamView";
import { TeamSkeleton } from "@/components/team/TeamSkeleton";

/** Team & Roles — admin-panel staff (`?tab`, `?q`, `?role`, `?status`, `?state`, `?type`, `?page` survive reloads). */
export default function TeamPage() {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamView />
    </Suspense>
  );
}
