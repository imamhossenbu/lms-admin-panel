"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";

interface SummaryEditButtonProps {
  onClick: () => void;
  label: string;
}

/** Small outlined "Edit" button used in summary card headers. */
export function SummaryEditButton({ onClick, label }: SummaryEditButtonProps) {
  return (
    <CardActionButton onClick={onClick} aria-label={label} icon={<Pencil />}>
      Edit
    </CardActionButton>
  );
}

export default SummaryEditButton;
