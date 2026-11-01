"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LiveDetailTab, LiveTabProps } from "./liveTabTypes";
import { OverviewTab } from "./tabs/overview/OverviewTab";
import { StudentsTab } from "./tabs/students/StudentsTab";
import { AttendanceTab } from "./tabs/attendance/AttendanceTab";
import { QaTab } from "./tabs/qa/QaTab";
import { ResourcesTab } from "./tabs/resources/ResourcesTab";
import { ActivityTab } from "./tabs/activity/ActivityTab";
import { SettingsTab } from "./tabs/settings/SettingsTab";

const PANELS: Record<LiveDetailTab, (props: LiveTabProps) => React.ReactNode> = {
  overview: OverviewTab,
  students: StudentsTab,
  attendance: AttendanceTab,
  qa: QaTab,
  resources: ResourcesTab,
  activity: ActivityTab,
  settings: SettingsTab,
};

export interface LiveDetailPanelsProps extends LiveTabProps {
  activeTab: LiveDetailTab;
}

/** Renders the active tab body (each tab owns its own layout). */
export function LiveDetailPanels({ activeTab, ...tabProps }: LiveDetailPanelsProps) {
  const Panel = PANELS[activeTab];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        role="tabpanel"
        id={`live-class-panel-${activeTab}`}
        aria-labelledby={`live-class-tab-${activeTab}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Panel {...tabProps} />
      </motion.div>
    </AnimatePresence>
  );
}

export default LiveDetailPanels;
