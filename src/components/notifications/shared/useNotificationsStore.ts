"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { NotificationSeed } from "@/data/mockNotificationData";
import { getNotificationsSnapshot, NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notificationStorage";

const EMPTY_SEED: NotificationSeed = { inbox: [], broadcasts: [], deliveries: [], templates: [] };
const EMPTY_SNAPSHOT = JSON.stringify(EMPTY_SEED);

/** Serialized store, recomputed only after a NOTIFICATIONS_UPDATED_EVENT (avoids re-reading localStorage every render). */
let cached: string | null = null;
let listening = false;

function invalidate() {
  cached = null;
}

function getSnapshot(): string {
  if (typeof window !== "undefined" && !listening) {
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, invalidate);
    listening = true;
  }
  if (cached === null) cached = JSON.stringify(getNotificationsSnapshot());
  return cached;
}

const getServerSnapshot = () => EMPTY_SNAPSHOT;

/**
 * Subscribes to the notifications mock store. The callback is deferred a microtask so a write that happens
 * while another component renders (first-visit seeding) never triggers "update while rendering" warnings.
 */
export function subscribeNotifications(onChange: () => void) {
  const handler = () => {
    invalidate();
    queueMicrotask(onChange);
  };
  window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handler);
}

/** Live NotificationSeed (inbox, broadcasts, deliveries, templates). Empty on the server / during hydration. */
export function useNotificationsStore(): NotificationSeed {
  const snapshot = useSyncExternalStore(subscribeNotifications, getSnapshot, getServerSnapshot);
  return useMemo(() => JSON.parse(snapshot) as NotificationSeed, [snapshot]);
}

const noopSubscribe = () => () => {};

/** false on the server and during hydration, true once the client store can be read (use it to show skeletons). */
export function useNotificationsReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export default useNotificationsStore;
