"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardEnrollment } from "@/types/dashboard";

interface RecentEnrollmentsTableProps {
  enrollments: DashboardEnrollment[];
}

export function RecentEnrollmentsTable({
  enrollments,
}: RecentEnrollmentsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-dash p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-h5 font-bold text-primary-500">
          Recent Enrollments
        </h3>
        <Link
          href="/students"
          className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Student
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Course
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Progress
              </th>
              <th className="pb-3 body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider">
                Enrolled At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={item.student.avatarUrl}
                        alt={item.student.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="body-sm-medium text-primary-500 font-medium truncate max-w-[130px]">
                      {item.student.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 body-sm-regular text-primary-400">
                  {item.course}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-3 max-w-[130px]">
                    <span className="body-xsm-medium text-primary-500 w-8 font-semibold">
                      {item.progress}%
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-orange rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 body-sm-regular text-primary-300 whitespace-nowrap">
                  {item.enrolledAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
