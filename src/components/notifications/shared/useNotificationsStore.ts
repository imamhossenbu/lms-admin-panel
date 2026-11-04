"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  EMPTY_NOTIFICATIONS,
  ensureNotifications,
  getNotificationsSnapshot,
  refreshNotifications,
  subscribeNotifications,
  type NotificationsData,
  type NotificationsPart,
} from "@/lib/notificationStorage";
import { useCan } from "@/lib/usePermission";

export { subscribeNotifications };

const ALL_PARTS: NotificationsPart[] = ["inbox", "broadcasts", "templates"];
/** The inbox is re-read in the background so the bell / badge pick up new notifications. */
const INBOX_POLL_MS = 60_000;

const getServerSnapshot = () => EMPTY_NOTIFICATIONS;

/**
 * Loads the given parts of the notifications store on mount (once per page session) and keeps the inbox fresh.
 * Does nothing for team members without the notifications permission.
 */
export function useNotificationsLoader(parts: NotificationsPart[] = ALL_PARTS) {
  const allowed = useCan("notifications", "view");
  const key = parts.join(",");
  useEffect(() => {
    if (!allowed) return;
    const wanted = key.split(",") as NotificationsPart[];
    void ensureNotifications(wanted).catch(() => {});
    if (!wanted.includes("inbox")) return;
    const refreshInbox = () => document.visibilityState === "visible" && void refreshNotifications(["inbox"]).catch(() => {});
    const timer = window.setInterval(refreshInbox, INBOX_POLL_MS);
    window.addEventListener("focus", refreshInbox);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshInbox);
    };
  }, [allowed, key]);
}

/** Live notifications store (inbox, broadcasts, templates, broadcast overview). Empty on the server / until loaded. */
export function useNotificationsStore(parts: NotificationsPart[] = ALL_PARTS): NotificationsData {
  useNotificationsLoader(parts);
  return useSyncExternalStore(subscribeNotifications, getNotificationsSnapshot, getServerSnapshot);
}

/** true once the given parts have loaded (use it to show skeletons). */
export function useNotificationsReady(parts: NotificationsPart[] = ALL_PARTS): boolean {
  const { loaded } = useSyncExternalStore(subscribeNotifications, getNotificationsSnapshot, getServerSnapshot);
  return parts.every((p) => loaded[p]);
}

export default useNotificationsStore;
