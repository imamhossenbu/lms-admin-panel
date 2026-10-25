"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export interface OutlineAddLessonButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/** Full-width orange-tinted "+ Add Lesson" action at the bottom of an expanded module. */
export function OutlineAddLessonButton({ onClick, disabled }: OutlineAddLessonButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-orange/20 bg-brand-orange-light body-sm-medium text-brand-orange transition-colors hover:border-brand-orange/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus className="h-4 w-4" />
      Add Lesson
    </motion.button>
  );
}

export default OutlineAddLessonButton;
