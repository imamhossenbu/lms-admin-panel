"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface EditStudentActionsProps {
  studentId: string;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function EditStudentActions({
  studentId,
  isSubmitting,
  onCancel,
}: EditStudentActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <Link href={`/students/${studentId}`} onClick={onCancel}>
        <SecondaryButton type="button" disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
      </Link>

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        leftIcon={<Check className="w-4 h-4 stroke-[2.2]" />}
      >
        {isSubmitting ? "Saving Changes..." : "Save Changes"}
      </PrimaryButton>
    </div>
  );
}
