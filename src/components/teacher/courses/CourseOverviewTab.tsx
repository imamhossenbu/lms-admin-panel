"use client";

import React from "react";
import { CheckCircle2, Gauge, Star, Users } from "lucide-react";
import type { TeacherCourseDetail } from "@/types/teacher";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { fmtDate } from "../shared/format";

type Row = TeacherCourseDetail["modules"][number]["lessons"][number] & { module: string };

/** Course › Overview: progress stats, lesson-by-lesson completions (bordered table) and the latest reviews. */
export function CourseOverviewTab({ c }: { c: TeacherCourseDetail }) {
  const rows: Row[] = c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })));
  const columns: ColumnDef<Row>[] = [
    { key: "lesson", header: "Lesson", render: (r) => <div className="min-w-0"><p className="truncate body-sm-medium text-primary-500">{r.title}</p><p className="truncate body-xsm-regular text-primary-300">{r.module}</p></div> },
    { key: "type", header: "Type", width: "120px", render: (r) => <ToneBadge tone="gray" size="sm">{r.type.charAt(0) + r.type.slice(1).toLowerCase()}</ToneBadge> },
    { key: "status", header: "Status", width: "120px", render: (r) => <ToneBadge tone={r.status === "PUBLISHED" ? "green" : "gray"} size="sm" dot>{r.status === "PUBLISHED" ? "Published" : "Draft"}</ToneBadge> },
    { key: "len", header: "Length", width: "90px", render: (r) => <span className="body-sm-regular text-primary-400">{r.durationMinutes}m</span> },
    {
      key: "done",
      header: "Completed by",
      width: "200px",
      render: (r) => {
        const pct = c.students ? Math.round((r.completions / c.students) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-brand-orange" style={{ width: `${pct}%` }} />
            </span>
            <span className="w-16 text-right body-xsm-medium text-primary-400">{r.completions} ({pct}%)</span>
          </div>
        );
      },
    },
  ];

  return (
    <>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <TrendStatCard icon={<Users />} iconClassName="bg-blue-14 text-blue" label="Students" value={`${c.students}`} />
      <TrendStatCard icon={<Gauge />} iconClassName="bg-brand-orange-light text-brand-orange" label="Average progress" value={`${c.averageProgress}%`} />
      <TrendStatCard icon={<CheckCircle2 />} iconClassName="bg-green-bg text-green" label="Completed the course" value={`${c.completed}`} />
      <TrendStatCard icon={<Star />} iconClassName="bg-yellow-bg text-yellow" label="Rating" value={c.rating ? c.rating.toFixed(1) : "—"} />
    </div>
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <h2 className="body-l-medium font-semibold text-primary-500">Lessons</h2>
      <div className="overflow-hidden rounded-lg border border-dash">
        <DataTable columns={columns} data={rows} rowKey={(r) => r.id} verticalBorders containerClassName="border-0 rounded-none" headerClassName="bg-slate-50 border-b border-dash" tableClassName="table-fixed" minWidth="min-w-200" thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap" cellClassName="px-3.5 py-3" emptyMessage={<p className="py-8 text-center body-sm-regular text-primary-300">No lessons yet.</p>} />
      </div>
    </section>
    <section className="dashboard-card shadow-2xs p-5">
      <h2 className="mb-4 body-l-medium font-semibold text-primary-500">Latest reviews</h2>
      {c.reviews.length ? (
        <ul className="divide-y divide-dash">
          {c.reviews.map((r) => (
            <li key={r.id} className="flex gap-3 py-3">
              <Avatar name={r.user.name} src={r.user.avatar} size="sm" />
              <div className="min-w-0">
                <p className="body-sm-medium text-primary-500">
                  {r.user.name} <span className="text-yellow">{"★".repeat(r.rating)}</span> <span className="body-xsm-regular text-primary-300">· {fmtDate(r.createdAt)}</span>
                </p>
                {r.reviewText && <p className="mt-0.5 body-sm-regular text-primary-400">{r.reviewText}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-sm-regular text-primary-300">No reviews yet.</p>
      )}
    </section>
    </>
  );
}

export default CourseOverviewTab;
