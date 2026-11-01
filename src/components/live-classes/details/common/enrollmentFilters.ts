import type { LiveEnrollment } from "@/types/liveClass";
import { watchProgress } from "@/lib/liveClassStats";

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "ATTENDED", label: "Attended" },
  { value: "ABSENT", label: "Absent" },
  { value: "NOT_JOINED", label: "Not Joined" },
];

export const PROGRESS_OPTIONS = [
  { value: "All", label: "All Progress" },
  { value: "0", label: "0%" },
  { value: "1-50", label: "1% – 50%" },
  { value: "51-89", label: "51% – 89%" },
  { value: "90-100", label: "90% – 100%" },
];

export const ENROLLMENT_PAGE_SIZES = [10, 20, 50];

export interface EnrollmentFilterValues {
  q: string;
  status: string;
  progress: string;
}

const inBand = (pct: number, band: string) => {
  if (band === "0") return pct === 0;
  const [lo, hi] = band.split("-").map(Number);
  return pct >= lo && pct <= hi;
};

/** Search (name / email) + attendance status + progress band (pure). */
export function filterEnrollments(rows: LiveEnrollment[], f: EnrollmentFilterValues, durationMin: number) {
  const q = f.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (q && !r.student.name.toLowerCase().includes(q) && !r.student.email.toLowerCase().includes(q)) return false;
    if (f.status !== "All" && r.status !== f.status) return false;
    if (f.progress !== "All" && !inBand(watchProgress(r, durationMin), f.progress)) return false;
    return true;
  });
}
