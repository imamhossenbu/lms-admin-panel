"use client";

import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Clock,
  StickyNote,
} from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";

export type StudentTabKey =
  | "overview"
  | "enrolled-courses"
  | "assignments"
  | "quizzes"
  | "certificates"
  | "activity-log"
  | "notes";

const TABS = [
  { id: "overview" as const, label: "Overview", icon: <LayoutDashboard /> },
  { id: "enrolled-courses" as const, label: "Enrolled Courses", icon: <BookOpen />, count: 6 },
  { id: "assignments" as const, label: "Assignments", icon: <FileText />, count: 6 },
  { id: "quizzes" as const, label: "Quizzes", icon: <HelpCircle />, count: 7 },
  { id: "certificates" as const, label: "Certificates", icon: <Award />, count: 4 },
  { id: "activity-log" as const, label: "Activity Log", icon: <Clock /> },
  { id: "notes" as const, label: "Notes", icon: <StickyNote />, count: 5 },
];

interface StudentDetailsTabsProps {
  activeTab: StudentTabKey;
  onTabChange: (tab: StudentTabKey) => void;
}

export function StudentDetailsTabs({ activeTab, onTabChange }: StudentDetailsTabsProps) {
  return (
    <PillTabs<StudentTabKey>
      className="mb-6 py-1"
      tabs={TABS}
      activeId={activeTab}
      onChange={onTabChange}
    />
  );
}
