"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SectionCard } from "@/components/ui/SectionCard";

const ENGAGEMENT_DATA = [
  { day: "Mon", activeStudents: 3420, liveAttendance: 850 },
  { day: "Tue", activeStudents: 4100, liveAttendance: 1120 },
  { day: "Wed", activeStudents: 4890, liveAttendance: 1450 },
  { day: "Thu", activeStudents: 4620, liveAttendance: 1290 },
  { day: "Fri", activeStudents: 5200, liveAttendance: 1680 },
  { day: "Sat", activeStudents: 3950, liveAttendance: 920 },
  { day: "Sun", activeStudents: 3100, liveAttendance: 740 },
];

export function StudentEngagementChart() {
  return (
    <SectionCard
      title="Weekly Active Students & Live Class Attendance"
      description="Daily unique logins and concurrent virtual classroom attendees"
    >
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ENGAGEMENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F2854",
                borderColor: "#1C355E",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="activeStudents" fill="#1C4D8D" radius={[4, 4, 0, 0]} name="Active Students" />
            <Bar dataKey="liveAttendance" fill="#4988C4" radius={[4, 4, 0, 0]} name="Live Attendees" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
