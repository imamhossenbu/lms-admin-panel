"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import type { PreviewTab } from "../createCourseOptions";
import { PreviewHero } from "./PreviewHero";
import { PreviewOverviewTab } from "./PreviewOverviewTab";
import { PreviewCurriculumTab } from "./PreviewCurriculumTab";
import { PreviewInstructorBlock } from "./PreviewInstructorBlock";
import { PreviewLearnList } from "./PreviewLearnList";
import { PreviewEmptyState } from "./PreviewEmptyState";
import type { CoursePreviewData, InstructorPickerProps } from "./previewTypes";

export interface CoursePreviewContentProps extends InstructorPickerProps {
  data: CoursePreviewData;
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  size?: "compact" | "large";
}

const TAB_ITEMS: { id: PreviewTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "instructor", label: "Instructor" },
  { id: "reviews", label: "Reviews" },
];

/** Student-facing course page preview, shared by the sticky card and the full preview modal. */
export function CoursePreviewContent({
  data,
  tab,
  onTabChange,
  size = "compact",
  instructors,
  onInstructorChange,
}: CoursePreviewContentProps) {
  const picker = { instructors, onInstructorChange };
  const tabs = TAB_ITEMS.map((t) =>
    t.id === "curriculum" && data.outline ? { ...t, count: data.outline.modules.length } : t
  );

  return (
    <div className="space-y-4">
      <PreviewHero data={data} size={size} />

      <PillTabs tabs={tabs} activeId={tab} onChange={onTabChange} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
        >
          {tab === "overview" && <PreviewOverviewTab data={data} />}
          {tab === "curriculum" && <PreviewCurriculumTab outline={data.outline} />}
          {tab === "instructor" && <PreviewInstructorBlock instructor={data.instructor} detailed {...picker} />}
          {tab === "reviews" && (
            <div className="rounded-xl border border-dash">
              <PreviewEmptyState
                icon={<MessageSquareText />}
                title="No reviews yet"
                description="Student reviews will appear here once the course is published."
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {tab !== "instructor" && <PreviewInstructorBlock instructor={data.instructor} {...picker} />}
      <PreviewLearnList items={data.learnItems} />
    </div>
  );
}

export default CoursePreviewContent;
