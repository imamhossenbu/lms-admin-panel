"use client";

import React from "react";
import type { DragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export interface OutlineDragHandleProps {
  controls: DragControls;
  label: string;
  disabled?: boolean;
  className?: string;
}

/** Grip that starts a framer-motion Reorder drag; the rest of the row stays clickable. */
export function OutlineDragHandle({ controls, label, disabled, className }: OutlineDragHandleProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onPointerDown={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        controls.start(event);
      }}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "inline-flex h-8 w-6 shrink-0 touch-none items-center justify-center rounded-md text-primary-300 transition-colors hover:bg-slate-100 hover:text-primary-400",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}

export default OutlineDragHandle;
