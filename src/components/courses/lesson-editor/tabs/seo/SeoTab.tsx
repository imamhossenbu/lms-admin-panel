"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import { SearchPreviewCard } from "./SearchPreviewCard";
import { SeoAnalysisCard } from "./SeoAnalysisCard";
import { SeoSettingsCard } from "./SeoSettingsCard";
import { SeoTipsCard } from "./SeoTipsCard";

/** Edit Lesson → SEO tab (form section `seo`). */
export function SeoTab({ context }: LessonEditorTabProps) {
  const publicUrl = context.course.publicUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5"
    >
      <div className="min-w-0 lg:col-span-3">
        <SeoSettingsCard publicUrl={publicUrl} />
      </div>
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <SearchPreviewCard publicUrl={publicUrl} />
        <SeoAnalysisCard>
          <SeoTipsCard />
        </SeoAnalysisCard>
      </div>
    </motion.div>
  );
}

export default SeoTab;
