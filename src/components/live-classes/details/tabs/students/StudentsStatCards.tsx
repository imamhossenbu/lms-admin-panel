import React from "react";
import { CheckCircle2, Clock, UserX, Users } from "lucide-react";
import type { LiveEnrollment } from "@/types/liveClass";
import { attendanceStats } from "@/lib/liveClassStats";
import { LiveStatTile } from "../../common/LiveStatTile";

/** Enrolled, Attended %, Absent %, Not Joined %. */
export function StudentsStatCards({ enrollments, happened }: { enrollments: LiveEnrollment[]; happened: boolean }) {
  const s = attendanceStats(enrollments);
  const pct = (v: number) => (happened ? `${v}%` : undefined);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <LiveStatTile tone="blue" icon={<Users className="h-6 w-6" />} value={s.enrolled} label="Enrolled Students" index={0} />
      <LiveStatTile tone="green" icon={<CheckCircle2 className="h-6 w-6" />} value={happened ? s.attended : "-"} label="Attended" percent={pct(s.attendedPct)} index={1} />
      <LiveStatTile tone="orange" icon={<UserX className="h-6 w-6" />} value={happened ? s.absent : "-"} label="Absent" percent={pct(s.absentPct)} index={2} />
      <LiveStatTile tone="purple" icon={<Clock className="h-6 w-6" />} value={happened ? s.notJoined : "-"} label="Not Joined" percent={pct(s.notJoinedPct)} index={3} />
    </div>
  );
}

export default StudentsStatCards;
