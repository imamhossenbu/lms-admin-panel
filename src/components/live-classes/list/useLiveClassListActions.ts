"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { LiveClassItem } from "@/types/liveClass";
import { cancelLiveClass, deleteLiveClass, duplicateLiveClass, restoreLiveClass } from "@/lib/liveClassStorage";
import { apiErrorMessage } from "@/lib/apiError";

const errorText = (err: unknown, fallback: string) => apiErrorMessage(err, fallback);

/** Row + bulk mutations with the loading → success / error toast lifecycle. Storage events refresh the list. */
export function useLiveClassListActions() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const run = async (id: string, loading: string, done: string, fail: string, fn: () => Promise<unknown>, rethrow = false) => {
    setBusyId(id);
    const toastId = toast.loading(loading);
    try {
      await fn();
      toast.success(done, { id: toastId });
    } catch (err) {
      toast.error(fail, { id: toastId, description: errorText(err, "Something went wrong. Please try again.") });
      if (rethrow) throw err;
    } finally {
      setBusyId(null);
    }
  };

  const cancel = (c: LiveClassItem) =>
    run(c.id, "Cancelling class...", "Class cancelled", "Couldn't cancel the class", () => cancelLiveClass(c.id), true);
  const restore = (c: LiveClassItem) =>
    run(c.id, "Restoring class...", "Class restored", "Couldn't restore the class", () => restoreLiveClass(c.id));
  const duplicate = (c: LiveClassItem) =>
    run(c.id, "Duplicating class...", "Class duplicated", "Couldn't duplicate the class", () => duplicateLiveClass(c.id));
  const remove = (c: LiveClassItem) =>
    run(c.id, "Deleting class...", "Class deleted", "Couldn't delete the class", () => deleteLiveClass(c.id), true);

  const copyLink = async (c: LiveClassItem) => {
    if (!c.meetingLink) {
      toast.error("No meeting link", { description: "Add a meeting link to this class first." });
      return;
    }
    try {
      await navigator.clipboard.writeText(c.meetingLink);
      toast.success("Meeting link copied", { description: c.meetingLink });
    } catch {
      toast.error("Couldn't copy the link", { description: "Your browser blocked clipboard access." });
    }
  };

  const bulk = async (items: LiveClassItem[], verb: string, fn: (id: string) => Promise<unknown>) => {
    if (!items.length) return;
    setIsBulkBusy(true);
    const label = `${items.length} class${items.length === 1 ? "" : "es"}`;
    const toastId = toast.loading(`${verb} ${label}...`);
    try {
      for (const item of items) await fn(item.id);
      toast.success(`${label} ${verb === "Deleting" ? "deleted" : "cancelled"}`, { id: toastId });
    } catch (err) {
      toast.error(`Couldn't finish ${verb.toLowerCase()} the classes`, { id: toastId, description: errorText(err, "Please try again.") });
      throw err;
    } finally {
      setIsBulkBusy(false);
    }
  };

  const bulkCancel = (items: LiveClassItem[]) => bulk(items.filter((c) => c.status !== "CANCELLED"), "Cancelling", cancelLiveClass);
  const bulkRemove = (items: LiveClassItem[]) => bulk(items, "Deleting", deleteLiveClass);

  return { busyId, isBulkBusy, cancel, restore, duplicate, remove, copyLink, bulkCancel, bulkRemove };
}

export default useLiveClassListActions;
