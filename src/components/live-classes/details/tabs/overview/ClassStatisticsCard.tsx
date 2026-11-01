"use client";

import React from "react";
import { BarChart3, CheckCircle2, Clock, UserX, Users } from "lucide-react";
import type { LiveClassItem, LiveEnrollment } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { attendanceStats, durationMinutes, formatMinutes } from "@/lib/liveClassStats";
import { LiveStatTile } from "../../common/LiveStatTile";

/** 2×2: Enrolled, Attended (+%), Absent (+%), Class Duration. */
export function ClassStatisticsCard({ liveClass, enrollments, happened }: { liveClass: LiveClassItem; enrollments: LiveEnrollment[]; happened: boolean }) {
  const s = attendanceStats(enrollments);
  return (
    <IconSectionCard icon={<BarChart3 className="h-5 w-5" />} tone="blue" title="Class Statistics">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <LiveStatTile compact tone="blue" icon={<Users className="h-5 w-5" />} value={s.enrolled} label="Enrolled Students" index={0} />
        <LiveStatTile compact tone="green" icon={<CheckCircle2 className="h-5 w-5" />} value={happened ? s.attended : "-"} label="Attended" percent={happened ? `${s.attendedPct}%` : undefined} index={1} />
        <LiveStatTile compact tone="orange" icon={<UserX className="h-5 w-5" />} value={happened ? s.absent : "-"} label="Absent" percent={happened ? `${s.absentPct}%` : undefined} index={2} />
        <LiveStatTile compact tone="purple" icon={<Clock className="h-5 w-5" />} value={formatMinutes(durationMinutes(liveClass))} label="Class Duration" index={3} />
      </div>
    </IconSectionCard>
  );
}

export default ClassStatisticsCard;
