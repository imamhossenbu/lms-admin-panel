"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export interface OutlineAddModuleButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/** Dashed "+ Add New Module" button below the module list. */
export function OutlineAddModuleButton({ onClick, disabled }: OutlineAddModuleButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-dash bg-white body-medium text-brand-orange transition-colors hover:border-brand-orange/40 hover:bg-brand-orange-light disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus className="h-4 w-4" />
      Add New Module
    </motion.button>
  );
}

export default OutlineAddModuleButton;
