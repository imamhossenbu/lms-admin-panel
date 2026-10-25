"use client";

import React from "react";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface InstructorFormActionsProps {
  cancelHref: string;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  submitIcon: React.ReactNode;
}

export function InstructorFormActions({
  cancelHref,
  isSubmitting,
  submitLabel,
  submittingLabel,
  submitIcon,
}: InstructorFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={cancelHref} tabIndex={-1}>
        <SecondaryButton type="button" size="lg" disabled={isSubmitting}>
          Cancel
        </SecondaryButton>
      </Link>

      <PrimaryButton
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        leftIcon={submitIcon}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </PrimaryButton>
    </div>
  );
}

export default InstructorFormActions;
