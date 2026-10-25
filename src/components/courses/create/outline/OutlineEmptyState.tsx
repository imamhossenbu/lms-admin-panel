"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutList, Plus, Sparkles } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface OutlineEmptyStateProps {
  onAddModule: () => void;
  disabled?: boolean;
}

/** Shown when the outline is missing or has no modules. */
export function OutlineEmptyState({ onAddModule, disabled }: OutlineEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-dash bg-white px-6 py-12 text-center"
    >
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange-light text-brand-orange">
          <LayoutList className="h-8 w-8" />
        </div>
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-purple-14 text-purple">
          <Sparkles className="h-4 w-4" />
        </span>
      </div>
      <h4 className="title-medium text-primary-500">No modules in this outline yet</h4>
      <p className="mt-1 max-w-sm body-sm-regular text-primary-300">
        Regenerate the outline with AI or start building it yourself by adding the first module.
      </p>
      <PrimaryButton className="mt-5" leftIcon={<Plus />} onClick={onAddModule} disabled={disabled}>
        Add New Module
      </PrimaryButton>
    </motion.div>
  );
}

export default OutlineEmptyState;
