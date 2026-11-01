import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TeamTab } from "./teamTabs";
import { FiltersSkeleton, HeaderSkeleton, RoleCardSkeleton, StatTileSkeleton, TableSkeleton, TabsSkeleton, TimelineSkeleton } from "./shared/TeamSkeletonParts";

/** Mirrors /users: breadcrumb + title + Invite, 4 stat tiles, capsule tabs, then the active tab's body. */
export function TeamSkeleton({ tab = "members" }: { tab?: TeamTab }) {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading team">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
      <TabsSkeleton />
      {tab === "roles" ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-96 max-w-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <RoleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="dashboard-card space-y-4 p-5">
          {tab === "invitations" ? (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3.5 w-72" />
                </div>
                <Skeleton className="h-10 w-64 rounded-lg" />
              </div>
              <TableSkeleton rows={3} cols={["w-auto", "w-36", "w-36", "w-32", "w-48"]} />
            </>
          ) : tab === "activity" ? (
            <>
              <FiltersSkeleton selects={1} />
              <TimelineSkeleton groups={3} />
            </>
          ) : (
            <>
              <FiltersSkeleton />
              <TableSkeleton rows={8} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamSkeleton;
