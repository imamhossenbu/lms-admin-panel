"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { OutlineButton } from "@/components/ui/outline-button";

interface SummaryEditButtonProps {
  onClick: () => void;
  label: string;
}

/** Small outlined "Edit" button used in summary card headers. */
export function SummaryEditButton({ onClick, label }: SummaryEditButtonProps) {
  return (
    <OutlineButton size="sm" onClick={onClick} aria-label={label} leftIcon={<Pencil className="w-3.5 h-3.5" />} whileTap={{ scale: 0.95 }}>
      Edit
    </OutlineButton>
  );
}

export default SummaryEditButton;
