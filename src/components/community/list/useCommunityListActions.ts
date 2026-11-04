"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CommunityThread } from "@/types/community";
import { bulkDeleteThreads, bulkSetThreadFlag, deleteThread, updateThread, type ThreadFlag } from "@/lib/communityStorage";
import { apiErrorMessage } from "@/lib/apiError";

export type { ThreadFlag };

const friendly = (error: unknown, fallback: string) => apiErrorMessage(error, fallback);
const plural = (n: number) => `${n} discussion${n === 1 ? "" : "s"}`;

/** Toast copy per flag + target value. */
export const FLAG_COPY: Record<ThreadFlag, Record<"on" | "off", { action: string; loading: string; done: string; description: string }>> = {
  isPinned: {
    on: { action: "Pin", loading: "Pinning discussion...", done: "Discussion pinned", description: "It now stays at the top of the list." },
    off: { action: "Unpin", loading: "Unpinning discussion...", done: "Discussion unpinned", description: "It is sorted with the other discussions again." },
  },
  isLocked: {
    on: { action: "Lock", loading: "Locking discussion...", done: "Discussion locked", description: "No new replies can be posted." },
    off: { action: "Unlock", loading: "Unlocking discussion...", done: "Discussion unlocked", description: "Members can reply again." },
  },
  isHidden: {
    on: { action: "Hide", loading: "Hiding discussion...", done: "Discussion hidden", description: "Students can no longer see it." },
    off: { action: "Unhide", loading: "Restoring discussion...", done: "Discussion visible again", description: "Students can see it again." },
  },
};

/** Row + bulk moderation mutations with the loading → success / error toast lifecycle. */
export function useCommunityListActions() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const setFlag = useCallback(async (t: CommunityThread, flag: ThreadFlag, value: boolean) => {
    const copy = FLAG_COPY[flag][value ? "on" : "off"];
    setBusyId(t.id);
    const toastId = toast.loading(copy.loading, { description: t.title });
    try {
      await updateThread(t.id, { [flag]: value });
      toast.success(copy.done, { id: toastId, description: copy.description });
    } catch (error) {
      toast.error("Could not update discussion", { id: toastId, description: friendly(error, "Please try again.") });
    } finally {
      setBusyId(null);
    }
  }, []);

  /** Throws on failure so ConfirmModal stays open. */
  const remove = useCallback(async (t: CommunityThread) => {
    const toastId = toast.loading("Deleting discussion...", { description: t.title });
    try {
      await deleteThread(t.id);
      toast.success("Discussion deleted", { id: toastId, description: `"${t.title}" and its replies were removed.` });
    } catch (error) {
      toast.error("Could not delete discussion", { id: toastId, description: friendly(error, "Please try again.") });
      throw error;
    }
  }, []);

  const bulkSetFlag = useCallback(async (items: CommunityThread[], flag: ThreadFlag, value: boolean) => {
    const targets = items.filter((t) => t[flag] !== value);
    const copy = FLAG_COPY[flag][value ? "on" : "off"];
    if (!targets.length) {
      toast.info("No changes needed", { description: `The selected discussions are already ${copy.done.replace("Discussion ", "").toLowerCase()}.` });
      return;
    }
    setIsBulkBusy(true);
    const toastId = toast.loading(copy.loading.replace("discussion", "discussions"), { description: plural(targets.length) });
    try {
      await bulkSetThreadFlag(targets.map((t) => t.id), flag, value);
      toast.success(copy.done.replace("Discussion", "Discussions"), { id: toastId, description: `${plural(targets.length)} updated.` });
    } catch (error) {
      toast.error("Could not update discussions", { id: toastId, description: friendly(error, "Some discussions were not updated. Please try again.") });
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  const bulkRemove = useCallback(async (items: CommunityThread[]) => {
    setIsBulkBusy(true);
    const toastId = toast.loading("Deleting discussions...", { description: plural(items.length) });
    try {
      await bulkDeleteThreads(items.map((t) => t.id));
      toast.success("Discussions deleted", { id: toastId, description: `${plural(items.length)} and their replies were removed.` });
    } catch (error) {
      toast.error("Could not delete discussions", { id: toastId, description: friendly(error, "Some discussions were not deleted. Please try again.") });
      throw error;
    } finally {
      setIsBulkBusy(false);
    }
  }, []);

  return { busyId, isBulkBusy, setFlag, remove, bulkSetFlag, bulkRemove };
}

export default useCommunityListActions;
