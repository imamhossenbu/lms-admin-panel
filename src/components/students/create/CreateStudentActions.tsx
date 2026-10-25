"use client";

import React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface CreateStudentActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function CreateStudentActions({
  isSubmitting,
  onCancel,
}: CreateStudentActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <Link href="/students" onClick={onCancel}>
        <SecondaryButton type="button" disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
      </Link>

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        leftIcon={<UserPlus className="w-4 h-4 stroke-[2.2]" />}
      >
        {isSubmitting ? "Creating Student..." : "Create Student"}
      </PrimaryButton>
    </div>
  );
}
