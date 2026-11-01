"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProTipCard } from "@/components/ui/ProTipCard";
import type { LessonTab } from "@/validations/lessonFormSchema";
import { ResourcesPreviewCard } from "../resources/ResourcesPreviewCard";
import { LessonPreviewCard } from "./LessonPreviewCard";
import { LessonContentChecklist } from "./LessonContentChecklist";

export interface LessonPreviewPanelProps {
  tab: LessonTab;
  settingsDone: boolean;
}

function TabExtras({ tab, settingsDone }: LessonPreviewPanelProps) {
  switch (tab) {
    case "basic":
      return <ProTipCard>A clear and engaging title and thumbnail can increase student engagement by up to 80%.</ProTipCard>;
    case "content":
      return (
        <>
          <LessonContentChecklist settingsDone={settingsDone} />
          <ProTipCard>Combine video with text content, code examples and resources for the best learning experience.</ProTipCard>
        </>
      );
    case "resources":
      return <ResourcesPreviewCard />;
    case "settings":
      return (
        <ProTipCard>
          Proper lesson settings help you control content release, track progress, and improve the learning experience.
        </ProTipCard>
      );
  }
}

/** Right column of the lesson editor: live preview + tab-specific help. */
export function LessonPreviewPanel({ tab, settingsDone }: LessonPreviewPanelProps) {
  return (
    <div className="space-y-4">
      <LessonPreviewCard />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          <TabExtras tab={tab} settingsDone={settingsDone} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default LessonPreviewPanel;
