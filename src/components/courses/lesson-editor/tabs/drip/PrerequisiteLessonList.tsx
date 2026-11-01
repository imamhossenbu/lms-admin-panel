"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { LessonRow } from "../access/LessonRow";
import type { LessonOption } from "../access/lessonOptions";
import { AddPrerequisiteButton } from "./AddPrerequisiteButton";

export interface PrerequisiteLessonListProps {
  options: LessonOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

/** "Select prerequisite lesson(s)": selected lessons with remove + add picker. */
export function PrerequisiteLessonList({ options, value, onChange, error }: PrerequisiteLessonListProps) {
  const byId = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const selected = value.map((id) => byId.get(id)).filter((o): o is LessonOption => !!o);
  const available = options.filter((o) => !value.includes(o.id));

  return (
    <div className={cn("rounded-xl border p-3.5", error ? "border-red" : "border-dash")}>
      <p className="mb-2.5 body-sm-medium text-primary-500">Select prerequisite lesson(s)</p>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {selected.map((lesson) => (
            <motion.li
              key={lesson.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18 }}
              className="rounded-lg border border-dash bg-white px-3 py-2.5"
            >
              <LessonRow
                lesson={lesson}
                trailing={
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Remove ${lesson.title}`}
                    onClick={() => onChange(value.filter((id) => id !== lesson.id))}
                    className="cursor-pointer rounded-md p-1 text-primary-300 transition-colors hover:bg-red-14 hover:text-red"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                }
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className={cn(selected.length > 0 && "mt-2")}>
        <AddPrerequisiteButton
          options={available}
          onAdd={(id) => onChange([...value, id])}
          label={selected.length ? "Add Another Prerequisite Lesson" : "Add Prerequisite Lesson"}
        />
      </div>
      {error && <p className="mt-2 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default PrerequisiteLessonList;
