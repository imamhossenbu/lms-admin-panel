"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface CreateStudentHeaderProps {
  onBack?: () => void;
}

export function CreateStudentHeader({ onBack }: CreateStudentHeaderProps) {
  return (
    <div className="space-y-4 mb-6 text-left">
      {/* Reusable Breadcrumb Navigation with ChevronRight */}
      <Breadcrumb
        items={[
          { label: "Students", href: "/students" },
          { label: "Add New Student" },
        ]}
      />

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href="/students"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-primary-400" />
          <span>Back to Students</span>
        </Link>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="heading-h4 font-bold text-primary-500 tracking-tight">
              Add New Student
            </h1>
            <p className="body-sm-regular text-primary-300 mt-0.5">
              Create a new student account and enroll them in courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
