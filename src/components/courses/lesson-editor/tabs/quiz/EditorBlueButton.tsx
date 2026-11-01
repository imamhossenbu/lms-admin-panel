"use client";

import React from "react";
import { PrimaryButton, type PrimaryButtonProps } from "@/components/ui/primary-button";
import { cn } from "@/lib/cn";

/** Blue primary action used inside Edit Lesson tabs ("+ Add Question", "+ Add Resource", "+ Add Note"). */
export const EditorBlueButton = React.forwardRef<HTMLButtonElement, Omit<PrimaryButtonProps, "variant">>(
  ({ className, ...props }, ref) => (
    <PrimaryButton
      ref={ref}
      variant="primary"
      className={cn("bg-blue! hover:bg-blue/90! active:bg-blue/80! text-white focus-visible:ring-blue/40", className)}
      {...props}
    />
  )
);

EditorBlueButton.displayName = "EditorBlueButton";
export default EditorBlueButton;
