import type { InstructorListItem } from "@/types/instructorApi";
import { formatDate } from "@/lib/students/studentView";
import { formatRevenue } from "./instructorView";

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** Downloads the given instructors as a CSV file (Excel-friendly, UTF-8 with BOM). */
export function downloadInstructorsCsv(instructors: InstructorListItem[]) {
  const header = ["Name", "Title", "Expertise", "Email", "Phone", "Status", "Courses", "Students", "Revenue", "Rating", "Reviews", "Joined"];
  const lines = instructors.map((i) =>
    [i.name, i.title, i.expertise, i.email, i.phone, i.status, i.coursesCount, i.studentsCount, formatRevenue(i.totalRevenue), i.rating, i.reviewsCount, formatDate(i.joinDate)].map(cell).join(",")
  );
  const blob = new Blob(["﻿" + [header.map(cell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href, download: `instructors_${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
