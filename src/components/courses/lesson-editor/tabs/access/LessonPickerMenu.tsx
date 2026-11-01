"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { LessonRow } from "./LessonRow";
import type { LessonOption } from "./lessonOptions";

export interface LessonPickerMenuProps {
  options: LessonOption[];
  selectedId?: string;
  onSelect: (lessonId: string) => void;
  emptyText?: string;
  className?: string;
}

/** Searchable lesson list used inside prerequisite dropdowns. */
export function LessonPickerMenu({ options, selectedId, onSelect, emptyText = "No lessons found", className }: LessonPickerMenuProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.moduleLabel.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div className={cn("rounded-xl border border-dash bg-white p-2 shadow-xl", className)}>
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons..."
          aria-label="Search lessons"
          className="h-9 w-full rounded-lg border border-dash bg-slate-50 pl-9 pr-3 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300 focus:border-brand-orange focus:bg-white"
        />
      </div>
      <ul role="listbox" className="max-h-64 space-y-0.5 overflow-y-auto">
        {filtered.length === 0 && <li className="px-3 py-4 text-center body-sm-regular text-primary-300">{emptyText}</li>}
        {filtered.map((lesson) => {
          const selected = lesson.id === selectedId;
          return (
            <li key={lesson.id} role="option" aria-selected={selected}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(lesson.id)}
                className={cn(
                  "w-full cursor-pointer rounded-lg px-2.5 py-2 transition-colors",
                  selected ? "bg-brand-orange-light" : "hover:bg-slate-50"
                )}
              >
                <LessonRow lesson={lesson} trailing={selected ? <Check className="h-4 w-4 shrink-0 text-brand-orange" /> : undefined} />
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LessonPickerMenu;
