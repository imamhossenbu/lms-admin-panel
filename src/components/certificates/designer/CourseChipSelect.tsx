"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Info } from "lucide-react";
import type { CertificateTemplate } from "@/types/certificate";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { activeTemplateFor } from "@/lib/certificateStats";
import { cn } from "@/lib/cn";
import { courseTitleOf } from "./designerUtils";

export interface CourseChipSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  /** All templates (to warn about courses owned by another active template). */
  templates: CertificateTemplate[];
  /** The template being edited (excluded from the conflict check). */
  selfId?: string;
  /** Whether this template will be ACTIVE on save (conflicts move only then). */
  willBeActive: boolean;
  hasError?: boolean;
}

/** Toggleable course chips + a warning per selected course already assigned to another active template. */
export function CourseChipSelect({ value, onChange, templates, selfId, willBeActive, hasError }: CourseChipSelectProps) {
  const courses = useCourseCatalog();
  const others = useMemo(() => templates.filter((t) => t.id !== selfId), [templates, selfId]);
  const conflicts = value
    .map((courseId) => ({ courseId, owner: activeTemplateFor(others, courseId) }))
    .filter((c): c is { courseId: string; owner: CertificateTemplate } => !!c.owner);

  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((c) => c !== id) : [...value, id]);

  return (
    <div>
      <div role="group" aria-label="Courses" className={cn("flex flex-wrap gap-2 rounded-xl", hasError && "border border-red bg-red-14 p-2")}>
        {courses === null && (
          <div className="flex flex-wrap gap-2" aria-hidden>
            {["w-24", "w-32", "w-28", "w-36"].map((w) => (
              <span key={w} className={cn("h-8 animate-pulse rounded-full bg-slate-100", w)} />
            ))}
          </div>
        )}
        {courses?.length === 0 && <p className="body-xsm-regular text-primary-300">No courses in this workspace yet. Create a course first.</p>}
        {(courses ?? []).map((course) => {
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

      <AnimatePresence initial={false}>
        {conflicts.map(({ courseId, owner }) => (
          <motion.p
            key={courseId}
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "mt-2 flex items-start gap-2 rounded-lg border px-3 py-2 body-xsm-regular",
              willBeActive ? "border-yellow bg-yellow-bg text-yellow" : "border-blue bg-blue-14 text-blue"
            )}
          >
            {willBeActive ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            <span>
              <span className="body-xsm-medium font-semibold!">{courseTitleOf(courseId)}</span>
              {willBeActive
                ? ` will be moved from '${owner.name}'.`
                : ` currently uses '${owner.name}'. It moves here only when this template is Active.`}
            </span>
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default CourseChipSelect;
