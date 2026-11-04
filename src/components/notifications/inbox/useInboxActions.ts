"use client";

import { useState } from "react";
import { toast } from "sonner";
import { archiveNotifications, deleteNotifications, markRead } from "@/lib/notificationStorage";
import { apiErrorMessage } from "@/lib/apiError";

const errorText = (err: unknown) => apiErrorMessage(err);
const plural = (n: number) => `${n} notification${n === 1 ? "" : "s"}`;

/** Inbox mutations with sonner feedback. Read / archive are optimistic; delete is loading → success / error. */
export function useInboxActions() {
  const [busy, setBusy] = useState(false);

  /** Optimistic: the list updates at once; a failure rolls it back and shows an error. */
  const setRead = async (ids: string[], isRead: boolean, { silent = false } = {}) => {
    try {
      await markRead(ids, isRead);
      if (!silent) toast.success(isRead ? "Marked as read" : "Marked as unread", { description: `${plural(ids.length)} updated.` });
    } catch (err) {
      toast.error("Couldn't update notifications", { description: errorText(err) });
    }
  };

  const setArchived = async (ids: string[], isArchived: boolean) => {
    try {
      await archiveNotifications(ids, isArchived);
      toast.success(isArchived ? "Archived" : "Moved to inbox", {
        description: `${plural(ids.length)} ${isArchived ? "archived" : "restored"}.`,
        action: { label: "Undo", onClick: () => void setArchived(ids, !isArchived) },
      });
    } catch (err) {
      toast.error(isArchived ? "Couldn't archive" : "Couldn't restore", { description: errorText(err) });
    }
  };

  /** Throws on failure so ConfirmModal stays open. */
  const remove = async (ids: string[]) => {
    setBusy(true);
    const toastId = toast.loading("Deleting...", { description: plural(ids.length) });
    try {
      await deleteNotifications(ids);
      toast.success("Deleted", { id: toastId, description: `${plural(ids.length)} permanently removed.` });
    } catch (err) {
      toast.error("Couldn't delete", { id: toastId, description: errorText(err) });
      throw err;
    } finally {
      setBusy(false);
    }
  };

  return { busy, setRead, setArchived, remove };
}

export default useInboxActions;
