import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { NotificationsTab } from "./notificationsTabs";
import { InboxSkeleton } from "./inbox/InboxSkeleton";
import { TemplatesTableSkeleton } from "./templates/TemplatesTableSkeleton";

/** Mirrors /notifications: breadcrumb, title + actions, capsule tabs, then the active tab's body. */
export function NotificationsSkeleton({ tab = "inbox" }: { tab?: NotificationsTab }) {
  return (
    <div className="space-y-5 pb-8" aria-busy="true" aria-label="Loading notifications">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-md max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
      <div className="flex w-fit max-w-full gap-1.5 overflow-hidden rounded-2xl border border-dash bg-gray-bg p-1.5">
        {[28, 36, 32].map((w) => (
          <Skeleton key={w} className={`h-9 shrink-0 rounded-xl ${w === 28 ? "w-28" : w === 36 ? "w-36" : "w-32"}`} />
        ))}
      </div>
      {tab === "inbox" ? <InboxSkeleton /> : <TemplatesTableSkeleton />}
    </div>
  );
}

export default NotificationsSkeleton;
