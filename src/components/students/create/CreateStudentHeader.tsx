"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function CreateStudentHeader() {
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
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <UserPlus className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="heading-h4 text-primary-500 tracking-tight">
            Add New Student
          </h1>
          <p className="body-sm-regular text-primary-300 mt-0.5">
            Create a new student account and enroll them in courses.
          </p>
        </div>
      </div>
    </div>
  );
}
