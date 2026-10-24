"use client";

import React from "react";
import { User, Edit2 } from "lucide-react";
import { StudentFullDetails } from "./mockStudentDetails";

interface StudentInfoOverviewCardProps {
  student: StudentFullDetails;
  onEdit?: () => void;
}

export function StudentInfoOverviewCard({
  student,
  onEdit,
}: StudentInfoOverviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <h2 className="title-medium font-bold text-primary-500">
            Student Information
          </h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-primary-400" />
          <span>Edit</span>
        </button>
      </div>

      {/* Info List */}
      <div className="space-y-4 pt-1 divide-y divide-dash">
        <div className="flex items-center justify-between pt-3 first:pt-0">
          <span className="body-sm-regular text-primary-400">Full Name</span>
          <span className="body-sm-medium font-semibold text-primary-500">
            {student.name}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="body-sm-regular text-primary-400">Email</span>
          <span className="body-sm-medium text-primary-500">
            {student.email}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="body-sm-regular text-primary-400">Phone</span>
          <span className="body-sm-medium text-primary-500">
            {student.phone} <span className="text-primary-300 ml-1">—</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="body-sm-regular text-primary-400">Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {student.status}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="body-sm-regular text-primary-400">Joined Date</span>
          <span className="body-sm-medium text-primary-500">
            {student.joinedDate}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="body-sm-regular text-primary-400">Student ID</span>
          <span className="body-sm-medium font-semibold text-primary-500 font-mono">
            {student.studentIdCode}
          </span>
        </div>
      </div>
    </div>
  );
}
