import React from "react";
import { Users, BookOpen, DollarSign, Award } from "lucide-react";
import { StatGroupCard } from "@/components/ui/StatGroupCard";
import { StatItem } from "@/components/ui/StatCard";

interface OverviewStatsProps {
  stats?: {
    totalStudents?: number;
    totalCourses?: number;
    totalRevenue?: number;
    completionRate?: number;
    currency?: string;
  };
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const currencySymbol = stats?.currency === "BDT" ? "৳" : "$";
  const revenueValue = stats?.totalRevenue !== undefined
    ? `${currencySymbol}${stats.totalRevenue.toLocaleString()}`
    : "$148,250";

  const statItems: StatItem[] = [
    {
      label: "Total Students",
      value: (stats?.totalStudents ?? 12480).toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      trend: { direction: "up", value: "14.2%", comparisonLabel: "vs last month" },
      accentColor: "blue",
    },
    {
      label: "Gross Revenue",
      value: revenueValue,
      icon: <DollarSign className="w-5 h-5" />,
      trend: { direction: "up", value: "22.4%", comparisonLabel: "vs last month" },
      accentColor: "emerald",
    },
    {
      label: "Published Courses",
      value: (stats?.totalCourses ?? 84).toString(),
      icon: <BookOpen className="w-5 h-5" />,
      trend: { direction: "up", value: "8.5%", comparisonLabel: "vs last month" },
      accentColor: "purple",
    },
    {
      label: "Avg Completion Rate",
      value: `${stats?.completionRate ?? 78.6}%`,
      icon: <Award className="w-5 h-5" />,
      trend: { direction: "up", value: "5.1%", comparisonLabel: "vs last month" },
      accentColor: "amber",
    },
  ];

  return <StatGroupCard stats={statItems} columns={4} />;
}
