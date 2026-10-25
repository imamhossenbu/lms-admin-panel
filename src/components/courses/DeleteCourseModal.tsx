"use client";

import React, { useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCourseItem } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: AdminCourseItem | null;
  onConfirm: (course: AdminCourseItem) => Promise<void>;
}

export function DeleteCourseModal({
  isOpen,
  onClose,
  course,
  onConfirm,
}: DeleteCourseModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !course) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(course);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Course Curriculum"
      subtitle={`Permanently remove "${course.title}" from your catalog.`}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <SecondaryButton type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Course"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-3 text-left">
        <div className="p-3.5 rounded-[10px] bg-rose-50 border border-rose-200/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-rose-900 body-sm-regular">
            <span className="font-semibold block mb-0.5">Warning: Destructive Action</span>
            <p>
              This will remove the course curriculum, modules, and all student enrollment
              records associated with this course ID. This action cannot be reversed.
            </p>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
