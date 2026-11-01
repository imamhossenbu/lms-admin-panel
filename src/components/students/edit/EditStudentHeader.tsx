"use client";

import React from "react";
import { Edit3 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface EditStudentHeaderProps {
  studentId: string;
  studentName: string;
}

export function EditStudentHeader({
  studentId,
  studentName,
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
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <Edit3 className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="heading-h4 text-primary-500 tracking-tight">
            Edit Student: {studentName}
          </h1>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            Update personal details, credentials, and course enrollments.
          </p>
        </div>
      </div>
    </div>
  );
}
