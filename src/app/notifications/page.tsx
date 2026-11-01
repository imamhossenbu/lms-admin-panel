"use client";

import React, { Suspense } from "react";
import { NotificationsView } from "@/components/notifications/NotificationsView";
import { NotificationsSkeleton } from "@/components/notifications/NotificationsSkeleton";

/** Notifications (`?tab`, `?q`, `?category`, `?status`, `?priority` survive reloads). */
export default function NotificationsPage() {
  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsView />
    </Suspense>
  );
}
