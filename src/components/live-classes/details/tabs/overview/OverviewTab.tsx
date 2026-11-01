"use client";

import React from "react";
import type { LiveTabProps } from "../../liveTabTypes";
import { hasHappened } from "../../liveDetailFormat";
import { useLiveClassActions } from "../../hooks/useLiveClassActions";
import { LiveClassConfirmModals } from "../../LiveClassConfirmModals";
import { ClassInformationCard } from "./ClassInformationCard";
import { DescriptionCard } from "./DescriptionCard";
import { ClassSettingsSummaryCard } from "./ClassSettingsSummaryCard";
import { ClassThumbnailCard } from "./ClassThumbnailCard";
import { ClassStatisticsCard } from "./ClassStatisticsCard";
import { MeetingActionsCard } from "./MeetingActionsCard";

/** Overview: class information, description, settings summary | thumbnail, statistics, meeting actions. */
export function OverviewTab({ bundle, status, onTabChange }: LiveTabProps) {
  const { liveClass, enrollments } = bundle;
  const actions = useLiveClassActions(liveClass);
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-8">
        <ClassInformationCard liveClass={liveClass} />
        <DescriptionCard liveClass={liveClass} />
        <ClassSettingsSummaryCard settings={liveClass.settings} onManage={() => onTabChange("settings")} />
      </div>
      <div className="space-y-5 xl:col-span-4">
        <ClassThumbnailCard liveClass={liveClass} />
        <ClassStatisticsCard liveClass={liveClass} enrollments={enrollments} happened={hasHappened(status)} />
        <MeetingActionsCard status={status} actions={actions} />
      </div>
      <LiveClassConfirmModals title={liveClass.title} enrolled={enrollments.length} actions={actions} />
    </div>
  );
}

export default OverviewTab;
