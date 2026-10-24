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
  activeBg: string;
  activeText: string;
  activeBadgeBg: string;
  activeBadgeText: string;
}

const TABS: TabItemConfig[] = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    activeBg: "bg-[#EBF4FC]",
    activeText: "text-[#1C4D8D]",
    activeBadgeBg: "bg-[#DBEAFE]",
    activeBadgeText: "text-[#1C4D8D]",
  },
  {
    key: "enrolled-courses",
    label: "Enrolled Courses",
    icon: BookOpen,
    count: 6,
    activeBg: "bg-[#FFF7ED]",
    activeText: "text-[#EA580C]",
    activeBadgeBg: "bg-[#FFEDD5]",
    activeBadgeText: "text-[#EA580C]",
  },
  {
    key: "assignments",
    label: "Assignments",
    icon: FileText,
    count: 4,
    activeBg: "bg-[#FAF5FF]",
    activeText: "text-[#9333EA]",
    activeBadgeBg: "bg-[#F3E8FF]",
    activeBadgeText: "text-[#9333EA]",
  },
  {
    key: "quizzes",
    label: "Quizzes",
    icon: HelpCircle,
    count: 8,
    activeBg: "bg-[#ECFDF5]",
    activeText: "text-[#059669]",
    activeBadgeBg: "bg-[#D1FAE5]",
    activeBadgeText: "text-[#059669]",
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: Award,
    count: 2,
    activeBg: "bg-[#FFFBEB]",
    activeText: "text-[#D97706]",
    activeBadgeBg: "bg-[#FEF3C7]",
    activeBadgeText: "text-[#D97706]",
  },
  {
    key: "activity-log",
    label: "Activity Log",
    icon: Clock,
    activeBg: "bg-[#F0F9FF]",
    activeText: "text-[#0284C7]",
    activeBadgeBg: "bg-[#E0F2FE]",
    activeBadgeText: "text-[#0284C7]",
  },
  {
    key: "notes",
    label: "Notes",
    icon: StickyNote,
    activeBg: "bg-[#FFF1F2]",
    activeText: "text-[#E11D48]",
    activeBadgeBg: "bg-[#FFE4E6]",
    activeBadgeText: "text-[#E11D48]",
  },
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
              className={`relative whitespace-nowrap px-3.5 py-2 rounded-xl body-sm-medium transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 z-10 select-none ${
                isActive
                  ? `${tab.activeText} font-semibold shadow-2xs`
                  : "text-primary-400 hover:text-primary-500 hover:bg-white/50"
              }`}
            >
              {/* Distinct Active Animated Background Pill per Tab */}
              {isActive && (
                <motion.div
                  layoutId="studentDetailsActivePill"
                  className={`absolute inset-0 rounded-xl ${tab.activeBg} -z-10`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? tab.activeText : "text-primary-400"
                }`}
              />

              {/* Tab Label */}
              <span>{tab.label}</span>

              {/* Tab Count Badge */}
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none transition-colors ${
                    isActive
                      ? `${tab.activeBadgeBg} ${tab.activeBadgeText}`
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
