"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorOption } from "@/types/lessonEditor";

export interface GroupChecklistProps {
  groups: LessonEditorOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
}

/** "Select Groups" panel: search + checkbox list. */
export function GroupChecklist({ groups, value, onChange, disabled, error }: GroupChecklistProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? groups.filter((g) => g.label.toLowerCase().includes(q)) : groups;
  }, [groups, query]);

  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div
      aria-disabled={disabled}
      className={cn(
        "rounded-xl border p-4 transition-opacity",
        error ? "border-red" : "border-dash",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <p className="mb-3 body-sm-medium text-primary-500">Select Groups</p>
      <InputField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search groups..."
        aria-label="Search groups"
        disabled={disabled}
        leftElement={<Search className="h-4 w-4" />}
      />
      <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.map((group) => {
            const checked = value.includes(group.value);
            return (
              <motion.li key={group.value} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <motion.button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  disabled={disabled}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(group.value)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-slate-50"
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      checked ? "border-brand-orange bg-brand-orange text-white" : "border-dash bg-white"
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span className="body-sm-regular text-primary-500">{group.label}</span>
                </motion.button>
              </motion.li>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && <li className="py-3 text-center body-sm-regular text-primary-300">No groups found</li>}
      </ul>
      {error && <p className="mt-2 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default GroupChecklist;
