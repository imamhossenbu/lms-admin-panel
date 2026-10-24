"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Edit3, MoreHorizontal, Trash2, Download, Send } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StudentFullDetails } from "./mockStudentDetails";
import { toast } from "sonner";

interface StudentDetailsHeaderProps {
  student: StudentFullDetails;
  onEdit?: () => void;
}

export function StudentDetailsHeader({
  student,
  onEdit,
}: StudentDetailsHeaderProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="space-y-4 mb-6 text-left">
      {/* 1. Reusable Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Students", href: "/students" },
          { label: "Student Details" },
        ]}
      />

      {/* 2. Main Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Back to Students Button */}
          <Link
            href="/students"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-primary-400" />
            <span>Back to Students</span>
          </Link>

          {/* Avatar Circle with Initials */}
          <div className="w-12 h-12 rounded-full bg-[#E0E7FF] text-[#3B82F6] font-bold text-base flex items-center justify-center shrink-0 border border-[#BFDBFE]">
            {student.initials}
          </div>

          {/* Student Name & Meta Info */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">
                {student.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {student.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 body-sm-regular text-primary-300 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-300" />
                <span>{student.email}</span>
              </div>
              <span className="text-primary-300/60">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-300" />
                <span>Joined {student.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 relative">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue hover:bg-[#1D60E3] active:bg-[#1853C9] text-white body-sm-medium transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 stroke-[2.2]" />
            <span>Edit Student</span>
          </button>

          {/* More options button with dropdown menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-lg border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg border border-dash shadow-lg py-1 z-30 divide-y divide-dash">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      toast.info("Sending Email", {
                        description: `Composing email to ${student.email}`,
                      });
                    }}
                    className="w-full px-3.5 py-2 text-left body-sm-regular text-primary-500 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-primary-400" />
                    <span>Send Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      toast.success("Profile Exported", {
                        description: `Exported ${student.name}'s record.`,
                      });
                    }}
                    className="w-full px-3.5 py-2 text-left body-sm-regular text-primary-500 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-primary-400" />
                    <span>Export Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      toast.error("Action Unavailable", {
                        description: "Student cannot be removed from here.",
                      });
                    }}
                    className="w-full px-3.5 py-2 text-left body-sm-regular text-red hover:bg-red-14/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Student</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
