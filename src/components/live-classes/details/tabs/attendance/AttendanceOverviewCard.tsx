"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { PieChart as PieIcon } from "lucide-react";
import type { LiveEnrollment } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChartEmpty } from "@/components/ui/charts/ChartEmpty";
import { ChartTooltip } from "@/components/ui/charts/ChartTooltip";
import { CHART } from "@/components/ui/charts/chartTheme";
import { attendanceStats } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";

/** Donut of attended / absent / not joined with the attendance rate in the centre + legend. */
export function AttendanceOverviewCard({ enrollments }: { enrollments: LiveEnrollment[] }) {
  const s = attendanceStats(enrollments);
  const slices = [
    { key: "attended", name: "Attended", value: s.attended, pct: s.attendedPct, color: CHART.green, dot: "bg-green" },
    { key: "absent", name: "Absent", value: s.absent, pct: s.absentPct, color: CHART.orange, dot: "bg-brand-orange" },
    { key: "notJoined", name: "Not Joined", value: s.notJoined, pct: s.notJoinedPct, color: CHART.purple, dot: "bg-purple" },
  ];
  const visible = slices.filter((x) => x.value > 0);

  return (
    <IconSectionCard icon={<PieIcon className="h-5 w-5" />} tone="green" title="Attendance Overview" bodyClassName="@container">
      {s.enrolled === 0 ? (
        <ChartEmpty title="No students enrolled" message="The attendance split appears once students enroll." />
      ) : (
        <div className="flex flex-col items-center gap-5 @xs:flex-row">
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={visible} dataKey="value" innerRadius={54} outerRadius={76} startAngle={90} endAngle={-270} stroke="white" strokeWidth={2} animationDuration={700}>
                  {visible.map((x) => (
                    <Cell key={x.key} fill={x.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const x = payload[0].payload as (typeof slices)[number];
                    return (
                      <ChartTooltip title={x.name}>
                        {x.value} student{x.value === 1 ? "" : "s"} ({x.pct}%)
                      </ChartTooltip>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="heading-h4 font-bold! text-primary-500">{s.attendedPct}%</span>
              <span className="body-2xsm-regular text-primary-300">Attendance Rate</span>
            </div>
          </div>
          <ul className="w-full min-w-0 flex-1 space-y-3">
            {slices.map((x, i) => (
              <motion.li
                key={x.key}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-2.5"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", x.dot)} />
                <span className="flex-1 body-sm-regular text-primary-400">{x.name}</span>
                <span className="body-sm-medium font-semibold! text-primary-500 whitespace-nowrap">
                  {x.value} ({x.pct}%)
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </IconSectionCard>
  );
}

export default AttendanceOverviewCard;
