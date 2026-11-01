"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

/** Blue "eye" icon button for table rows (opens a details view). */
export function ViewIconButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-blue transition-colors hover:bg-blue-14"
    >
      <Eye className="h-4 w-4" />
    </motion.button>
  );
}

export default ViewIconButton;
