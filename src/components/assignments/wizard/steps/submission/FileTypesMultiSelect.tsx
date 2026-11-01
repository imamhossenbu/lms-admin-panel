"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ALL_FILE_TYPE_OPTIONS, DEFAULT_ALLOWED_FILE_TYPES } from "@/validations/assignmentWizardSchema";
import { cn } from "@/lib/cn";

export interface FileTypesMultiSelectProps {
  id?: string;
  value: string[];
  onChange: (types: string[]) => void;
  onBlur?: () => void;
  error?: string;
}

/** Chips trigger + checkbox dropdown of ALL_FILE_TYPE_OPTIONS (keeps the options' order). */
export function FileTypesMultiSelect({ id, value, onChange, onBlur, error }: FileTypesMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onBlur]);

  const toggle = (ext: string) => {
    const next = value.includes(ext) ? value.filter((v) => v !== ext) : [...value, ext];
    onChange(ALL_FILE_TYPE_OPTIONS.filter((o) => next.includes(o)).concat(next.filter((n) => !ALL_FILE_TYPE_OPTIONS.includes(n))));
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        id={id}
        type="button"
        whileTap={{ scale: 0.99 }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={!!error}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-left shadow-xs transition-colors",
          error ? "border-red bg-red-14" : "border-dash bg-white hover:border-primary-300/40",
          open && "border-blue"
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {value.length ? (
            value.map((ext) => (
              <ToneBadge key={ext} tone="gray" size="sm">
                {ext}
              </ToneBadge>
            ))
          ) : (
            <span className="body-sm-regular text-primary-300">Select allowed file types</span>
          )}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-primary-300 transition-transform", open && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-multiselectable="true"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 w-full rounded-xl border border-dash bg-white p-2 shadow-lg"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-dash px-1.5 pb-2">
              <span className="body-xsm-medium text-primary-400">{value.length} selected</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => onChange([...ALL_FILE_TYPE_OPTIONS])} className="cursor-pointer body-xsm-medium text-blue hover:underline">
                  Select all
                </button>
                <button type="button" onClick={() => onChange([...DEFAULT_ALLOWED_FILE_TYPES])} className="cursor-pointer body-xsm-medium text-primary-400 hover:underline">
                  Reset
                </button>
                <button type="button" onClick={() => onChange([])} className="cursor-pointer body-xsm-medium text-red hover:underline">
                  Clear
                </button>
              </div>
            </div>
            <div className="grid max-h-56 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">
              {ALL_FILE_TYPE_OPTIONS.map((ext) => {
                const selected = value.includes(ext);
                return (
                  <button
                    key={ext}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(ext)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 body-sm-regular transition-colors",
                      selected ? "bg-blue-14 text-blue" : "text-primary-500 hover:bg-gray-bg"
                    )}
                  >
                    <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", selected ? "border-blue bg-blue text-white" : "border-dash bg-white")}>
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {ext}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileTypesMultiSelect;
