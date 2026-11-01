"use client";

import React from "react";
import { CheckCircle2, CircleSlash, Mail, UserX } from "lucide-react";
import { toast } from "sonner";
import type { AttendanceStatus, LiveEnrollment } from "@/types/liveClass";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { setAttendance } from "@/lib/liveClassStorage";
import { ATTENDANCE_LABEL, errorMessage } from "../liveDetailFormat";

export interface EnrollmentRowActionsProps {
  row: LiveEnrollment;
  /** Attendance can only be changed once the class has started. */
  canMark: boolean;
}

/** ⋯ menu: Mark as Attended / Absent / Not Joined (after the class started) + Email student. */
export function EnrollmentRowActions({ row, canMark }: EnrollmentRowActionsProps) {
  const mark = async (status: AttendanceStatus) => {
    const toastId = toast.loading("Updating attendance...", { description: row.student.name });
    try {
      await setAttendance(row.id, status);
      toast.success(`Marked as ${ATTENDANCE_LABEL[status]}`, { id: toastId, description: `${row.student.name}'s attendance was updated.` });
    } catch (error) {
      toast.error("Couldn't update attendance", { id: toastId, description: errorMessage(error) });
    }
  };

  const markItems = canMark
    ? ([
        { key: "ATTENDED", label: "Mark as Attended", icon: <CheckCircle2 className="h-4 w-4" /> },
        { key: "ABSENT", label: "Mark as Absent", icon: <UserX className="h-4 w-4" /> },
        { key: "NOT_JOINED", label: "Mark as Not Joined", icon: <CircleSlash className="h-4 w-4" /> },
      ] as const).map((item) => ({ ...item, disabled: row.status === item.key, onClick: () => void mark(item.key) }))
    : [];

  return (
    <RowMoreMenu
      label={`Actions for ${row.student.name}`}
      size="sm"
      items={[
        ...markItems,
        {
          key: "email",
          label: "Email Student",
          icon: <Mail className="h-4 w-4" />,
          onClick: () => window.open(`mailto:${row.student.email}`, "_self"),
          separatorBefore: markItems.length > 0,
        },
      ]}
    />
  );
}

export default EnrollmentRowActions;
