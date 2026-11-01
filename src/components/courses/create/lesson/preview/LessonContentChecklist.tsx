"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/cn";
import type { LessonFormValues } from "@/validations/lessonFormSchema";
import { hasRichText } from "../lessonDisplay";

export interface LessonContentChecklistProps {
  /** True once the user visited the Settings tab or changed a setting. */
  settingsDone: boolean;
}

/** "Content Checklist": x of 4 completed with a progress bar. */
export function LessonContentChecklist({ settingsDone }: LessonContentChecklistProps) {
  const { control } = useFormContext<LessonFormValues>();
  const [videoUrl, content, files, links] = useWatch({
    control,
    name: ["video.url", "content", "resourceFiles", "resourceLinks"],
  });

  const items = [
    { label: "Add video content", done: !!videoUrl?.trim() },
    { label: "Add lesson content (text, code, etc.)", done: hasRichText(content ?? "") },
    { label: "Add downloadable resources", done: (files?.length ?? 0) + (links?.length ?? 0) > 0 },
    { label: "Configure lesson settings", done: settingsDone },
  ];
  const completed = items.filter((i) => i.done).length;

  return (
    <section className="rounded-xl border border-dash bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="body-medium font-semibold text-primary-500">Content Checklist</h3>
        <span className="body-xsm-regular text-primary-300 whitespace-nowrap">
          {completed} of {items.length} completed
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-bg">
        <motion.div
          className="h-full rounded-full bg-green"
          initial={false}
          animate={{ width: `${(completed / items.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            {item.done ? (
              <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 28 }}>
                <CheckCircle2 className="h-5 w-5 fill-green text-white" />
              </motion.span>
            ) : (
              <Circle className="h-5 w-5 text-primary-300" />
            )}
            <span className={cn("body-sm-regular", item.done ? "text-primary-500" : "text-primary-400")}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LessonContentChecklist;
