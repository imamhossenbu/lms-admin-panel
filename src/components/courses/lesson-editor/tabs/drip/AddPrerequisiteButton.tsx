"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { LessonPickerMenu } from "../access/LessonPickerMenu";
import { useDismiss } from "../access/useDismiss";
import type { LessonOption } from "../access/lessonOptions";

export interface AddPrerequisiteButtonProps {
  options: LessonOption[];
  onAdd: (lessonId: string) => void;
  label: string;
}

/** "+ Add Another Prerequisite Lesson" with a searchable lesson dropdown. */
export function AddPrerequisiteButton({ options, onAdd, label }: AddPrerequisiteButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);
  const disabled = options.length === 0;

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-dash px-3 py-2 body-xsm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" />
        {disabled ? "All lessons are already added" : label}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-1"
          >
            <LessonPickerMenu
              options={options}
              onSelect={(id) => {
                onAdd(id);
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddPrerequisiteButton;
