"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Clock,
  StickyNote,
  LucideIcon,
} from "lucide-react";

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
  icon: LucideIcon;
  count?: number;
}

const TABS: TabItemConfig[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "enrolled-courses", label: "Enrolled Courses", icon: BookOpen, count: 6 },
  { key: "assignments", label: "Assignments", icon: FileText, count: 4 },
  { key: "quizzes", label: "Quizzes", icon: HelpCircle, count: 8 },
  { key: "certificates", label: "Certificates", icon: Award, count: 2 },
  { key: "activity-log", label: "Activity Log", icon: Clock },
  { key: "notes", label: "Notes", icon: StickyNote },
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
    <div className="mb-6 overflow-x-auto scrollbar-none py-1">
      {/* Full background container without borders */}
      <div className="bg-[#F1F5F9] p-1.5 rounded-2xl flex items-center gap-1.5 w-fit min-w-full sm:min-w-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative whitespace-nowrap px-4 py-2 rounded-xl body-sm-medium transition-all duration-150 cursor-pointer flex items-center gap-2 shrink-0 z-10 select-none ${
                isActive
                  ? "text-primary-500 font-semibold shadow-xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-white/60"
              }`}
            >
              {/* Active Animated White Pill (Consistent background across all tabs) */}
              {isActive && (
                <motion.div
                  layoutId="studentDetailsActivePill"
                  className="absolute inset-0 rounded-xl bg-white -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {/* Icon */}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-primary-500" : "text-primary-400"
                }`}
              />

              {/* Tab Label */}
              <span>{tab.label}</span>

              {/* Tab Count Badge */}
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0 inline-flex items-center transition-colors ${
                    isActive
                      ? "bg-slate-100 text-primary-500"
                      : "bg-slate-200/80 text-primary-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
