"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { cn } from "@/lib/cn";

export interface CourseChipMultiSelectProps {
  id?: string;
  value: string[];
  onChange: (ids: string[]) => void;
  hasError?: boolean;
}

/** Toggleable course chips (single-line, orange when selected). */
export function CourseChipMultiSelect({ id, value, onChange, hasError }: CourseChipMultiSelectProps) {
  const catalog = useCourseCatalog();
  const toggle = (courseId: string) => onChange(value.includes(courseId) ? value.filter((c) => c !== courseId) : [...value, courseId]);

  return (
    <div id={id} role="group" aria-label="Courses" className={cn("flex flex-wrap gap-2 rounded-xl", hasError && "border border-red bg-red-14 p-2")}>
      {catalog === null && <span className="body-xsm-regular text-primary-300">Loading courses...</span>}
      {catalog?.length === 0 && <span className="body-xsm-regular text-primary-300">No courses yet. Create a course first.</span>}
      {(catalog ?? []).map((course) => {
        const selected = value.includes(course.value);
        return (
          <motion.button
            key={course.value}
            type="button"
            aria-pressed={selected}
            whileTap={{ scale: 0.96 }}
            onClick={() => toggle(course.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 body-xsm-medium transition-colors",
              selected ? "border-brand-orange bg-brand-orange-light text-brand-orange" : "border-dash bg-white text-primary-400 hover:border-primary-300/40"
            )}
          >
            <AnimatePresence initial={false}>
              {selected && (
                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="inline-flex overflow-hidden">
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            {course.label}
          </motion.button>
        );
      })}
    </div>
  );
}

export default CourseChipMultiSelect;
