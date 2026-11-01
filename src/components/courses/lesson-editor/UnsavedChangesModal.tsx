"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/** "Leave without saving?" confirmation used by Previous/Next Lesson. */
export function UnsavedChangesModal({ isOpen, onClose, onConfirm }: UnsavedChangesModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Leave without saving?"
      subtitle="You have unsaved changes on this lesson."
      message="If you leave now, your changes will be lost. Click “Update Lesson” first to keep them."
      confirmLabel="Leave Page"
      pendingLabel="Leaving..."
      confirmIcon={<LogOut className="h-4 w-4" />}
    />
  );
}

export default UnsavedChangesModal;
