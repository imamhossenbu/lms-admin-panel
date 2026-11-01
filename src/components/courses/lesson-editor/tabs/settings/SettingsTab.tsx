"use client";

import React from "react";
import { ProTipCard } from "@/components/ui/ProTipCard";
import type { LessonEditorTabProps } from "../../tabTypes";
import { TabColumns } from "../../fields/TabColumns";
import { LessonBehaviourCard } from "./LessonBehaviourCard";
import { DifficultyCard } from "./DifficultyCard";
import { LessonTagsCard } from "./LessonTagsCard";

/**
 * Settings tab: lesson behaviour + completion rule (left), difficulty, tags and a tip (right).
 * Receives LessonEditorTabProps like every tab but needs none of them (all data comes from the form).
 */
export const SettingsTab: React.FC<LessonEditorTabProps> = () => {
  return (
    <TabColumns
      main={<LessonBehaviourCard />}
      side={
        <>
          <DifficultyCard />
          <LessonTagsCard />
          <ProTipCard>
            Turn on <strong className="body-xsm-regular font-bold! text-primary-500">Free Preview</strong> for your first lesson — it is the best way to convert visitors into enrolled students.
          </ProTipCard>
        </>
      }
    />
  );
};

export default SettingsTab;
