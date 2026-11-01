"use client";

import React from "react";
import { Ban, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { BroadcastActions } from "./useBroadcastActions";

/** Cancel (scheduled) and Delete (draft / cancelled) confirmations driven by useBroadcastActions. */
export function BroadcastConfirmDialogs({ actions }: { actions: BroadcastActions }) {
  const { dialog, closeDialog } = actions;
  const b = dialog?.broadcast;
  return (
    <>
      <ConfirmModal
        isOpen={dialog?.kind === "cancel"}
        title="Cancel this broadcast?"
        subtitle="Scheduled messages won't be sent."
        message={
          <>
            <strong>{b?.title}</strong> will be marked as cancelled and nobody will receive it. You can duplicate it later to send it again.
          </>
        }
        confirmLabel="Cancel Broadcast"
        pendingLabel="Cancelling..."
        confirmIcon={<Ban className="h-4 w-4" />}
        onClose={closeDialog}
        onConfirm={() => (b ? actions.cancel(b) : Promise.resolve())}
      />
      <ConfirmModal
        isOpen={dialog?.kind === "delete"}
        title="Delete this broadcast?"
        message={
          <>
            <strong>{b?.title}</strong> will be permanently removed.
          </>
        }
        confirmLabel="Delete Broadcast"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={closeDialog}
        onConfirm={() => (b ? actions.remove(b) : Promise.resolve())}
      />
    </>
  );
}

export default BroadcastConfirmDialogs;
