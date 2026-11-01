"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export interface LeaveAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/** "Leave without saving?" — shown by Back to Assignments when the form has unsaved changes. */
export function LeaveAssignmentModal({ isOpen, onClose, onConfirm }: LeaveAssignmentModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Leave without saving?"
      subtitle="You have unsaved changes on this assignment."
      message="If you leave now, your changes will be discarded. Click “Save Assignment” first to keep them."
      confirmLabel="Discard & Leave"
      pendingLabel="Leaving..."
      confirmIcon={<LogOut className="h-4 w-4" />}
    />
  );
}

export default LeaveAssignmentModal;
