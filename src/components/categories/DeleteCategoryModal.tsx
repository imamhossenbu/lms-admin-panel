"use client";

import React, { useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCategoryItem } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategoryItem | null;
  onConfirm: (category: AdminCategoryItem) => Promise<void>;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onConfirm,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(category);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const courseCount = category._count?.courses ?? 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      subtitle={`Permanently remove "${category.name}" from your system.`}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <SecondaryButton type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-3 text-left">
        <div className="p-3 rounded-[10px] bg-rose-50 border border-rose-200/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-rose-900 body-sm-regular">
            <span className="font-semibold block mb-0.5">Warning: Destructive Action</span>
            {courseCount > 0 ? (
              <p>
                This category currently has{" "}
                <span className="font-bold">{courseCount} associated courses</span>.
                Deleting it may unassign those courses or cause broken filters.
              </p>
            ) : (
              <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
