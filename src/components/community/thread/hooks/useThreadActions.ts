"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteThread, updateThread } from "@/lib/communityStorage";
import type { CommunityThread } from "@/types/community";
import { errorText } from "../threadFormat";

export type ThreadFlag = "isPinned" | "isLocked" | "isHidden";

const FLAG_COPY: Record<ThreadFlag, { on: [string, string, string]; off: [string, string, string] }> = {
  isPinned: {
    on: ["Pinning discussion...", "Discussion pinned", "It now stays at the top of the community list."],
    off: ["Unpinning discussion...", "Discussion unpinned", "It's back in the regular activity order."],
  },
  isLocked: {
    on: ["Locking discussion...", "Discussion locked", "No one can post new replies until it's unlocked."],
    off: ["Unlocking discussion...", "Discussion unlocked", "Members can reply again."],
  },
  isHidden: {
    on: ["Hiding from students...", "Hidden from students", "Only instructors and admins can see this discussion."],
    off: ["Making visible...", "Visible to students", "Students can see this discussion again."],
  },
};

/** Thread-level actions shared by the header, the ⋮ menu, the Moderation card and the locked notice. */
export function useThreadActions(thread: CommunityThread) {
  const router = useRouter();
  const [busy, setBusy] = useState<ThreadFlag | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const setFlag = useCallback(
    async (flag: ThreadFlag, value: boolean) => {
      const [loading, success, description] = FLAG_COPY[flag][value ? "on" : "off"];
      setBusy(flag);
      const toastId = toast.loading(loading, { description: thread.title });
      try {
        await updateThread(thread.id, { [flag]: value });
        toast.success(success, { id: toastId, description });
      } catch (e) {
        toast.error("Couldn't update the discussion", { id: toastId, description: errorText(e) });
      } finally {
        setBusy(null);
      }
    },
    [thread.id, thread.title]
  );

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}/community/${thread.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: url });
    } catch {
      toast.error("Couldn't copy the link", { description: "Your browser blocked clipboard access." });
    }
  }, [thread.id]);

  const confirmDelete = useCallback(async () => {
    const toastId = toast.loading("Deleting discussion...", { description: "Removing the discussion, its replies and reports." });
    try {
      await deleteThread(thread.id);
      toast.success("Discussion deleted", { id: toastId, description: `"${thread.title}" has been removed.` });
      router.push("/community");
    } catch (e) {
      toast.error("Couldn't delete the discussion", { id: toastId, description: errorText(e) });
      throw e;
    }
  }, [thread.id, thread.title, router]);

  return {
    busy,
    setFlag,
    togglePin: () => setFlag("isPinned", !thread.isPinned),
    toggleLock: () => setFlag("isLocked", !thread.isLocked),
    toggleHidden: () => setFlag("isHidden", !thread.isHidden),
    copyLink,
    deleteOpen,
    openDelete: () => setDeleteOpen(true),
    closeDelete: () => setDeleteOpen(false),
    confirmDelete,
  };
}

export type ThreadActions = ReturnType<typeof useThreadActions>;
