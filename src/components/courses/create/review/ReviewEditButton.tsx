"use client";

import React from "react";
import { Pencil } from "lucide-react";
import SecondaryButton from "@/components/ui/secondary-button";

export interface ReviewEditButtonProps {
  onClick: () => void;
  label?: string;
}

/** Small outlined "Edit" button used in review section headers. */
export function ReviewEditButton({ onClick, label = "Edit" }: ReviewEditButtonProps) {
  return (
    <SecondaryButton size="sm" icon={<Pencil />} onClick={onClick} aria-label={label}>
      Edit
    </SecondaryButton>
  );
}

export default ReviewEditButton;
