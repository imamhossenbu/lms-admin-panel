import React from "react";
import type { AttendanceStatus } from "@/types/liveClass";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { ATTENDANCE_LABEL } from "../liveDetailFormat";

const TONE: Record<AttendanceStatus, Tone> = { ATTENDED: "green", ABSENT: "red", NOT_JOINED: "gray" };

/** Attended (green) / Absent (red) / Not Joined (gray). */
export function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  return <ToneBadge tone={TONE[status]}>{ATTENDANCE_LABEL[status]}</ToneBadge>;
}

export default AttendanceBadge;
