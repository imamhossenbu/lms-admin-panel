"use client";

import React from "react";
import { Activity, CalendarCheck, FileText, Home, MessageSquare, Settings, Users } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import type { LiveClassBundle } from "@/lib/liveClassStorage";
import { LIVE_DETAIL_TAB_LABEL, LIVE_DETAIL_TABS, type LiveDetailTab } from "./liveTabTypes";

const ICON: Record<LiveDetailTab, React.ReactNode> = {
  overview: <Home />,
  students: <Users />,
  attendance: <CalendarCheck />,
  qa: <MessageSquare />,
  resources: <FileText />,
  activity: <Activity />,
  settings: <Settings />,
};

export interface LiveDetailTabsProps {
  bundle: LiveClassBundle;
  activeTab: LiveDetailTab;
  onChange: (tab: LiveDetailTab) => void;
}

/** Overview / Students / Attendance / Q&A / Resources / Activity / Settings — shared capsule PillTabs with counts. */
export function LiveDetailTabs({ bundle, activeTab, onChange }: LiveDetailTabsProps) {
  const counts: Partial<Record<LiveDetailTab, number>> = {
    students: bundle.enrollments.length,
    attendance: bundle.enrollments.filter((e) => e.status === "ATTENDED").length,
    qa: bundle.questions.length,
    resources: bundle.resources.length,
  };
  return (
    <PillTabs
      ariaLabel="Live class sections"
      idPrefix="live-class"
      activeId={activeTab}
      onChange={onChange}
      tabs={LIVE_DETAIL_TABS.map((id) => ({ id, label: LIVE_DETAIL_TAB_LABEL[id], icon: ICON[id], count: counts[id] }))}
    />
  );
}

export default LiveDetailTabs;
