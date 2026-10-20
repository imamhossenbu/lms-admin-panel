"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { AdminCourseItem } from "@/lib/types";

interface CourseDetailsLearnersProps {
  course: AdminCourseItem;
}

export function CourseDetailsLearners({ course }: CourseDetailsLearnersProps) {
  const sampleLearners = [
    {
      name: "Rafiqul Islam",
      email: "rafiqul.dev@gmail.com",
      progress: 88,
      status: "Active",
      enrolledDate: "2 days ago",
    },
    {
      name: "Sharmin Sultana",
      email: "sharmin.s@techcorp.io",
      progress: 64,
      status: "Active",
      enrolledDate: "1 week ago",
    },
    {
      name: "Anisur Rahman",
      email: "anisur@bu.edu.bd",
      progress: 100,
      status: "Completed",
      enrolledDate: "2 weeks ago",
    },
    {
      name: "Mehedi Hasan",
      email: "mehedi.cse@gmail.com",
      progress: 42,
      status: "Active",
      enrolledDate: "3 weeks ago",
    },
  ];

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
          <span className="body-xsm-regular subtext-500 block">Total Enrolled</span>
          <span className="title-sm text-primary-500 font-bold block mt-0.5">
            {course.totalStudents.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
          <span className="body-xsm-regular subtext-500 block">Completion Rate</span>
          <span className="title-sm text-emerald-600 font-bold block mt-0.5">
            78.4%
          </span>
        </div>
        <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
          <span className="body-xsm-regular subtext-500 block">Average Quiz Score</span>
          <span className="title-sm text-[#1C4D8D] font-bold block mt-0.5">
            91.2%
          </span>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#EDEDED] overflow-hidden">
        <div className="px-4 py-3 bg-[#F8F9FA] border-b border-[#EDEDED] flex items-center justify-between">
          <span className="body-sm-medium text-primary-500 font-bold">
            Recent Enrolled Learners
          </span>
          <span className="body-xsm-regular subtext-500">Live Roster</span>
        </div>
        <div className="divide-y divide-[#EDEDED] bg-white">
          {sampleLearners.map((learner, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Avatar name={learner.name} size="sm" />
                <div>
                  <span className="body-sm-medium text-primary-500 font-semibold block leading-tight">
                    {learner.name}
                  </span>
                  <span className="body-xsm-regular subtext-500">
                    {learner.email} • {learner.enrolledDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="body-xsm-medium text-primary-500 font-bold block">
                    {learner.progress}%
                  </span>
                  <span className="body-2xsm-regular subtext-500">Completed</span>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#1C4D8D] rounded-full"
                    style={{ width: `${learner.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
