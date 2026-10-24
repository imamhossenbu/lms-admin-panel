"use client";

import React, { useState } from "react";
import { TrendingUp, CheckCircle, Clock, FileText, Award, ChevronDown } from "lucide-react";
import { StudentFullDetails } from "./mockStudentDetails";

interface LearningProgressCardProps {
  student: StudentFullDetails;
}

export function LearningProgressCard({ student }: LearningProgressCardProps) {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("All Courses");
  const { learningMetrics, overallProgress } = student;

  // Donut chart math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="title-medium font-bold text-primary-500">
            Learning Progress
          </h2>
        </div>

        {/* Course Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-8 pl-3 pr-7 rounded-lg border border-dash bg-[#F8FAFC] body-xsm-medium text-primary-500 appearance-none focus:outline-none focus:border-blue cursor-pointer"
          >
            <option value="All Courses">All Courses</option>
            <option value="HTML Fundamentals">HTML Fundamentals</option>
            <option value="CSS & Responsive Design">CSS &amp; Responsive Design</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-primary-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Content: Donut + Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Left: Donut Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-slate-100"
                strokeWidth="11"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress stroke */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#2563EB"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="heading-h3 font-bold text-primary-500 tracking-tight leading-none">
                {overallProgress}%
              </span>
              <span className="body-2xsm-regular text-primary-300 mt-1">
                Overall Progress
              </span>
            </div>
          </div>
        </div>

        {/* Right: 4 Metrics Bars */}
        <div className="sm:col-span-7 space-y-3.5">
          {/* Metric 1: Completed Lessons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between body-xsm-medium">
              <div className="flex items-center gap-2 text-primary-400">
                <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span>Completed Lessons</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-300">
                  {learningMetrics.completedLessons.current} / {learningMetrics.completedLessons.total}
                </span>
                <span className="font-semibold text-primary-500 w-8 text-right">
                  {learningMetrics.completedLessons.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] rounded-full"
                style={{ width: `${learningMetrics.completedLessons.percentage}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Quizzes Passed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between body-xsm-medium">
              <div className="flex items-center gap-2 text-primary-400">
                <div className="w-5 h-5 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>Quizzes Passed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-300">
                  {learningMetrics.quizzesPassed.current} / {learningMetrics.quizzesPassed.total}
                </span>
                <span className="font-semibold text-primary-500 w-8 text-right">
                  {learningMetrics.quizzesPassed.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue rounded-full"
                style={{ width: `${learningMetrics.quizzesPassed.percentage}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Assignments Submitted */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between body-xsm-medium">
              <div className="flex items-center gap-2 text-primary-400">
                <div className="w-5 h-5 rounded-full bg-[#FFF4ED] text-[#F97316] flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>Assignments Submitted</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-300">
                  {learningMetrics.assignmentsSubmitted.current} / {learningMetrics.assignmentsSubmitted.total}
                </span>
                <span className="font-semibold text-primary-500 w-8 text-right">
                  {learningMetrics.assignmentsSubmitted.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F97316] rounded-full"
                style={{ width: `${learningMetrics.assignmentsSubmitted.percentage}%` }}
              />
            </div>
          </div>

          {/* Metric 4: Certificates Earned */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between body-xsm-medium">
              <div className="flex items-center gap-2 text-primary-400">
                <div className="w-5 h-5 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span>Certificates Earned</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-300">
                  {learningMetrics.certificatesEarned.current} / {learningMetrics.certificatesEarned.total}
                </span>
                <span className="font-semibold text-primary-500 w-8 text-right">
                  {learningMetrics.certificatesEarned.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9333EA] rounded-full"
                style={{ width: `${learningMetrics.certificatesEarned.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
