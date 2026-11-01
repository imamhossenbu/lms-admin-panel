"use client";

import React from "react";
import { Ban, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { LiveClassActions } from "./hooks/useLiveClassActions";

export interface LiveClassConfirmModalsProps {
  title: string;
  enrolled: number;
  actions: LiveClassActions;
}

/** Cancel / Restore / Delete confirmations for one live class (driven by useLiveClassActions). */
export function LiveClassConfirmModals({ title, enrolled, actions }: LiveClassConfirmModalsProps) {
  const { confirm, closeConfirm } = actions;
  const students = `${enrolled} enrolled student${enrolled === 1 ? "" : "s"}`;
  return (
    <>
      <ConfirmModal
        isOpen={confirm === "cancel"}
        title="Cancel Class"
        subtitle="You can restore the class later."
        message={
          <>
            Cancel <strong>{title}</strong>? The meeting link will stop working and {students} will be notified.
          </>
        }
        confirmLabel="Cancel Class"
        pendingLabel="Cancelling..."
        confirmIcon={<Ban />}
        onClose={closeConfirm}
        onConfirm={actions.confirmCancel}
      />
      <ConfirmModal
        isOpen={confirm === "restore"}
        title="Restore Class"
        subtitle="The class will be scheduled again."
        message={
          <>
            Restore <strong>{title}</strong>? The meeting link becomes active again for {students}.
          </>
        }
        confirmLabel="Restore Class"
        pendingLabel="Restoring..."
        confirmIcon={<RotateCcw />}
        onClose={closeConfirm}
        onConfirm={actions.confirmRestore}
      />
      <ConfirmModal
        isOpen={confirm === "delete"}
        title="Delete Class"
        message={
          <>
            Permanently delete <strong>{title}</strong> with its attendance, Q&amp;A, resources and activity history?
          </>
        }
        confirmLabel="Delete Class"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 />}
        onClose={closeConfirm}
        onConfirm={actions.confirmDelete}
      />
    </>
  );
}

export default LiveClassConfirmModals;
