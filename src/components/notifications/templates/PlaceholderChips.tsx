"use client";

import React from "react";
import { motion } from "framer-motion";
import { Braces } from "lucide-react";

export interface PlaceholderChipsProps {
  placeholders: string[];
  onInsert: (placeholder: string) => void;
  disabled?: boolean;
}

/** Clickable {placeholder} chips that insert at the cursor of the field above. */
export function PlaceholderChips({ placeholders, onInsert, disabled }: PlaceholderChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 inline-flex items-center gap-1 body-xsm-regular text-primary-300">
        <Braces className="h-3.5 w-3.5" />
        Insert:
      </span>
      {placeholders.map((p) => (
        <motion.button
          key={p}
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          // Keep focus (and the caret) in the field while clicking.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(p)}
          className="inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded-md border border-blue/30 bg-blue-14 px-2 py-0.5 body-xsm-medium font-semibold! text-blue transition-colors hover:border-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {p}
        </motion.button>
      ))}
    </div>
  );
}

export default PlaceholderChips;
