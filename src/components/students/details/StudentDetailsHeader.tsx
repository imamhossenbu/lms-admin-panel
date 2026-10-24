"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Edit3, MoreHorizontal, Trash2, Download, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { StudentFullDetails } from "./mockStudentDetails";

interface StudentDetailsHeaderProps {
  student: StudentFullDetails;
  onEdit?: () => void;
}

export function StudentDetailsHeader({
  student,
  onEdit,
}: StudentDetailsHeaderProps) {
  return (
    <div className="space-y-4 mb-6 text-left">
      {/* 1. Reusable Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Students", href: "/students" },
          { label: "Student Details" },
        ]}
      />

      {/* 2. Main Profile Header Card */}
      <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Back button */}
          <Link
            href="/students"
            className="p-2.5 rounded-lg border border-dash text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors w-fit shadow-2xs self-start"
            title="Back to Students list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Avatar with Initials / Photo */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-14 to-[#DBEAFE] border-2 border-white shadow-md flex items-center justify-center shrink-0 text-blue font-bold text-2xl tracking-tight">
            {student.initials}
          </div>

          {/* Student Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="heading-h3 font-bold text-primary-500">
                {student.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                  student.status === "Active"
                    ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    student.status === "Active" ? "bg-[#10B981]" : "bg-[#94A3B8]"
                  }`}
                />
                {student.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-primary-400 body-sm-regular">
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded-md text-primary-500 font-medium whitespace-nowrap shrink-0">
                ID: {student.studentIdCode}
              </span>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary-300" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-300" />
                <span>Joined {student.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 relative">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue hover:bg-[#1D60E3] active:bg-[#1853C9] text-white body-sm-medium transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 stroke-[2.2]" />
            <span>Edit Student</span>
          </button>

          {/* More options button with Radix UI dropdown menu */}
          <AppDropdownMenu
            trigger={
              <button
                type="button"
                className="p-2 rounded-lg border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
            items={[
              {
                key: "send-message",
                label: "Send Message",
                icon: <Send className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () =>
                  toast(`Composing email to ${student.email}`, {
                    icon: "✉️",
                  }),
              },
              {
                key: "export-profile",
                label: "Export Profile",
                icon: <Download className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () =>
                  toast.success(`Exported ${student.name}'s profile record`),
              },
              {
                key: "delete-student",
                label: "Delete Student",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                danger: true,
                separatorBefore: true,
                onClick: () =>
                  toast.error("Student cannot be removed from here"),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
