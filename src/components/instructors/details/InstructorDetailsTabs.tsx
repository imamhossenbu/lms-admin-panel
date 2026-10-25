"use client";

import React from "react";
import { LayoutDashboard, BookOpen, Users, Star, CalendarDays, StickyNote, Clock } from "lucide-react";
import { PillTabs } from "@/components/ui/PillTabs";
import { InstructorFullDetails } from "./instructorDetailsData";

export const INSTRUCTOR_TABS = [
  "overview",
  "courses",
  "students",
  "reviews",
  "schedule",
  "notes",
  "activity-log",
] as const;
export type InstructorTabKey = (typeof INSTRUCTOR_TABS)[number];

export const isInstructorTab = (value: string | null): value is InstructorTabKey =>
  !!value && (INSTRUCTOR_TABS as readonly string[]).includes(value);

interface InstructorDetailsTabsProps {
  details: InstructorFullDetails;
  notesCount: number;
  activeTab: InstructorTabKey;
  onTabChange: (tab: InstructorTabKey) => void;
}

export function InstructorDetailsTabs({ details, notesCount, activeTab, onTabChange }: InstructorDetailsTabsProps) {
  return (
    <PillTabs<InstructorTabKey>
      className="py-1"
      activeId={activeTab}
      onChange={onTabChange}
      tabs={[
        { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
        { id: "courses", label: "Courses", icon: <BookOpen />, count: details.courses.length },
        { id: "students", label: "Students", icon: <Users />, count: details.students.length },
        { id: "reviews", label: "Reviews", icon: <Star />, count: details.reviews.length },
        { id: "schedule", label: "Schedule", icon: <CalendarDays /> },
        { id: "notes", label: "Notes", icon: <StickyNote />, count: notesCount },
        { id: "activity-log", label: "Activity Log", icon: <Clock /> },
      ]}
    />
  );
}

export default InstructorDetailsTabs;
