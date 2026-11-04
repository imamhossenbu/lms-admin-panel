import type { StudentListItem } from "@/types/studentApi";
import { formatDate, formatWatchTime } from "./studentView";

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** Downloads the given students as a CSV file (Excel-friendly, UTF-8 with BOM). */
export function downloadStudentsCsv(students: StudentListItem[]) {
  const header = ["Student ID", "Name", "Email", "Phone", "Status", "Enrolled", "Completed", "Completion %", "Avg. score %", "Watch time", "Joined"];
  const lines = students.map((s) =>
    [s.studentIdCode, s.name, s.email, s.phone, s.status, s.enrolledCoursesCount, s.completedCoursesCount, s.completionRate, s.averageScore, formatWatchTime(s.totalWatchSeconds), formatDate(s.joinDate)]
      .map(cell)
      .join(",")
  );
  const blob = new Blob(["﻿" + [header.map(cell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href, download: `students_${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
