"use client";

import React from "react";
import { motion } from "framer-motion";

export interface IconActionButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

/** Square bordered blue icon button used in the submissions row actions. */
export function IconActionButton({ label, onClick, children }: IconActionButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white text-blue transition-colors hover:bg-blue-14"
    >
      {children}
    </motion.button>
  );
}

export default IconActionButton;
