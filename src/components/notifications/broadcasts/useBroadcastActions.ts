"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Broadcast } from "@/types/notification";
import { cancelBroadcast, deleteBroadcast, duplicateBroadcast, retryFailedDeliveries } from "@/lib/notificationStorage";
import { errorMessage } from "./broadcastFormat";

export type BroadcastDialog = { kind: "cancel" | "delete"; broadcast: Broadcast } | null;

export interface BroadcastActionsOptions {
  /** Called after a successful delete (detail page navigates back to the list). */
  onDeleted?: () => void;
}

/** Duplicate / cancel / delete / retry with the loading → success / error toast lifecycle. */
export function useBroadcastActions({ onDeleted }: BroadcastActionsOptions = {}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<BroadcastDialog>(null);

  const duplicate = useCallback(
    async (b: Broadcast) => {
      setBusyId(b.id);
      const toastId = toast.loading("Duplicating broadcast...", { description: b.title });
      try {
        const copy = await duplicateBroadcast(b.id);
        toast.success("Broadcast duplicated", { id: toastId, description: "Opening the copy so you can edit and send it." });
        router.push(`/notifications/broadcasts/${copy.id}/edit`);
      } catch (err) {
        toast.error("Couldn't duplicate broadcast", { id: toastId, description: errorMessage(err) });
      } finally {
        setBusyId(null);
      }
    },
    [router]
  );

  /** Used as ConfirmModal onConfirm — rethrows so the modal stays open on failure. */
  const cancel = useCallback(async (b: Broadcast) => {
    const toastId = toast.loading("Cancelling broadcast...", { description: b.title });
    try {
      await cancelBroadcast(b.id);
      toast.success("Broadcast cancelled", { id: toastId, description: "It won't be sent. You can duplicate it later." });
    } catch (err) {
      toast.error("Couldn't cancel broadcast", { id: toastId, description: errorMessage(err) });
      throw err;
    }
  }, []);

  const remove = useCallback(
    async (b: Broadcast) => {
      const toastId = toast.loading("Deleting broadcast...", { description: b.title });
      try {
        await deleteBroadcast(b.id);
        toast.success("Broadcast deleted", { id: toastId, description: `"${b.title}" was removed.` });
        onDeleted?.();
      } catch (err) {
        toast.error("Couldn't delete broadcast", { id: toastId, description: errorMessage(err) });
        throw err;
      }
    },
    [onDeleted]
  );

  const retryFailed = useCallback(async (b: Broadcast) => {
    setBusyId(b.id);
    const toastId = toast.loading("Retrying failed deliveries...", { description: b.title });
    try {
      const n = await retryFailedDeliveries(b.id);
      toast.success(n ? `${n} ${n === 1 ? "delivery" : "deliveries"} retried` : "Nothing to retry", {
        id: toastId,
        description: n ? "The failed messages were delivered successfully." : "There are no failed deliveries left.",
      });
    } catch (err) {
      toast.error("Couldn't retry deliveries", { id: toastId, description: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  }, []);

  return {
    busyId,
    dialog,
    openCancel: (broadcast: Broadcast) => setDialog({ kind: "cancel", broadcast }),
    openDelete: (broadcast: Broadcast) => setDialog({ kind: "delete", broadcast }),
    closeDialog: () => setDialog(null),
    duplicate,
    cancel,
    remove,
    retryFailed,
  };
}

export type BroadcastActions = ReturnType<typeof useBroadcastActions>;

export default useBroadcastActions;
