"use client";

import React from "react";
import { motion } from "framer-motion";

export type StudentTabKey =
  | "overview"
  | "enrolled-courses"
  | "assignments"
  | "quizzes"
  | "certificates"
  | "activity-log"
  | "notes";

interface TabItemConfig {
  key: StudentTabKey;
  label: string;
}

const TABS: TabItemConfig[] = [
  { key: "overview", label: "Overview" },
  { key: "enrolled-courses", label: "Enrolled Courses" },
  { key: "assignments", label: "Assignments" },
  { key: "quizzes", label: "Quizzes" },
  { key: "certificates", label: "Certificates" },
  { key: "activity-log", label: "Activity Log" },
  { key: "notes", label: "Notes" },
];

interface StudentDetailsTabsProps {
  activeTab: StudentTabKey;
  onTabChange: (tab: StudentTabKey) => void;
}

export function StudentDetailsTabs({
  activeTab,
  onTabChange,
}: StudentDetailsTabsProps) {
  return (
    <div className="mb-6 border-b border-dash overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-7 sm:gap-8 min-w-max px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative pb-3 body-sm-medium transition-colors cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? "text-blue font-semibold"
                  : "text-primary-400 hover:text-primary-500 font-medium"
              }`}
            >
              <span>{tab.label}</span>

              {/* Active Underline Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="studentDetailsActiveTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-[2.5px] bg-blue rounded-full"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
