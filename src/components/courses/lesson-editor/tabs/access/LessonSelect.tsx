"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { LessonPickerMenu } from "./LessonPickerMenu";
import { LessonRow } from "./LessonRow";
import { useDismiss } from "./useDismiss";
import type { LessonOption } from "./lessonOptions";

export interface LessonSelectProps {
  options: LessonOption[];
  value: string;
  onChange: (lessonId: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
}

/** Select-like trigger that opens a searchable lesson list (prerequisite lesson). */
export function LessonSelect({ options, value, onChange, placeholder = "Select prerequisite lesson...", error, id }: LessonSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);
  const selected = options.find((o) => o.id === value);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg border bg-white px-3.5 py-2 shadow-xs transition-colors",
          error ? "border-red bg-red-14" : open ? "border-brand-orange" : "border-dash hover:border-primary-300/40"
        )}
      >
        <span className="min-w-0 flex-1 text-left">
          {selected ? <LessonRow lesson={selected} /> : <span className="body-sm-regular text-primary-300">{placeholder}</span>}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} className="shrink-0 text-primary-300">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
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
              selectedId={value}
              onSelect={(lessonId) => {
                onChange(lessonId);
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LessonSelect;
