"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LiveClassItem } from "@/types/liveClass";
import { cancelLiveClass, deleteLiveClass, duplicateLiveClass, restoreLiveClass, sendLiveReminder } from "@/lib/liveClassStorage";
import { errorMessage } from "../liveDetailFormat";

export type LiveConfirmKind = "cancel" | "restore" | "delete" | null;

/** Class-level actions shared by the header, the "More" menu and the Meeting Actions card. */
export function useLiveClassActions(liveClass: LiveClassItem) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<LiveConfirmKind>(null);
  const [busy, setBusy] = useState<"duplicate" | "remind" | null>(null);

  const join = useCallback(() => {
    if (!liveClass.meetingLink) {
      toast.error("No meeting link", { description: "Add a meeting link to this class first." });
      return;
    }
    window.open(liveClass.meetingLink, "_blank", "noopener,noreferrer");
  }, [liveClass.meetingLink]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(liveClass.meetingLink);
      toast.success("Meeting link copied", { description: liveClass.meetingLink });
    } catch {
      toast.error("Could not copy", { description: "Your browser blocked clipboard access." });
    }
  }, [liveClass.meetingLink]);

  const duplicate = useCallback(async () => {
    setBusy("duplicate");
    const toastId = toast.loading("Duplicating class...", { description: `Creating a copy of "${liveClass.title}".` });
    try {
      const copy = await duplicateLiveClass(liveClass.id);
      toast.success("Class duplicated", { id: toastId, description: `"${copy.title}" was created.` });
      router.push(`/live-classes/${copy.id}`);
    } catch (error) {
      toast.error("Couldn't duplicate class", { id: toastId, description: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  }, [liveClass.id, liveClass.title, router]);

  /** `onlyNotJoined` = remind everyone who hasn't attended yet. */
  const remind = useCallback(
    async (onlyNotJoined = false) => {
      setBusy("remind");
      const toastId = toast.loading("Sending reminder...", { description: "Notifying enrolled students." });
      try {
        const count = await sendLiveReminder(liveClass.id, onlyNotJoined);
        if (count === 0) toast.success("No one to remind", { id: toastId, description: "Every enrolled student has already joined." });
        else toast.success(`Reminder sent to ${count} student${count === 1 ? "" : "s"}`, { id: toastId, description: `They were reminded about "${liveClass.title}".` });
      } catch (error) {
        toast.error("Couldn't send reminder", { id: toastId, description: errorMessage(error) });
      } finally {
        setBusy(null);
      }
    },
    [liveClass.id, liveClass.title]
  );

  const confirmCancel = useCallback(async () => {
    const toastId = toast.loading("Cancelling class...", { description: "Notifying enrolled students." });
    try {
      await cancelLiveClass(liveClass.id);
      toast.success("Class cancelled", { id: toastId, description: `"${liveClass.title}" was cancelled.` });
    } catch (error) {
      toast.error("Couldn't cancel class", { id: toastId, description: errorMessage(error) });
      throw error;
    }
  }, [liveClass.id, liveClass.title]);

  const confirmRestore = useCallback(async () => {
    const toastId = toast.loading("Restoring class...");
    try {
      await restoreLiveClass(liveClass.id);
      toast.success("Class restored", { id: toastId, description: `"${liveClass.title}" is active again.` });
    } catch (error) {
      toast.error("Couldn't restore class", { id: toastId, description: errorMessage(error) });
      throw error;
    }
  }, [liveClass.id, liveClass.title]);

  const confirmDelete = useCallback(async () => {
    const toastId = toast.loading("Deleting class...", { description: "Removing the class and its attendance records." });
    try {
      await deleteLiveClass(liveClass.id);
      toast.success("Class deleted", { id: toastId, description: `"${liveClass.title}" has been removed.` });
      router.push("/live-classes");
    } catch (error) {
      toast.error("Couldn't delete class", { id: toastId, description: errorMessage(error) });
      throw error;
    }
  }, [liveClass.id, liveClass.title, router]);

  return {
    busy,
    hasLink: Boolean(liveClass.meetingLink),
    confirm,
    openConfirm: setConfirm,
    closeConfirm: () => setConfirm(null),
    join,
    copyLink,
    duplicate,
    remind,
    confirmCancel,
    confirmRestore,
    confirmDelete,
  };
}

export type LiveClassActions = ReturnType<typeof useLiveClassActions>;
