"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { markRead } from "@/lib/notificationStorage";
import { inboxStats } from "@/lib/notificationStats";
import { useUrlParams } from "@/lib/useUrlParams";
import { PillTabs } from "@/components/ui/PillTabs";
import BroadcastsTab from "@/components/notifications/broadcasts/BroadcastsTab";
import { useNotificationsReady, useNotificationsStore } from "./shared/useNotificationsStore";
import { NOTIFICATIONS_TABS, parseNotificationsTab, type NotificationsTab } from "./notificationsTabs";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsSkeleton } from "./NotificationsSkeleton";
import { InboxTab } from "./inbox/InboxTab";
import { TemplatesTab } from "./templates/TemplatesTab";

/** /notifications — Inbox / Broadcasts / Templates. Tab and filters live in the URL. Render inside <Suspense>. */
export function NotificationsView() {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const ready = useNotificationsReady();
  const { inbox, broadcasts, templates } = useNotificationsStore();
  const tab = parseNotificationsTab(get("tab"));

  if (!ready) return <NotificationsSkeleton tab={tab} />;

  const unread = inboxStats(inbox).unread;
  const counts: Record<NotificationsTab, number> = {
    inbox: unread,
    broadcasts: broadcasts.filter((b) => b.status === "SCHEDULED").length,
    templates: templates.length,
  };

  const markAllRead = () => {
    markRead("all");
    toast.success("All caught up", { description: `${unread} notification${unread === 1 ? "" : "s"} marked as read.` });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <NotificationsHeader unread={unread} onMarkAllRead={markAllRead} onNewBroadcast={() => router.push("/notifications/compose")} />

      <PillTabs<NotificationsTab>
        ariaLabel="Notifications sections"
        idPrefix="notifications"
        tabs={NOTIFICATIONS_TABS.map((t) => ({ ...t, count: counts[t.id] }))}
        activeId={tab}
        onChange={(next) => set({ tab: next === "inbox" ? null : next }, { replaceAll: true })}
      />

      <motion.div
        key={tab}
        role="tabpanel"
        id={`notifications-panel-${tab}`}
        aria-labelledby={`notifications-tab-${tab}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {tab === "inbox" && <InboxTab />}
        {tab === "broadcasts" && <BroadcastsTab />}
        {tab === "templates" && <TemplatesTab />}
      </motion.div>
    </motion.div>
  );
}

export default NotificationsView;
