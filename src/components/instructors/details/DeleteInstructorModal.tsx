"use client";

import React, { useState } from "react";
import { AlertTriangle, BookOpen, Users, Trash2 } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { InstructorItem } from "@/types/instructor";

interface DeleteInstructorModalProps {
  isOpen: boolean;
  instructor: InstructorItem;
  onClose: () => void;
  /** Resolve when deleted; throw to keep the modal open. */
  onConfirm: () => Promise<void>;
}

export function DeleteInstructorModal({
  isOpen,
  instructor,
  onClose,
  onConfirm,
}: DeleteInstructorModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isDeleting ? () => {} : onClose}
      title="Delete Instructor"
      subtitle="This action cannot be undone."
      maxWidth="sm"
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {isDeleting ? "Deleting..." : "Delete Instructor"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-dash">
          <Avatar
            src={instructor.avatarUrl}
            name={instructor.name}
            size={40}
            className="rounded-full ring-1 ring-dash shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="body-sm-medium font-semibold text-primary-500 truncate">
              {instructor.name}
            </p>
            <p className="body-xsm-regular text-primary-300 truncate">{instructor.email}</p>
          </div>
          <ToneBadge tone={instructor.status === "Active" ? "green" : "red"} size="sm">
            {instructor.status}
          </ToneBadge>
        </div>

        <div className="p-3.5 rounded-xl bg-red-14 border border-red/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red shrink-0 mt-0.5" />
          <div className="body-sm-regular text-red-dark space-y-2">
            <p className="font-semibold">Deleting this instructor will:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                Unassign them from {instructor.coursesCount} course(s)
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 shrink-0" />
                Remove their access for {instructor.studentsCount} enrolled student(s)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

export default DeleteInstructorModal;
