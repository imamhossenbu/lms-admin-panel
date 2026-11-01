"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatCurrency, formatNumber, type CourseRow } from "@/lib/analytics";

interface TopCoursesCardProps {
  /** topCourses(sources, range, "revenue", 5). */
  courses: CourseRow[];
  currency: string;
}

/** Best-selling courses in the range: enrollments, net revenue and share of the top list's revenue. */
export function TopCoursesCard({ courses, currency }: TopCoursesCardProps) {
  const maxRevenue = Math.max(0, ...courses.map((c) => c.revenue));

  const columns = useMemo<ColumnDef<CourseRow>[]>(
    () => [
      {
        key: "course",
        header: "Course",
        render: (row) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={row.thumbnailUrl} name={row.title} size={32} className="rounded-lg" />
            <div className="min-w-0">
              <span className="body-sm-medium text-primary-500 font-medium block truncate max-w-56">{row.title}</span>
              <span className="body-2xsm-regular text-primary-300 block truncate">{row.instructor}</span>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        render: (row) => (
          <ToneBadge tone="gray" size="sm">
            {row.category}
          </ToneBadge>
        ),
      },
      {
        key: "enrollments",
        header: "Enrollments",
        align: "right",
        render: (row) => <span className="body-sm-medium text-primary-500 font-semibold">{formatNumber(row.enrollments)}</span>,
      },
      {
        key: "revenue",
        header: "Revenue",
        align: "right",
        render: (row) => (
          <span className="body-sm-medium text-primary-500 font-semibold whitespace-nowrap">{formatCurrency(row.revenue, currency)}</span>
        ),
      },
      {
        key: "share",
        header: "Performance",
        render: (row) => (
          <div className="h-1.5 w-28 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${maxRevenue ? (row.revenue / maxRevenue) * 100 : 0}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        ),
      },
    ],
    [currency, maxRevenue]
  );

  return (
    <div className="bg-white rounded-xl border border-dash shadow-xs overflow-hidden flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-left">
          <h3 className="heading-h6 font-bold text-primary-500">Top Courses</h3>
          <p className="body-xsm-regular text-primary-300 mt-0.5">Best sellers by revenue in the selected period</p>
        </div>
        <Link
          href="/courses"
          className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="w-full border-t border-dash overflow-x-auto">
        <DataTable
          columns={columns}
          data={courses}
          rowKey={(row) => row.courseId}
          emptyMessage="No course sales in this period"
          containerClassName="border-0 rounded-none w-full"
          tableClassName="w-full"
          headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
          thClassName="px-4 py-2.5 border-none"
          cellClassName="px-4 py-2.5 border-none"
        />
      </div>
    </div>
  );
}
