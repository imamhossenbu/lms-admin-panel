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

type CountedTab = Exclude<StudentTabKey, "overview" | "activity-log">;

const TABS: { id: StudentTabKey; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
  { id: "enrolled-courses", label: "Enrolled Courses", icon: <BookOpen /> },
  { id: "assignments", label: "Assignments", icon: <FileText /> },
  { id: "quizzes", label: "Quizzes", icon: <HelpCircle /> },
  { id: "certificates", label: "Certificates", icon: <Award /> },
  { id: "activity-log", label: "Activity Log", icon: <Clock /> },
  { id: "notes", label: "Notes", icon: <StickyNote /> },
];

interface StudentDetailsTabsProps {
  activeTab: StudentTabKey;
  onTabChange: (tab: StudentTabKey) => void;
  /** Badge counts from the loaded records. */
  counts: Record<CountedTab, number>;
}

export function StudentDetailsTabs({ activeTab, onTabChange, counts }: StudentDetailsTabsProps) {
  const tabs = TABS.map((t) => (t.id in counts ? { ...t, count: counts[t.id as CountedTab] } : t));
  return <PillTabs<StudentTabKey> className="mb-6 py-1" tabs={tabs} activeId={activeTab} onChange={onTabChange} />;
}
