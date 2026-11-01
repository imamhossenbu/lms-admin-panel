"use client";

import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import type { LiveClassItem, LiveEnrollment } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { AXIS_TICK, CHART } from "@/components/ui/charts/chartTheme";
import { attendanceTimeline, durationMinutes } from "@/lib/liveClassStats";

/** People present over the session (5-minute samples, 10 for long classes). */
export function AttendanceTimelineCard({ liveClass, enrollments }: { liveClass: LiveClassItem; enrollments: LiveEnrollment[] }) {
  const step = durationMinutes(liveClass) > 90 ? 10 : 5;
  const data = useMemo(() => attendanceTimeline(enrollments, liveClass, step), [enrollments, liveClass, step]);
  const peak = Math.max(0, ...data.map((d) => d.present));

  return (
    <IconSectionCard icon={<TrendingUp className="h-5 w-5" />} tone="blue" title="Attendance Timeline" description={peak ? `Peak: ${peak} students present` : undefined}>
      {peak === 0 ? (
        <ChartEmpty title="No one joined" message="The timeline appears once students join the session." />
      ) : (
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="liveAttendanceTimelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={CHART.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={6} minTickGap={24} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={AXIS_TICK} domain={[0, enrollments.length || "auto"]} />
              <Tooltip
                cursor={{ stroke: CHART.grid }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as (typeof data)[number];
                  return <ChartTooltip title={row.label}>{row.present} students present</ChartTooltip>;
                }}
              />
              <Area type="monotone" dataKey="present" stroke={CHART.blue} strokeWidth={2} fill="url(#liveAttendanceTimelineFill)" dot={false} activeDot={{ r: 4.5, fill: "white", stroke: CHART.blue, strokeWidth: 2 }} animationDuration={700} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </IconSectionCard>
  );
}

export default AttendanceTimelineCard;
