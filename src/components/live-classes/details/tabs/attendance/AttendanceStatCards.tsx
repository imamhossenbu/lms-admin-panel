import React from "react";
import { CheckCircle2, Clock, Timer, UserX } from "lucide-react";
import type { LiveEnrollment } from "@/types/liveClass";
import { attendanceStats, formatMinutes } from "@/lib/liveClassStats";
import { LiveStatTile } from "../../common/LiveStatTile";

/** Attended %, Absent %, Not Joined %, Average Watch Time. */
export function AttendanceStatCards({ enrollments, happened }: { enrollments: LiveEnrollment[]; happened: boolean }) {
  const s = attendanceStats(enrollments);
  const v = (n: number | string) => (happened ? n : "-");
  const pct = (n: number) => (happened ? `${n}%` : undefined);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      <LiveStatTile tone="green" icon={<CheckCircle2 className="h-6 w-6" />} value={v(s.attended)} label="Attended" percent={pct(s.attendedPct)} index={0} />
      <LiveStatTile tone="orange" icon={<UserX className="h-6 w-6" />} value={v(s.absent)} label="Absent" percent={pct(s.absentPct)} index={1} />
      <LiveStatTile tone="purple" icon={<Clock className="h-6 w-6" />} value={v(s.notJoined)} label="Not Joined" percent={pct(s.notJoinedPct)} index={2} />
      <LiveStatTile tone="blue" icon={<Timer className="h-6 w-6" />} value={v(formatMinutes(s.avgWatchMinutes))} label="Average Watch Time" index={3} />
    </div>
  );
}

export default AttendanceStatCards;
