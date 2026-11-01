import React from "react";
import { BookOpen, GraduationCap, LayoutDashboard, Sparkles, Wallet } from "lucide-react";
import type { PillTabItem } from "@/components/ui/PillTabs";
import { ANALYTICS_TABS, type AnalyticsTab } from "./analyticsReport";

export const ANALYTICS_TAB_ITEMS: PillTabItem<AnalyticsTab>[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
  { id: "revenue", label: "Revenue", icon: <Wallet /> },
  { id: "students", label: "Students", icon: <GraduationCap /> },
  { id: "courses", label: "Courses", icon: <BookOpen /> },
  { id: "engagement", label: "Engagement", icon: <Sparkles /> },
];

export const parseAnalyticsTab = (value: string | null | undefined): AnalyticsTab =>
  ANALYTICS_TABS.includes(value as AnalyticsTab) ? (value as AnalyticsTab) : "overview";
