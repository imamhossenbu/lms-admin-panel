"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";

export interface ReviewEditButtonProps {
  onClick: () => void;
  label?: string;
}

/** Small outlined "Edit" button used in review section headers. */
export function ReviewEditButton({ onClick, label = "Edit" }: ReviewEditButtonProps) {
  return (
    <CardActionButton icon={<Pencil />} onClick={onClick} aria-label={label}>
      Edit
    </CardActionButton>
  );
}

export default ReviewEditButton;
