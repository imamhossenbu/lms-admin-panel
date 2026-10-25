import React from "react";
import { BookOpen, CircleCheck, FilePen, Users, Star } from "lucide-react";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { AdminCourseItem } from "@/lib/types";

const pct = (part: number, total: number) => `${total ? Math.round((part / total) * 100) : 0}%`;

/** Catalog KPIs computed from the loaded courses (no invented trends). */
export function CourseStatsRow({ courses }: { courses: AdminCourseItem[] }) {
  const published = courses.filter((c) => c.status === "PUBLISHED").length;
  const drafts = courses.filter((c) => c.status === "DRAFT").length;
  const students = courses.reduce((sum, c) => sum + (Number(c.totalStudents) || 0), 0);
  const rated = courses.filter((c) => Number(c.ratingAverage) > 0);
  const avgRating = rated.length ? rated.reduce((sum, c) => sum + Number(c.ratingAverage), 0) / rated.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      <TrendStatCard icon={<BookOpen />} iconClassName="bg-blue-14 text-blue" label="Total Courses" value={courses.length.toLocaleString()} />
      <TrendStatCard
        icon={<CircleCheck />}
        iconClassName="bg-green-bg text-green"
        label="Published"
        value={published.toLocaleString()}
        trend={{ direction: "up", value: pct(published, courses.length), caption: "of all courses" }}
      />
      <TrendStatCard
        icon={<FilePen />}
        iconClassName="bg-yellow-bg text-yellow"
        label="Drafts"
        value={drafts.toLocaleString()}
        trend={{ direction: "down", value: pct(drafts, courses.length), caption: "of all courses" }}
      />
      <TrendStatCard icon={<Users />} iconClassName="bg-purple-14 text-purple" label="Total Students" value={students.toLocaleString()} />
      <TrendStatCard
        icon={<Star />}
        iconClassName="bg-brand-orange-light text-brand-orange"
        label="Avg. Rating"
        value={avgRating ? avgRating.toFixed(1) : "—"}
      />
    </div>
  );
}

export default CourseStatsRow;
