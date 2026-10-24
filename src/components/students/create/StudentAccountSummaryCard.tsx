"use client";

import React from "react";
import { FileText, User, Mail, Phone, Calendar, Clock } from "lucide-react";

interface StudentAccountSummaryCardProps {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  enrolledCoursesCount: number;
}

export function StudentAccountSummaryCard({
  name,
  email,
  phone,
  status = "Active",
  enrolledCoursesCount,
}: StudentAccountSummaryCardProps) {
  const displayName = name?.trim() || "Md. Rakib Hasan";
  const displayEmail = email?.trim() || "rakib.hasan@example.com";
  const displayPhone = phone?.trim() || "+880 1712 345678";

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="title-medium font-bold text-primary-500">
          Account Summary
        </h2>
      </div>

      {/* Summary List */}
      <div className="space-y-4 pt-1 divide-y divide-dash">
        {/* Student Name */}
        <div className="flex items-start justify-between gap-3 pt-3 first:pt-0">
          <div className="flex items-center gap-2 text-primary-400">
            <User className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="body-sm-regular text-primary-400">Student Name</span>
          </div>
          <span className="body-sm-medium font-semibold text-primary-500 text-right truncate max-w-[160px]">
            {displayName}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-start justify-between gap-3 pt-3">
          <div className="flex items-center gap-2 text-primary-400">
            <Mail className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="body-sm-regular text-primary-400">Email</span>
          </div>
          <span className="body-sm-medium text-primary-500 text-right truncate max-w-[180px]">
            {displayEmail}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-start justify-between gap-3 pt-3">
          <div className="flex items-center gap-2 text-primary-400">
            <Phone className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="body-sm-regular text-primary-400">Phone</span>
          </div>
          <span className="body-sm-medium text-primary-500 text-right">
            {displayPhone}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-2 text-primary-400">
            <Calendar className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="body-sm-regular text-primary-400">Status</span>
          </div>
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                status === "Active"
                  ? "bg-[#10B981]"
                  : status === "Inactive"
                  ? "bg-[#94A3B8]"
                  : "bg-[#F59E0B]"
              }`}
            />
            <span className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap">
              {status}
            </span>
          </div>
        </div>

        {/* Courses to Enroll */}
        <div className="flex items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-2 text-primary-400">
            <Clock className="w-4 h-4 text-primary-300 shrink-0" />
            <span className="body-sm-regular text-primary-400">Courses to Enroll</span>
          </div>
          <span className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap shrink-0">
            {enrolledCoursesCount} {enrolledCoursesCount === 1 ? "course" : "courses"}
          </span>
        </div>
      </div>
    </div>
  );
}
