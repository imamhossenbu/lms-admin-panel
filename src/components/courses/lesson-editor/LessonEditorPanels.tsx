"use client";

import React from "react";
import { LESSON_EDITOR_TABS, type LessonEditorTab } from "@/validations/lessonEditorSchema";
import type { LessonEditorTabProps } from "./tabTypes";
import { ContentTab } from "./tabs/content/ContentTab";
import { MediaTab } from "./tabs/media/MediaTab";
import { SettingsTab } from "./tabs/settings/SettingsTab";
import { AccessTab } from "./tabs/access/AccessTab";
import { DripTab } from "./tabs/drip/DripTab";
import { SeoTab } from "./tabs/seo/SeoTab";
import { QuizTab } from "./tabs/quiz/QuizTab";
import { ResourcesTab } from "./tabs/resources/ResourcesTab";
import { NotesTab } from "./tabs/notes/NotesTab";

const TAB_COMPONENT: Record<LessonEditorTab, React.ComponentType<LessonEditorTabProps>> = {
  content: ContentTab,
  media: MediaTab,
  settings: SettingsTab,
  access: AccessTab,
  drip: DripTab,
  seo: SeoTab,
  quiz: QuizTab,
  resources: ResourcesTab,
  notes: NotesTab,
};

export interface LessonEditorPanelsProps extends Omit<LessonEditorTabProps, "onUploadingChange"> {
  activeTab: LessonEditorTab;
  uploadReporters: Record<LessonEditorTab, (uploading: boolean) => void>;
}

/** Every tab body stays mounted (inactive ones are hidden) so uploads and editor state survive tab switches. */
export function LessonEditorPanels({ activeTab, uploadReporters, ...tabProps }: LessonEditorPanelsProps) {
  return (
    <>
      {LESSON_EDITOR_TABS.map((tab) => {
        const Tab = TAB_COMPONENT[tab];
        return (
          <div key={tab} role="tabpanel" id={`lesson-panel-${tab}`} aria-labelledby={`lesson-tab-${tab}`} hidden={tab !== activeTab}>
            <Tab {...tabProps} onUploadingChange={uploadReporters[tab]} />
          </div>
        );
      })}
    </>
  );
}

export default LessonEditorPanels;
