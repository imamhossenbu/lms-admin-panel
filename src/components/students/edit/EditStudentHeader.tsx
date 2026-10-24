"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface EditStudentHeaderProps {
  studentId: string;
  studentName: string;
  onBack?: () => void;
}

export function EditStudentHeader({
  studentId,
  studentName,
  onBack,
}: EditStudentHeaderProps) {
  return (
    <div className="space-y-4 mb-6 text-left">
      {/* Reusable Breadcrumb Navigation with ChevronRight */}
      <Breadcrumb
        items={[
          { label: "Students", href: "/students" },
          { label: studentName || "Student Details", href: `/students/${studentId}` },
          { label: "Edit Student" },
        ]}
      />

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href={`/students/${studentId}`}
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-primary-400" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="heading-h4 font-bold text-primary-500 tracking-tight">
              Edit Student: {studentName}
            </h1>
            <p className="body-sm-regular text-primary-300 mt-0.5">
              Update personal details, credentials, and course enrollments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
