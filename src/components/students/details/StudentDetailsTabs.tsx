"use client";

import React from "react";

export type StudentTabKey =
  | "overview"
  | "enrolled-courses"
  | "assignments"
  | "quizzes"
  | "certificates"
  | "activity-log"
  | "notes";

interface TabItem {
  key: StudentTabKey;
  label: string;
}

const TABS: TabItem[] = [
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
    <div className="border-b border-dash mb-6 overflow-x-auto scrollbar-none">
      <nav className="flex items-center gap-6 -mb-px text-left min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`pb-3 body-sm-medium transition-colors cursor-pointer relative ${
                isActive
                  ? "text-blue font-bold border-b-2 border-blue"
                  : "text-primary-400 hover:text-primary-500 hover:border-primary-300 border-b-2 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
