"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Pencil, Wand2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface OutlineModalFooterProps {
  isEditMode: boolean;
  disabled?: boolean;
  onCancel: () => void;
  onEditWithAi: () => void;
  onToggleEditMode: () => void;
  onAddToCurriculum: () => void;
}

/** Footer actions: Cancel | Edit with AI, Edit Manually, Add to Curriculum. */
export function OutlineModalFooter({
  isEditMode,
  disabled,
  onCancel,
  onEditWithAi,
  onToggleEditMode,
  onAddToCurriculum,
}: OutlineModalFooterProps) {
  return (
    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SecondaryButton type="button" onClick={onCancel}>
        Cancel
      </SecondaryButton>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <motion.button
          type="button"
          onClick={onEditWithAi}
          disabled={disabled}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-purple/30 bg-white px-4 body-sm-medium text-purple transition-colors hover:bg-purple-14 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Wand2 className="h-4 w-4" />
          Edit with AI
        </motion.button>

        <motion.button
          type="button"
          onClick={onToggleEditMode}
          disabled={disabled}
          aria-pressed={isEditMode}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 body-sm-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            isEditMode
              ? "border-brand-orange/30 bg-brand-orange-light text-brand-orange"
              : "border-dash bg-white text-primary-500 hover:bg-slate-50"
          )}
        >
          {isEditMode ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {isEditMode ? "Done Editing" : "Edit Manually"}
        </motion.button>

        <PrimaryButton type="button" onClick={onAddToCurriculum} disabled={disabled} rightIcon={<ArrowRight />}>
          Add to Curriculum
        </PrimaryButton>
      </div>
    </div>
  );
}

export default OutlineModalFooter;
