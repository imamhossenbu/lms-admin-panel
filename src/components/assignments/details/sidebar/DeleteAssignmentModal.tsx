"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export interface DeleteAssignmentModalProps {
  isOpen: boolean;
  title: string;
  submissionCount: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/** Confirmation before deleting an assignment (and all of its submissions). */
export function DeleteAssignmentModal({ isOpen, title, submissionCount, onClose, onConfirm }: DeleteAssignmentModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Assignment"
      confirmLabel="Delete Assignment"
      pendingLabel="Deleting..."
      confirmIcon={<Trash2 />}
      message={
        <>
          <strong className="body-sm-medium font-semibold!">&ldquo;{title}&rdquo;</strong> and its {submissionCount} submission{submissionCount === 1 ? "" : "s"} will be
          permanently deleted.
        </>
      }
    />
  );
}

export default DeleteAssignmentModal;
